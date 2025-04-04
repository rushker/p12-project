import React, { useState } from 'react';
import QRCode from 'react-qr-code';  // If you plan to use it
import QRGenerator from '../components/user/QRGenerator';
import '../styles/UserPage.css';  // Optional styling

function UserPage() {
  const [qrValue, setQrValue] = useState('');

  const handleGenerateQR = (value) => {
    setQrValue(value); // You can set the QR code value dynamically
  };

  return (
    <div className="user-page">
      <h1>User Dashboard</h1>
      <div className="qr-section">
        <h2>Generate New QR Code</h2>
        <QRGenerator onGenerate={handleGenerateQR} />
        {qrValue && <QRCode value={qrValue} />}
      </div>
    </div>
  );
}

export default UserPage;
