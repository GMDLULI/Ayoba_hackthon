import React, { useState, useEffect } from 'react';
import { getMessages, sendMessage } from '../services/api';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import OrderList from './OrderList';
import PromotionForm from './PromotionForm';
import ProfileManagement from './ProfileManagement';

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages();
      setMessages(data);
    };

    const fetchOrders = async () => {
      // Add API call to fetch orders
      // const data = await getOrders();
      // setOrders(data);
    };

    fetchMessages();
    fetchOrders();
  }, []);

  const handleSendMessage = async (message) => {
    const newMessage = await sendMessage(message);
    setMessages([...messages, newMessage]);
  };

  return (
    <div>
      <h1>Kota Shop Dashboard</h1>
      <ProfileManagement />
      <OrderList orders={orders} />
      <MessageList messages={messages} />
      <MessageForm onSendMessage={handleSendMessage} />
      <PromotionForm />
    </div>
  );
};

export default Dashboard;
