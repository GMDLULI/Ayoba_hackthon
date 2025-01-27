import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/images/ayoba-logo-white-center.png'; // Adjust the path as needed

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
      <img src={logo} alt="Ayoba Logo" style={styles.logo} />
      <h1 style={styles.welcomeMessage}>Welcome to Ayoba Food Ordering System</h1>
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
    backgroundColor: '#ffffff',
  },
  logo: {
    width: '150px',
    marginBottom: '20px',
  },
  welcomeMessage: {
    fontSize: '24px',
    color: '#002f6c', // Ayoba blue
    fontFamily: 'Arial, sans-serif',
    marginBottom: '20px',
  },
  form: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    margin: '10px',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #002f6c', // Ayoba blue
    borderRadius: '5px',
    width: '100%',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#002f6c', // Ayoba blue
    color: '#ffffff', // White font
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    color: 'red',
    marginTop: '10px',
  },
  homeButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    textDecoration: 'none',
    color: '#ffffff', // White font
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#002f6c', // Ayoba blue
  },
};

export default LoginPage;
