import React, { useState, useEffect } from "react";

function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  }, []);

  const handleOrderComplete = (index) => {
    const updatedOrders = orders.map((order, i) => {
      if (i === index) {
        return { ...order, completed: true };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Simulate sending a message to the user
    console.log(`Order for ${orders[index].item} is ready for collection!`);
  };

  return (
    <div className="dashboard">
      <h2>Order Dashboard</h2>
      <ul className="order-list">
        {orders.map((order, index) => (
          <li key={index} className={order.completed ? "completed" : ""}>
            <span>{order.item}</span>
            {!order.completed && (
              <button onClick={() => handleOrderComplete(index)}>Mark as Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;