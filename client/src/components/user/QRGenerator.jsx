import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/QRGenerator.css';

const QRGenerator = () => {
  const [image, setImage] = useState(null);
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
        <h2 className="qr-generator-title">Generate QR Code</h2>

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
              <img src={previewUrl} alt="Preview" className="image-preview" />
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateQR}
          disabled={loading || !image}
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

        {/* QR Code Appears Below the Button */}
        {qrData && (
          <div className="qr-result-section">
            <h3>Your QR Code</h3>
            <div className="qr-code-container">
              <QRCode value={qrData.qrId} size={256} />
            </div>
            <p className="qr-instructions">Scan this QR to view the image</p>
            <div className="qr-meta">
              <p>
                QR ID: <span className="qr-id">{qrData.qrId}</span>
              </p>
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
