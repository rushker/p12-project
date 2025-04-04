// src/pages/QRViewPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import axios from 'axios';

const QRViewPage = () => {
  const { id } = useParams(); // qrId from URL
  const navigate = useNavigate();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await axios.get(`/api/qr/${id}/data`);
        setQrData(res.data);
        setLoading(false);
      } catch (err) {
        setError('QR Code not found or failed to load.');
        setLoading(false);
      }
    };

    fetchQR();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/qr/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/dashboard'); // or homepage
    } catch (err) {
      alert('Failed to delete QR code.');
    }
  };

  if (loading) return <p>Loading QR code...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Generated QR Code</h2>
      <QRCode value={qrData.scanUrl} size={256} />
      <p>Scan this QR to view the image:</p>
      <a href={qrData.imageUrl} target="_blank" rel="noreferrer">{qrData.imageUrl}</a>
      <br />
      <img src={qrData.imageUrl} alt="Uploaded" style={{ marginTop: '1rem', maxWidth: '300px' }} />
      <br />
      <button onClick={handleDelete} style={{ marginTop: '1rem', background: 'red', color: 'white', padding: '0.5rem 1rem', border: 'none' }}>
        Delete QR Code
      </button>
    </div>
  );
};

export default QRViewPage;
