import React, { useState } from 'react';

const PromotionForm = () => {
  const [promotion, setPromotion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call to send promotion
    setPromotion('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={promotion}
        onChange={(e) => setPromotion(e.target.value)}
        placeholder="Type a promotion"
      />
      <button type="submit">Send Promotion</button>
    </form>
  );
};

export default PromotionForm;
