
import openai
import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
import time
from datetime import date
import logging
from collections import Counter
from textblob import TextBlob
import nltk
from nltk.corpus import stopwords

# Set up logging
logging.basicConfig(level=logging.INFO)

# Initialize Flask app with Cross Origin Resource Sharing (CORS)
app = Flask(__name__)
CORS(app)

# Firebase credentials and initialization
cred = credentials.Certificate(
    "./pickmeup-e5862-firebase-adminsdk-kxi4z-48276b190a.json")
firebase_admin.initialize_app(cred)

# Firestore database instance
db = firestore.client()

# Twilio configuration
account_sid = 'AC94e5cae37969a23c8ac6e359f7aeb6fa'
auth_token = 'b1a9226f1e1d9201a5ade5a6f4ca4b03'
client = Client(account_sid, auth_token)

# OpenAI configuration
openai.api_key = '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'


def ask_about_day():
    """Fetch all users from Firestore and prompt them about their day."""
    users = db.collection('users').get()
    for user in users:
        user_data = user.to_dict()
        client.messages.create(
            body="Hey {0}, when you have a few minutes to reflect on your day today, reply with 'Ready'!".format(
                user_data['first_name']),
            from_="+18775475144",
            to="+1" + user_data['phone_number']
        )

# schedule.every().day.at("17:21").do(ask_about_day)


def send_weekly_summary():
    """Fetch all users and send them their weekly summary."""
    users = db.collection('users').get()
    for user in users:
        user_data = user.to_dict()
        # You would then call the weekly_summary function to generate the summary for each user
        summary = weekly_summary(user_data['uuid'])
        client.messages.create(
            body=summary,
            from_="+18775475144",
            to="+1" + user_data['phone_number']
        )

# schedule.every().sunday.at("19:00").do(send_weekly_summary)


@app.route("/sms", methods=['POST'])
def sms_reply():
    '''Gets the user response for rose-bud-thorn using multiple conversation states stored in firestore'''
    body = str(request.values.get('Body', None)).lower()
    from_number = request.values.get('From', None)

    # Error handling for user data retrieval
    try:
        user_data = db.collection('users').where(
            'phone_number', '==', from_number[2:]).get()[0].to_dict()
    except Exception as e:
        return f"Error retrieving user data: {e}", 500

    user_id = user_data['uuid']
    conversation_state = user_data['conversation_state']
    user_chat_style = "happy"

    # Adjusting the reference to user_reflections subcollection
    user_reflections_subcol = db.collection('reflections').document(
        user_id).collection('user_reflections')

    # Using the date as the document ID for user reflections
    reflection_doc_id = date.today().strftime('%Y-%m-%d')

    if conversation_state == 0 and body == 'ready':
        next_question = "What was the Bud (something you are looking forward to)?"
        response = generate_response(
            user_data['first_name'], user_chat_style, '', next_question, conversation_state)
        send_response(response, from_number)
        db.collection('users').document(
            user_id).update({'conversation_state': 1})

    elif conversation_state == 1:
        bud = body
        next_question = "What was the Thorn (a challenge or something that didn't go well) of your day?"
        response = generate_response(
            user_data['first_name'], user_chat_style, bud, next_question, conversation_state)
        send_response(response, from_number)
        db.collection('users').document(
            user_id).update({'conversation_state': 2})

        user_reflections_subcol.document(reflection_doc_id).set({
            'bud': bud,
            'date': reflection_doc_id
        })

    elif conversation_state == 2:
        thorn = body
        next_question = "And, what was the Rose (something good or satisfying) of your day?"
        response = generate_response(
            user_data['first_name'], user_chat_style, thorn, next_question, conversation_state)
        send_response(response, from_number)
        db.collection('users').document(
            user_id).update({'conversation_state': 3})

        user_reflections_subcol.document(reflection_doc_id).update({
            'thorn': thorn
        })

    elif conversation_state == 3:
        rose = body
        response = generate_response(
            user_data['first_name'], user_chat_style, rose, '', conversation_state)
        send_response(response, from_number)
        db.collection('users').document(
            user_id).update({'conversation_state': 0})

        # Update the reflection document with the Rose
        user_reflections_subcol.document(reflection_doc_id).update({
            'rose': rose
        })

    return "Message sent", 200


