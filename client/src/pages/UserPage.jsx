import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code'; // QR Code library for rendering the QR code
import '../styles/UserPage.css';

function QRGenerator() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [qrId, setQrId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);
    formData.append('description', description);

    try {
      setLoading(true);
      const response = await axios.post('/api/qr/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setQrId(response.data.qrId); // Save the QR ID for redirect
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Failed to upload image:', error);
    }
  };

  return (
    <div>
      <h2>Generate QR Code</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Generate QR</button>
      </form>

      {loading && <p>Uploading...</p>}
      {qrId && !loading && (
        <div>
          <p>QR Code generated! <a href={`/qr/${qrId}`}>View it here</a></p>
        </div>
      )}
    </div>
  );
}

export default QRGenerator;