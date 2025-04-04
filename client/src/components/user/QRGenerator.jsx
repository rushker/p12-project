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
      toast.error('🚫 Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('🚫 Image size should be less than 5MB');
      return;
    }

    setImage(file);
  };

  const handleGenerateQR = async () => {
    if (!image) {
      toast.error('⚠️ Please select an image');
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

      if (response.data.qrCode) {
        toast.success('✅ QR Code generated successfully!');
        onGenerate(response.data.qrCode);
      } else {
        toast.error('⚠️ QR Code generation failed');
      }
    } catch (err) {
      console.error('❌ QR generation error:', err.response?.data || err);
      toast.error(err.response?.data?.message || '❌ Error generating QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-generator-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Dashboard
      </button>

      <div className="qr-generator-card">
        <h2>Generate QR Code</h2>

        <input type="file" accept="image/*" onChange={handleImageChange} />
        
        <button onClick={handleGenerateQR} disabled={loading} className="generate-button">
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </div>
    </div>
  );
};

export default QRGenerator;
