import React, { useState } from 'react';
import { QRCode } from 'qrcode.react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './QRGenerator.css'; // New CSS file for this component

const QRGenerator = () => {
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState('');
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleGenerateQR = async () => {
    if (!image) {
      toast.error('Please select an image');
      return;
    }
    if (!password || password.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('password', password);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/qr/generate`,
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setQrData(response.data);
      toast.success('QR Code generated successfully!');
    } catch (err) {
      console.error('QR generation error:', err);
      toast.error(err.response?.data?.message || 'Error generating QR code');
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
        <h2 className="qr-generator-title">Generate Secure QR Code</h2>
        
        <div className="upload-section">
          <label className="file-upload-label">
            Choose Image
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="file-upload-input"
            />
          </label>
          
          {previewUrl && (
            <div className="image-preview-container">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="image-preview"
              />
            </div>
          )}
        </div>

        <div className="password-section">
          <input
            type="password"
            placeholder="Set password (min 4 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
        </div>

        <button 
          onClick={handleGenerateQR} 
          disabled={loading || !image || !password}
          className={`generate-button ${loading ? 'loading' : ''}`}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            'Generate QR Code'
          )}
        </button>
        
        {qrData && (
          <div className="qr-result-section">
            <h3>Your Secure QR Code</h3>
            <div className="qr-code-container">
              <QRCode 
                value={JSON.stringify({ qrId: qrData.qrId, password })} 
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-instructions">Scan this QR to view the protected image</p>
            <div className="qr-meta">
              <p>QR ID: <span className="qr-id">{qrData.qrId}</span></p>
              <button 
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(qrData.qrId);
                  toast.success('QR ID copied to clipboard!');
                }}
              >
                Copy ID
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;