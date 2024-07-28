const menu = [
  "Kota with chips",
  "Kota with egg",
  "Kota with russian",
  "Kota with vienna",
  "Kota with cheese",
];

const Chatbot = (message, messages, orders) => {
  const lowercaseMessage = message.toLowerCase();

  if (lowercaseMessage === "hi") {
    return {
      message: "Welcome to crazy kotas\n1. See our menu\n2. Cancel",
    };
  }

  const lastBotMessage = messages
    .filter((msg) => msg.sender === "bot")
    .pop()?.text;

  if (lastBotMessage && lastBotMessage.includes("Welcome to crazy kotas")) {
    if (message === "1") {
      return {
        message: menu.map((item, index) => `${index + 1}. ${item}`).join("\n"),
      };
    } else if (message === "2") {
      return {
        message: "Thank you for visiting crazy kotas. Goodbye!",
      };
    }
  }

  if (lastBotMessage && lastBotMessage.includes(menu[0])) {
    const menuIndex = parseInt(message) - 1;
    if (menuIndex >= 0 && menuIndex < menu.length) {
      const order = {
        item: menu[menuIndex],
        completed: false,
      };
      return {
        message: `Your order of ${menu[menuIndex]} will be ready soon.`,
        order: order,
      };
    }
  }

  // Check if any order is completed
  const completedOrder = orders.find(order => order.completed);
  if (completedOrder) {
    return {
      message: `Your order of ${completedOrder.item} is ready! Come and collect!`,
    };
  }

  return {
    message: "I'm sorry, I didn't understand that. Please try again.",
  };
};

export default Chatbot;