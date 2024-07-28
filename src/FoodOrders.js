import { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const menuItems = [
  { id: 1, name: 'Classic Kota', price: 25 },
  { id: 2, name: 'Cheese Kota', price: 30 },
  { id: 3, name: 'Chicken Kota', price: 35 },
  { id: 4, name: 'Veggie Kota', price: 28 },
  { id: 5, name: 'Deluxe Kota', price: 40 }
];

const AIFoodOrderComponent = ({ onOrderComplete }) => {
  const [conversation, setConversation] = useState([]);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [order, setOrder] = useState({
    item: null,
    deliveryMethod: null,
    address: null
  });
  const [userInput, setUserInput] = useState('');

  const token = 'YOUR_AYOBA_TOKEN_HERE';

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

  const handleUserInput = () => {
    let response = '';
    let nextStep = currentStep;

    switch (currentStep) {
      case 'welcome':
        response = "Welcome to our Kota store! Here's our menu:\n" +
          menuItems.map(item => `${item.id}. ${item.name} - R${item.price}`).join('\n') +
          "\nPlease enter the number of the item you'd like to order.";
        nextStep = 'select_item';
        break;

      case 'select_item':
        const selectedItem = menuItems.find(item => item.id === parseInt(userInput));
        if (selectedItem) {
          setOrder({ ...order, item: selectedItem });
          response = `Great choice! You've selected ${selectedItem.name}. 
            \nWould you like delivery or collection?
            \n1. Delivery
            \n2. Collection`;
          nextStep = 'delivery_method';
        } else {
          response = "I'm sorry, that's not a valid menu item. Please try again.";
        }
        break;

      case 'delivery_method':
        if (userInput === '1') {
          setOrder({ ...order, deliveryMethod: 'delivery' });
          response = "Please enter your delivery address.";
          nextStep = 'address';
        } else if (userInput === '2') {
          setOrder({ ...order, deliveryMethod: 'collection' });
          response = "Great! Your order will be ready for collection in about 20 minutes.";
          nextStep = 'complete';
        } else {
          response = "Please enter 1 for delivery or 2 for collection.";
        }
        break;

      case 'address':
        setOrder({ ...order, address: userInput });
        response = "Thank you! Your order will be delivered in about 30 minutes.";
        nextStep = 'complete';
        break;

      case 'complete':
        response = "Your order is being processed. Thank you for choosing our Kota store!";
        break;

      default:
        response = "I'm sorry, I didn't understand that. Can you please try again?";
    }

    setConversation([...conversation, { user: userInput }, { ai: response }]);
    setCurrentStep(nextStep);
    setUserInput('');

    if (nextStep === 'complete') {
      onOrderComplete(order);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Food Order Assistant</Text>
      <FlatList
        data={conversation}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            {item.user && <Text style={styles.userMessage}>User: {item.user}</Text>}
            {item.ai && <Text style={styles.aiMessage}>AI: {item.ai}</Text>}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.conversationContainer}
      />
      <TextInput
        style={styles.input}
        value={userInput}
        onChangeText={setUserInput}
        placeholder="Type your response here"
        onSubmitEditing={handleUserInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  conversationContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginBottom: 10,
  },
  userMessage: {
    fontWeight: 'bold',
  },
  aiMessage: {
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default AIFoodOrderComponent;
