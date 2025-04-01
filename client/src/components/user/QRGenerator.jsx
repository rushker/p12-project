import React, { useState } from 'react';
import { QRCode } from 'qrcode.react';
import axios from 'axios';
import { toast } from 'react-toastify';

const QRGenerator = () => {
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState('');
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Limit file size (e.g., 5MB)
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
      // Create FormData for file upload
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
    <div className="qr-generator" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Generate QR Code</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'block', marginBottom: '10px' }}
        />
        {previewUrl && (
          <div style={{ margin: '10px 0' }}>
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '200px' }} 
            />
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="password"
          placeholder="Set password for QR (min 4 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button 
        onClick={handleGenerateQR} 
        disabled={loading || !image || !password}
        style={{
          padding: '10px 20px',
          background: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Generating...' : 'Generate QR'}
      </button>
      
      {qrData && (
        <div className="qr-result" style={{ marginTop: '30px', textAlign: 'center' }}>
          <div style={{ marginBottom: '15px' }}>
            <QRCode 
              value={JSON.stringify({ 
                qrId: qrData.qrId, 
                password 
              })} 
              size={256}
              level="H" // Higher error correction
              includeMargin={true}
            />
          </div>
          <p style={{ fontSize: '16px' }}>Scan this QR to view the protected image</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            QR ID: {qrData.qrId}
          </p>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;