import React from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';

function QRViewPage({ qrData, onDelete }) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/qr/${qrData.qrId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrData.imageUrl);
    alert('Image URL copied to clipboard!');
  };

  return (
    <div className="qr-view">
      <QRCode value={qrData.imageUrl} />
      <p>Image URL: <a href={qrData.imageUrl} target="_blank" rel="noopener noreferrer">{qrData.imageUrl}</a></p>
      <button onClick={handleCopy}>Copy Link</button>
      <button onClick={handleDelete}>Delete QR</button>
    </div>
  );
}

export default QRViewPage;