def generate_response(user_name, user_chat_style, user_answer, next_question, state):
    """Generate a response using OpenAI based on the user's input and the current state of the conversation."""
    # ... Rest of the code ...
    logging.info('generate_response function called')
    prompts = {
        0: 'Rewrite this in the style of {}: {}',
        1: 'In the style of {}, respond to the user sharing their Bud and then ask the following question: {}',
        2: 'In the style of {}, respond to the user sharing their Thorn and then ask the following question: {}',
        3: 'In the style of {}, respond to the user sharing their Rose and provide a closing statement for the day.'
    }
    emojis = {
        1: '🌱',  # Bud
        2: '🥀',  # Thorn
        3: '🌹'   # Rose
    }
    prompt = prompts[state].format(
        "happy", next_question) + emojis.get(state, '')
    logging.info(f'Generated prompt: {prompt}')
    response = openai.Completion.create(
        engine="text-davinci-003", prompt=prompt, max_tokens=150, temperature=0.85)
    logging.info(f'Generated AI response: {response}')
    response_text = response.choices[0]['text']
    logging.info(f'Final response: {response_text}')
    return response_text


def send_response(response, from_number):
    """Send an SMS response using the Twilio API."""
    client.messages.create(
        body=response,
        from_="+18775475144",
        to=from_number
    )


@app.route('/api/authenticate', methods=['POST'])
def authenticate_user():
    """Authenticate the user using Firebase Authentication."""
    # Get the username and password from the request body
    username = request.json.get('username')
    password = request.json.get('password')

    try:
        # Authenticate the user with Firebase Authentication
        user = auth.get_user_by_email(email=username)
        user_ref = db.collection('users').document(user.uid)
        user_data = user_ref.get().to_dict()

        if user_data is not None and 'hasLoggedIn' in user_data and not user_data['hasLoggedIn']:
            # Update 'hasLoggedIn' to True
            user_ref.update({'hasLoggedIn': True})

        return jsonify({'message': 'Authentication successful', 'uuid': user.uid}), 200
    except auth.AuthError as e:
        error_message = str(e)
        return jsonify({'message': 'Authentication failed', 'error': error_message}), 401


@app.route('/api/signup', methods=['POST'])
def signup_user():
    """Signup a new user using Firebase Authentication."""
    # Get the email and password from the request body
    email = request.json.get('email')
    password = request.json.get('password')

    try:
        # Create a new user with Firebase Authentication
        user = auth.create_user(email=email, password=password)

        # Generate a UUID for the user
        user = auth.get_user_by_email(email=email)

        # Create a new user document in the Firestore collection
        user_ref = db.collection('users').document(user.uid)
        user_ref.set({
            'uuid': user.uid,
            'hasLoggedIn': False,
            'conversation_state': 0
        })

        return jsonify({'message': 'Signup successful', 'uuid': user.uid}), 201
    except auth.AuthError as e:
        error_message = str(e)
        return jsonify({'message': 'Signup failed', 'error': error_message}), 400


@app.route('/api/user/update', methods=['PUT'])
def update_user():
    """Update the user's data in Firestore on completion of signup form."""
    user_data = request.json
    user_id = user_data.get('userId')

    try:
        # Get the user document from Firestore
        user_ref = db.collection('users').document(user_id)

        # Update the user document with the provided user data
        user_ref.update({
            'first_name': user_data.get('first_name', ''),
            'last_name': user_data.get('last_name', ''),
            'phone_number': user_data.get('phone_number', ''),
            'chat_style': user_data.get('chat_style', ''),
            'hasLoggedIn': True,  # Set the hasLoggedIn field to True
            # Add additional fields here
        })

        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        error_message = str(e)
        return jsonify({'message': 'User update failed', 'error': error_message}), 400


