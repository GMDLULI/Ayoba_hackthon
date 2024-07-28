import React, { useState } from 'react';
import { sendMessage } from './api';

const SendMessageForm = () => {
  const [messageText, setMessageText] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const message = {
      type: 'text',
      text: messageText,
    };

    const msisdns = phoneNumbers.split(',').map((number) => number.trim());

    try {
      const response = await sendMessage(message, msisdns);
      console.log('Message sent successfully:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Message:
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Phone Numbers (comma separated):
          <input
            type="text"
            value={phoneNumbers}
            onChange={(e) => setPhoneNumbers(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Send Message</button>
    </form>
  );
};

export default SendMessageForm;
