# RoseBudThorn: The Reflective Text Message Bot
![Screenshot 2023-10-25 at 8 04 59 PM](https://github.com/MarlonGrandy/RoseBudThorn/assets/106160715/c2cf765c-ef5e-4d4e-b551-743d03ba01ad)

## About
![Screenshot 2023-10-25 at 8 09 46 PM](https://github.com/MarlonGrandy/RoseBudThorn/assets/106160715/61efd02f-33a2-4f49-9869-f995e2897a33)

RoseBudThorn offers a refreshing and engaging approach to reflection through the metaphor of a garden. It uses the concepts of Rose (achievements), Bud (opportunities), and Thorn (challenges) to allow users to reflect upon their weekly journey. This application delivers a vibrant dashboard, representing the user's emotional and motivational garden.

With the weekly summary feature, users can:
- Celebrate their 'Roses' or achievements
- Nurture their 'Buds' or opportunities
- Address the 'Thorns' or challenges

This textbot not only prompts users to move forward but also to reflect on their journey, ensuring every aspect is cherished.


## Getting Started

If you wish to run this repository locally, please be aware that the repository does not work from an initial clone since only the source code is included. To get it up and running:

### Frontend:

1. Clone the repository:
```
git clone <repo_link>
```

2. Create a new React project:
```
npx create-react-app rosebudthorn-app
```

3. Navigate to the newly created React project directory:
```
cd rosebudthorn-app
```

4. Copy the source code from the cloned repository to the React project:
```
cp -R path_to_cloned_repo/src/* ./src/
```

5. Install required dependencies:
```
npm install
```

6. Run the application:
```
npm start
```

### Backend:

1. Navigate to the backend directory:
```
cd path_to_backend_directory
```

2. Run the Flask server:
```
python app.py
```

3. To connect the local server to the internet (so it can interact with Twilio), you need to use `ngrok`. In a new terminal, run:
```
ngrok http 5000
```

Note: Ensure you have `ngrok` installed. If not, download it from [here](https://ngrok.com/download).

4. Copy the HTTPS URL provided by `ngrok` and configure it in your Twilio account for incoming webhooks.

**Important:** You will need a Twilio account to handle text messaging. Make sure to configure your webhook in Twilio to point to the HTTPS link provided by `ngrok`.

## Contributing

This project is still a work in progress. I appreciate any feedback, issues, or pull requests from the community. Let's work together to make RoseBudThorn even better!

## License

[MIT License](LICENSE)

---

I hope you enjoy nurturing your personal garden with RoseBudThorn and witness your potential bloom, one reflection at a time! 🌹🌱🌵

---

