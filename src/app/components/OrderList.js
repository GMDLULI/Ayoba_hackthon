import React from 'react';

const OrderList = ({ orders }) => (
  <div>
    <h2>Orders</h2>
    <ul>
      {orders.map((order) => (
        <li key={order.id}>{order.details}</li>
      ))}
    </ul>
  </div>
);

export default OrderList;
