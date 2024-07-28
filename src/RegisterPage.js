import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [msisdn, setMsisdn] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('http://ayoba.me');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axios.post('https://api.ayoba.me/v1/business/self/otp/send', { msisdn });
      setShowOtpField(true);
      setMessage('OTP sent successfully!');
    } catch (error) {
      console.error('Failed to send OTP:', error.response?.data || error.message);
      setMessage('Failed to send OTP. Please check your phone number and try again.');
    }
  };

  const handleValidateOtp = async () => {
    try {
      // Step 1: Validate OTP
      const validateResponse = await axios.post('https://api.ayoba.me/v1/business/self/otp/validate', { 
        code: otp, 
        msisdn: msisdn
      });
      
      // Extract the access token from the response
      const token = validateResponse.data.access_token;
      
      // Step 2: Use token to register
      const registerResponse = await axios.post('https://api.ayoba.me/v1/business/self/register', 
        { 
          msisdn, 
          deliveryType: 'PULL', 
          webhookUrl 
        }, 
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Check if registration was successful
      if (registerResponse.status === 201 || registerResponse.status === 200) {
        setMessage('Registration successful!');
        // Navigate to FoodOrderBusinessPanel with the access token
        navigate('/panel', { state: { accessToken: token } });
      } else {
        setMessage('Registration completed, but with an unexpected status. Please verify your account.');
      }
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Phone Number"
        value={msisdn}
        onChange={(e) => setMsisdn(e.target.value)}
        required
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Webhook URL"
        value={webhookUrl}
        onChange={(e) => setWebhookUrl(e.target.value)}
        required
        style={styles.input}
      />
      <button onClick={handleSendOtp} style={styles.button}>Send OTP</button>
      {showOtpField && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={styles.input}
          />
          <button onClick={handleValidateOtp} style={styles.button}>Validate OTP</button>
        </>
      )}
      {message && <p>{message}</p>}
      <Link to="/" style={styles.homeButton}>Home</Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  input: {
    margin: '10px',
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
  },
  homeButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    textDecoration: 'none',
    color: 'black',
    border: '1px solid black',
    borderRadius: '5px',
  },
};

export default RegisterPage;
