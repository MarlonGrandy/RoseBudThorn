// Importing necessary modules and components from respective libraries.
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './landing.css';
import phoneImage from './images/phoneImage.png';

// Importing images for social media buttons.
import facebookImage from './images/facebookImage.png';
import appleImage from './images/appleImage.png';
import googleImage from './images/googleImage.png';

// Setting axios default baseURL for making HTTP requests.
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

// Define the LandingPage functional component.
const LandingPage = () => {
  // React useState hooks for managing the component's local state.
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // Function to handle user login.
  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/authenticate', { username: emailOrUsername, password });
      console.log(response.data);
      let userId = response.data.uuid;
      navigate('/userHome', { state: { userId } });
    } catch (err) {
      console.error(err);
    }
  };

  // Function to check if the password and its verification match.
  const checkPasswordMatch = (verifyingPassword) => {
    setPasswordMatch(password === verifyingPassword);
  };

  // Function to handle user registration.
  const handleSignup = async () => {
    if (password !== verifyPassword) {
      console.log('Passwords do not match');
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);
    try {
      const response = await axios.post('/api/signup', { email: emailOrUsername, password });
      console.log(response.data);
      let userId = response.data.uuid;
      navigate('/form', {state: {userId}});
    } catch (err) {
      console.error(err);
    }
  };

  // Decide whether to handle sign-in or sign-up based on the isSignup state.
  const handleSignIn = isSignup ? handleSignup : handleLogin;

  // JSX to render the landing page.
  return (
    <div class="main-container">
      <div className="landing-container">
      <div className="logo">
    <div className="welcome-section">
      <div className="welcome-message">
        <h1>👋 Welcome to RoseBudThorn!</h1>
        <p>Your go-to platform for daily reflection 🚀</p>
      </div>
      <img src={phoneImage} alt="svg" style={{ width: "600px", height: "auto", borderRadius: "20px" }} />

    </div>
  </div>

  <div className="right-container">
  <div className="nav-container">
  <div className="nav-links">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </div>
  <hr />
</div>

    <div className="nav-link">
        <div className="form-container">
          <h1>{isSignup ? "Sign Up" : "Sign In"}</h1>
          <div className="form-control">

  <label htmlFor="username_email">Email</label>
  <input type="text" placeholder="Username" id="username_email" value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} />
  <label htmlFor="password">Password</label>
  <input type="password" placeholder="Password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
  
  {isSignup && (
    <>
      <div className="password-verify-label">
        <label htmlFor="verifyPassword">Verify Password</label>
        {passwordMatch && <span className="password-checkmark">✔</span>}
      </div>
      <input type="password" placeholder="Verify Password" id="verifyPassword" value={verifyPassword} onChange={e => {setVerifyPassword(e.target.value); checkPasswordMatch(e.target.value);}} />
    </>
  )}
              </div>
              <div className="invalid-feedback">
            <p>Forgot Password</p>
          </div>
              </div>


         
          <div className="btn">
            <button onClick={handleSignIn}>Sign {isSignup ? "Up" : "In"}</button>
          </div>
          <div className="text-dark">
           {isSignup ? "" : "No Account?"} <a href="#" onClick={() => setIsSignup(!isSignup)}> Sign {isSignup ? "In" : "Up"} </a>
          </div>
          <div className="text-dark">
            <p>or continue with</p>
            <div className="social-links">
              <img src={facebookImage} alt="Facebook" />
              <img src={appleImage} alt="Apple" />
              <img src={googleImage} alt="Google" />
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the LandingPage component.
export default LandingPage;
