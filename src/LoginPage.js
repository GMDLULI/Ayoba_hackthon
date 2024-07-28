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
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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

export default LoginPage;