def weekly_summary(user_id):
    """Use the OpenAI API to generate a creative weekly summary based on user reflections."""

    nltk.download('stopwords')
    stop_words = stopwords.words('english')

    reflections = db.collection('reflections').document(user_id).collection('user_reflections').order_by(
        'date', direction=firestore.Query.DESCENDING).limit(7).get()

    # Create a bag of words and analyze sentiment
    bag_of_words = Counter()
    sentiments = []

    for reflection in reflections:
        day_data = reflection.to_dict()
        for key, value in day_data.items():
            if key in ['bud', 'thorn', 'rose']:
                words = [word for word in value.split() if word.lower()
                         not in stop_words]
                bag_of_words.update(words)
                blob = TextBlob(value)
                sentiments.append(blob.sentiment.polarity)

    # Calculate the average sentiment
    if len(sentiments) > 0:
        avg_sentiment = sum(sentiments) / len(sentiments)
    else:
        avg_sentiment = 0

    # Determine sentiment description
    if avg_sentiment > 0.5:
        sentiment_desc = 'positive'
    elif avg_sentiment < -0.5:
        sentiment_desc = 'challenging'
    else:
        sentiment_desc = 'mixed'

    common_words = bag_of_words.most_common(5)
    themes = ', '.join([word[0] for word in common_words])

    # Use the OpenAI API to generate a creative summary
    prompt = f"The weeks sentiment score for rose, bud, thorn reflections was {avg_sentiment} and the recurring words in the reflections were {themes}. Create a personalized summary of these results for the specific user. Don't specifically mention snetiment score discuss what the score represents for the user. Talk using your and you."

    response = openai.Completion.create(
        engine="text-davinci-003", prompt=prompt, max_tokens=60, temperature=0.85)

    summary_text = response.choices[0].text.strip()

    # Store the summary in Firebase
    user_summaries_subcol = db.collection('summaries').document(
        user_id).collection('user_summaries')
    user_summaries_subcol.add({
        'date': date.today().strftime('%Y-%m-%d'),
        'summary': summary_text
    })
    return summary_text


@app.route('/api/reflections', methods=['POST'])
def get_reflections():
    """Fetch the user's reflections based on their user_id."""
    user_id = request.json.get('user_id')

    if not user_id:
        return jsonify({'message': 'user_id not provided'}), 400

    try:
        # Fetch the reflections for the given user from Firestore
        user_reflections = db.collection('reflections').document(
            user_id).collection('user_reflections').stream()

        reflections_data = {}
        for reflection in user_reflections:
            data = reflection.to_dict()
            reflections_data[data['date']] = {
                'bud': data.get('bud'),
                'thorn': data.get('thorn'),
                'rose': data.get('rose'),
            }

        if not reflections_data:
            return jsonify({'message': 'No reflections found for this user.'}), 404

        return jsonify(reflections_data), 200
    except Exception as e:
        error_message = str(e)
        return jsonify({'message': 'Error fetching reflections', 'error': error_message}), 500


@app.route('/api/summaries', methods=['POST'])
def get_summaries():
    """Fetch the user's weekly summaries based on their user_id."""
    user_id = request.json.get('user_id')

    if not user_id:
        return jsonify({'message': 'user_id not provided'}), 400

    try:
        # Fetch the reflections for the given user from Firestore
        user_summaries = db.collection('summaries').document(
            user_id).collection('user_summaries').stream()

        summary_data = {}
        for summary in user_summaries:
            data = summary.to_dict()
            summary_data[data['date']] = {
                'summary': data.get('summary')
            }

        if not summary_data:
            return jsonify({'message': 'No reflections found for this user.'}), 404

        return jsonify(summary_data), 200
    except Exception as e:
        error_message = str(e)
        return jsonify({'message': 'Error fetching reflections', 'error': error_message}), 500


if __name__ == '__main__':
    app.run(port=8000, debug=True)
