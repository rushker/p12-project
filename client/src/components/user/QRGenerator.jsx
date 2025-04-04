import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/QRGenerator.css';

const QRGenerator = ({ onGenerate }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setImage(file);
  };

  const handleGenerateQR = async () => {
    if (!image) {
      toast.error('Please upload an image');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/qr/generate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      onGenerate(response.data.qrValue); // Pass QR code URL to parent component
      toast.success('QR Code generated successfully!');
    } catch (error) {
      console.error('QR Generation Error:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-generator">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleGenerateQR} disabled={loading}>
        {loading ? 'Generating...' : 'Generate QR Code'}
      </button>
    </div>
  );
};

export default QRGenerator;
