// src/pages/UserPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    setLoading(true);
    setError('');

    try {
      // Replace with your API URL to generate the QR code
      const res = await axios.post('/api/qr/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT token if needed
        },
      });

      // Navigate to the QR View Page after successful QR generation
      navigate(`/qr/${res.data.qrId}`);
    } catch (err) {
      setLoading(false);
      setError('Failed to upload image and generate QR code.');
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  return (
    <div>
      <h2>Upload Image to Generate QR Code</h2>
      <form onSubmit={handleImageUpload}>
        <div>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload and Generate QR'}
        </button>
      </form>
    </div>
  );
};

export default UserPage;
