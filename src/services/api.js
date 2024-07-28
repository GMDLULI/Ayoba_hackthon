import axios from 'axios';

const clientId = process.env.REACT_APP_AYOBA_CLIENT_ID;
const clientSecret = process.env.REACT_APP_AYOBA_CLIENT_SECRET;
const tokenUrl = process.env.REACT_APP_AYOBA_TOKEN_URL;
const apiUrl = process.env.REACT_APP_AYOBA_API_URL;

let accessToken = '';

const getAccessToken = async () => {
  if (accessToken) return accessToken;

  const response = await axios.post(tokenUrl, null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: clientId,
      password: clientSecret,
    },
  });

  accessToken = response.data.access_token;
  return accessToken;
};

export const sendMessage = async (message, msisdns) => {
  const token = await getAccessToken();

  const response = await axios.post(
    `${apiUrl}/messages`,
    {
      message,
      msisdns,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

export const getMessages = async () => {
  const token = await getAccessToken();

  const response = await axios.get(`${apiUrl}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getOrders = async () => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(`${apiUrl}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching orders', error);
    throw error;
  }
};

// Send promotion
export const sendPromotion = async (promotion) => {
  try {
    const token = await getAccessToken();

    const response = await axios.post(`${apiUrl}/promotions`, promotion, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error sending promotion', error);
    throw error;
  }
};

// Fetch profile
export const getProfile = async () => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(`${apiUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching profile', error);
    throw error;
  }
};

// Update profile
export const updateProfile = async (profile) => {
  try {
    const token = await getAccessToken();

    const response = await axios.put(`${apiUrl}/profile`, profile, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating profile', error);
    throw error;
  }
};
