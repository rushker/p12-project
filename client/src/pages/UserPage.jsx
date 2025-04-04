import React, { useState } from 'react';
import QRCode from 'react-qr-code';  // If you plan to use it
import QRGenerator from '../components/user/QRGenerator';
import '../styles/UserPage.css';  // Optional styling

function UserPage() {
  const [qrValue, setQrValue] = useState('');
  const [qrCodeData, setQrCodeData] = useState(null);  // State to hold the generated QR code data

  const handleGenerateQR = (value) => {
    setQrValue(value); // You can set the QR code value dynamically
    setQrCodeData(value); // Save the generated QR code value for display
  };

  return (
    <div className="user-page">
      <h1>User Dashboard</h1>
      <div className="qr-section">
        <h2>Generate New QR Code</h2>
        <QRGenerator onGenerate={handleGenerateQR} />
        {qrValue && (
          <div className="qr-display">
            <h3>Generated QR Code</h3>
            <div className="qr-container">
              {/* Display the QR code that was generated */}
              <QRCode value={qrCodeData} size={200} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPage;
