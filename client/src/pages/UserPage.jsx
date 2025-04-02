import React from 'react';
import QRGenerator from '../components/user/QRGenerator';
import '../styles/UserPage.css';  // Optional styling

function UserPage() {
  return (
    <div className="user-page">
      <h1>User Dashboard</h1>
      <div className="qr-section">
        <h2>Generate New QR Code</h2>
        <QRGenerator />
      </div>
    </div>
  );
}

export default UserPage;