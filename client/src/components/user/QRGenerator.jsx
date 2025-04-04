import React, { useState } from 'react';
import axios from 'axios';

function QRGenerator({ onSuccess }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/qr/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const { qrId, imageUrl } = res.data;
      const fullUrl = `${window.location.origin}${imageUrl}`;
      onSuccess({ qrId, imageUrl: fullUrl });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Generate QR'}
      </button>
    </form>
  );
}

export default QRGenerator;
