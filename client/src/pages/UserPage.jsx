import React, { useState } from 'react';
import QRGenerator from '../components/user/QRGenerator';
import QRViewPage from '../components/user/QRViewPage';
import '../styles/UserPage.css';

function UserPage() {
  const [qrData, setQrData] = useState(null);

  const handleGenerateSuccess = (data) => {
    setQrData(data);
  };

  const handleDelete = () => {
    setQrData(null);
  };

  return (
    <div className="user-page">
      <h1>User Dashboard</h1>
      <div className="qr-section">
        <h2>Generate New QR Code</h2>
        <QRGenerator onSuccess={handleGenerateSuccess} />
      </div>

      {qrData && (
        <div className="qr-view-section">
          <h2>Generated QR Code</h2>
          <QRViewPage qrData={qrData} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}

export default UserPage;
