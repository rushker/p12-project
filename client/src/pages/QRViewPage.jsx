// src/pages/QRViewPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import axios from 'axios';

const QRViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/api/qr/${id}`);
        setQrData(response.data.imageUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${backendBaseUrl}/api/qr/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/dashboard'); // or your homepage
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${backendBaseUrl}${qrData}`);
    alert('Image URL copied!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'QR Code',
        url: `${backendBaseUrl}${qrData}`,
      });
    } else {
      alert('Sharing not supported');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!qrData) return <p>QR Code not found.</p>;

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Your QR Code</h2>
      <QRCode value={`${backendBaseUrl}${qrData}`} size={200} />
      <p style={{ marginTop: '1rem' }}>
        <a href={`${backendBaseUrl}${qrData}`} target="_blank" rel="noreferrer">
          {`${backendBaseUrl}${qrData}`}
        </a>
      </p>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleCopy}>Copy URL</button>{' '}
        <button onClick={handleShare}>Share</button>{' '}
        <button onClick={handleDelete} style={{ color: 'red' }}>Delete QR</button>
      </div>
    </div>
  );
};

export default QRViewPage;
