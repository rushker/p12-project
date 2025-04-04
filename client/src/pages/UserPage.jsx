import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code'; // QR Code library for rendering the QR code
import '../styles/UserPage.css';

function UserPage() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [qrCode, setQrCode] = useState(null); // Store the generated QR code ID
  const [imageUrl, setImageUrl] = useState(null); // Store the image URL

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImageUrl(reader.result); // Show image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !name || !description) {
      alert('Please upload an image and provide a name and description');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('description', description);

    try {
      const res = await axios.post('/api/qr/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setQrCode(res.data.qrId); // Save the QR code ID
    } catch (err) {
      console.error('Error generating QR code:', err);
      alert('Failed to upload image and generate QR code');
    }
  };

  return (
    <div className="user-page">
      <h1>User Dashboard</h1>
      <div className="qr-section">
        <h2>Generate New QR Code</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <input
            type="text"
            placeholder="Enter image name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Enter image description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <button type="submit">Generate QR Code</button>
        </form>

        {imageUrl && (
          <div>
            <h3>Uploaded Image Preview</h3>
            <img src={imageUrl} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />
          </div>
        )}

        {qrCode && (
          <div>
            <h3>Generated QR Code</h3>
            <QRCode value={`${window.location.origin}/api/qr/${qrCode}`} size={256} />
            <p>
              Scan this QR code to view the image and its details on another device.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPage;
