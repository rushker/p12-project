import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRGenerator from '../components/user/QRGenerator';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import '../styles/UserPage.css';

function UserPage() {
  const [qrList, setQrList] = useState([]);

  useEffect(() => {
    const fetchQRs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/qr/list`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setQrList(response.data);
      } catch (error) {
        console.error('Error fetching QR codes:', error);
        toast.error('Failed to fetch QR codes');
      }
    };

    fetchQRs();
  }, []);

  const handleNewQR = (newQR) => {
    setQrList((prevList) => [...prevList, newQR]);
  };

  return (
    <div className="user-page">
      <h1>QR Dashboard</h1>
      <QRGenerator onGenerate={handleNewQR} />

      <div className="qr-list">
        <h2>Generated QR Codes</h2>
        {qrList.length === 0 ? (
          <p>No QR codes yet.</p>
        ) : (
          qrList.map((qr) => (
            <div key={qr.qrId} className="qr-item">
              <QRCode value={qr.qrId} size={128} />
              <p>{qr.qrId}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserPage;
