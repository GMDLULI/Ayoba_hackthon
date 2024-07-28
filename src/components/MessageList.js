import React from 'react';

const MessageList = ({ messages }) => (
  <ul>
    {messages.map((message) => (
      <li key={message.id}>{message.text}</li>
    ))}
  </ul>
);

export default MessageList;
