import React, { useState, useEffect } from 'react';

const ProfileManagement = () => {
  const [profile, setProfile] = useState({ name: '', address: '', description: '' });

  useEffect(() => {
    // Fetch profile data
    // setProfile(fetchedProfile);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call to update profile
  };

  return (
    <div>
      <h2>Manage Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Shop Name"
        />
        <input
          type="text"
          name="address"
          value={profile.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <textarea
          name="description"
          value={profile.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileManagement;
