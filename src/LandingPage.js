import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.ayoba.me/v2/login', {
        username,
        password,
      });
      setMessage('Login successful!');
      console.log(response.data); // handle JWT token
      const accessToken = response.data.token; // Assuming token is in response.data.token
      // Navigate to FoodOrderPanel path
      navigate('/panel', { state: { accessToken } });
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
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
    backgroundColor: '#F0F0F0', // Light background for contrast
    fontFamily: 'Arial, sans-serif', // Default font, can be changed to Ayoba's specific font if available
  },
  title: {
    color: '#0078FF', // Ayoba blue color
    fontSize: '2em',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    margin: '10px',
    padding: '10px',
    fontSize: '16px',
    width: '200px',
    border: '1px solid #0078FF', // Ayoba blue border
    borderRadius: '5px',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0078FF', // Ayoba blue background
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    color: '#FF0000', // Red color for error messages
  },
  homeButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    textDecoration: 'none',
    color: 'white',
    backgroundColor: '#0078FF', // Ayoba blue background
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default LoginPage;
