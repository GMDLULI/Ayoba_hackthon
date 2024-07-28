import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

const menuItems = [
  { id: 1, name: 'Classic Kota', price: 25 },
  { id: 2, name: 'Cheese Kota', price: 30 },
  { id: 3, name: 'Chicken Kota', price: 35 },
  { id: 4, name: 'Veggie Kota', price: 28 },
  { id: 5, name: 'Deluxe Kota', price: 40 }
];

const FoodOrderBusinessPanel = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [conversationSteps, setConversationSteps] = useState({});
  const [unprocessedMessages, setUnprocessedMessages] = useState([]);
  const [processedMessageIds, setProcessedMessageIds] = useState(new Set());
  const [currentOrder, setCurrentOrder] = useState({
    item: null,
    deliveryMethod: null,
    address: null
  });
  const [userInput, setUserInput] = useState('');
  const [storedResponses, setStoredResponses] = useState({});

  const token = 'your_token_here';

  const contractAddress = '0x1234567890123456789012345678901234567890';
  const contractABI = [
    {
      "inputs": [{"internalType": "bool", "name": "_choice", "type": "bool"}],
      "name": "setChoice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getChoice",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const fetchOrders = async () => {
    const url = 'https://api.ayoba.me/v1/business/message';
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await axios.get(url, { headers });
      const newMessages = response.data.filter(msg => !processedMessageIds.has(msg.id));

      setProcessedMessageIds(prev => new Set([...prev, ...newMessages.map(msg => msg.id)]));

      const newUnprocessedMessages = newMessages.filter(msg => {
        const text = msg.message.text;
        return typeof text === 'string' && text.toLowerCase() === 'hi';
      });

      const newProcessedOrders = newMessages.filter(msg => {
        const text = msg.message.text;
        return typeof text === 'string' && text.toLowerCase() !== 'hi';
      }).map(msg => ({
        phoneNumber: msg.msisdn,
        orderDetails: msg.message.text,
        status: 'Pending',
        isReady: false
      }));

      setUnprocessedMessages(prev => [...prev, ...newUnprocessedMessages]);
      setOrders(prevOrders => [...prevOrders, ...newProcessedOrders]);

      newUnprocessedMessages.forEach(msg => startAIOrder(msg.msisdn));
      newProcessedOrders.forEach(order => handleUserInput(order.orderDetails, order.phoneNumber));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const sendMessage = async (phoneNumber, message) => {
    const url = 'https://api.ayoba.me/v1/business/message';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    const data = {
      message: {
        type: 'text',
        text: message
      },
      msisdns: [phoneNumber]
    };

    try {
      await axios.post(url, data, { headers });
      console.log('Message sent to:', phoneNumber);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const stepHandlers = {
    welcome: (phoneNumber, userInput) => {
      const response = "Welcome to our Kota store! Here's our menu:\n" +
        menuItems.map(item => `${item.id}. ${item.name} - R${item.price}`).join('\n') +
        "\nPlease enter the number of the item you'd like to order.";
      const nextStep = 'select_item';
      return { response, nextStep };
    },
    select_item: (phoneNumber, userInput) => {
      const selectedItem = menuItems.find(item => item.id === parseInt(userInput));
      if (selectedItem) {
        setCurrentOrder(prev => ({ ...prev, item: selectedItem }));
        const response = `Great choice! You've selected ${selectedItem.name}.\nWould you like delivery or collection?\n1. Delivery\n2. Collection`;
        const nextStep = 'delivery_method';
        return { response, nextStep };
      } else {
        const response = "I'm sorry, that's not a valid menu item. Please try again.";
        const nextStep = 'select_item';
        return { response, nextStep };
      }
    },
    delivery_method: (phoneNumber, userInput) => {
      if (userInput === '1') {
        setCurrentOrder(prev => ({ ...prev, deliveryMethod: 'delivery' }));
        const response = "Please enter your delivery address.";
        const nextStep = 'address';
        return { response, nextStep };
      } else if (userInput === '2') {
        setCurrentOrder(prev => ({ ...prev, deliveryMethod: 'collection' }));
        const response = "Great! Your order will be ready for collection in about 20 minutes.";
        const nextStep = 'complete';
        return { response, nextStep };
      } else {
        const response = "Please enter 1 for delivery or 2 for collection.";
        const nextStep = 'delivery_method';
        return { response, nextStep };
      }
    },
    address: (phoneNumber, userInput) => {
      setCurrentOrder(prev => ({ ...prev, address: userInput }));
      const response = "Thank you! Your order will be delivered in about 30 minutes.";
      const nextStep = 'complete';
      return { response, nextStep };
    },
    complete: (phoneNumber, userInput) => {
      const response = "Your order is being processed. Thank you for choosing our Kota store!";
      const nextStep = 'complete';
      return { response, nextStep };
    },
    default: (phoneNumber, userInput) => {
      const response = "I'm sorry, I didn't understand that. Can you please try again?";
      const nextStep = 'welcome';
      return { response, nextStep };
    }
  };

  const handleAIResponse = (phoneNumber, userInput) => {
    const currentStep = conversationSteps[phoneNumber] || 'welcome';
    const { response, nextStep } = (stepHandlers[currentStep] || stepHandlers.default)(phoneNumber, userInput);
    setConversationSteps(prev => ({ ...prev, [phoneNumber]: nextStep }));
    setStoredResponses(prev => ({
      ...prev,
      [phoneNumber]: [...(prev[phoneNumber] || []), { userInput, response }]
    }));
    sendMessage(phoneNumber, response);
  };

  const startAIOrder = async (phoneNumber) => {
    if (!storedResponses[phoneNumber]) {
      await sendSmartContractMessage(phoneNumber);
    } else {
      handleAIResponse(phoneNumber, 'hi');
    }
    setUnprocessedMessages(prev => prev.filter(msg => msg.msisdn !== phoneNumber));
    setOrders(prev => [...prev, {
      phoneNumber,
      orderDetails: 'New order started',
      status: 'In Progress',
      isReady: false
    }]);
  };

  const handleUserInput = (input, phoneNumber) => {
    setUserInput(input);
    handleAIResponse(phoneNumber, input);
  };

  const markOrderReady = async (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].isReady = true;
    updatedOrders[index].status = 'Ready';
    setOrders(updatedOrders);

    const order = updatedOrders[index];
    await sendMessage(order.phoneNumber, "Your order is ready for pickup/delivery!");
  };

  const sendSmartContractMessage = async (phoneNumber) => {
    const message = "Welcome! Do you agree to our terms and conditions?\n1. Yes\n2. No";
    await sendMessage(phoneNumber, message);
    if (handleSmartContractResponse(phoneNumber,message)){
      handleAIResponse(phoneNumber,'welcome');
    }
  };

  const handleSmartContractResponse = async (phoneNumber, response) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const choice = response.toLowerCase() === '1' || response.toLowerCase() === 'yes';
      await contract.setChoice(choice);
      
      if (choice) {
        handleAIResponse(phoneNumber, 'hi');
      } else {
        sendMessage(phoneNumber, "We're sorry you don't agree. If you change your mind, please contact us again.");
      }
    } catch (error) {
      console.error('Error interacting with smart contract:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Food Order Business Panel</h1>
      <ul style={styles.orderList}>
        {orders.map((item, index) => (
          <li key={index} style={styles.orderItem}>
            <p>Phone: {item.phoneNumber}</p>
            <p>Order: {item.orderDetails}</p>
            <p>Status: {item.status}</p>
            {!item.isReady && (
              <button style={styles.button} onClick={() => markOrderReady(index)}>
                Mark as Ready
              </button>
            )}
          </li>
        ))}
      </ul>
      <div style={styles.messageSection}>
        <h2 style={styles.sectionTitle}>Send Custom Message</h2>
        <input
          style={styles.input}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
        />
        <input
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <button style={styles.button} onClick={() => sendMessage(phoneNumber, message)}>
          Send Message
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'AyobaFont, Arial, sans-serif',
    backgroundColor: '#F9F9F9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '20px'
  },
  orderList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0'
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#FFFFFF',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  messageSection: {
    marginTop: '30px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '10px'
  },
  input: {
    width: '80%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #CCCCCC',
    fontSize: '16px'
  }
};

export default FoodOrderBusinessPanel;
