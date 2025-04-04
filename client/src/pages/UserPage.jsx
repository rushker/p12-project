import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import QRGenerator from '../components/user/QRGenerator';
import { toast } from 'react-toastify';
import '../styles/UserPage.css';

function UserPage() {
  const [qrValue, setQrValue] = useState('');

  const handleGenerateQR = (qrCode) => {
    setQrValue(qrCode);
    toast.success(
      <div className="success-toast">
        <p>✅ QR Code Generated!</p>
        <QRCode value={qrCode} size={100} />
      </div>,
      { position: 'top-right', autoClose: 5000 }
    );
  };

  return (
    <div className="user-page">
      <h1>User Dashboard</h1>
      <QRGenerator onGenerate={handleGenerateQR} />

      {qrValue && (
        <div className="qr-display">
          <h2>Latest QR Code</h2>
          <QRCode value={qrValue} size={256} />
        </div>
      )}
    </div>
  );
}

export default UserPage;
