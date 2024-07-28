import React, { useState, useEffect } from "react";
import Chatbar from "./Chatbar";
import Chatbot from "./Chatbot";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  }, []);

  const handleSendMessage = (message) => {
    setMessages([...messages, { text: message, sender: "user" }]);
    const botResponse = Chatbot(message, messages, orders);
    setMessages((prevMessages) => [...prevMessages, { text: botResponse.message, sender: "bot" }]);
    
    if (botResponse.order) {
      const newOrders = [...orders, botResponse.order];
      setOrders(newOrders);
      localStorage.setItem("orders", JSON.stringify(newOrders));
    }
  };

  return (
    <div>
      <header className="App-header">
        <h1>Welcome to Ayoba chat api</h1>
      </header>
      <div className="chat-container">
        <div className="message-list">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ))}
        </div>
        <Chatbar onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;