import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code'; // QR Code library to render QR codes
import { useParams } from 'react-router-dom';
import '../styles/QRViewPage.css';

function QRViewPage() {
  const [qrData, setQrData] = useState(null);
  const { qrId } = useParams();

  useEffect(() => {
    // Fetch QR code data by ID
    axios.get(`/api/qr/${qrId}`)
      .then(response => {
        setQrData(response.data);
      })
      .catch(error => {
        console.error('Error fetching QR data:', error);
      });
  }, [qrId]);

  return (
    <div className="qr-view-page">
      {qrData ? (
        <div className="qr-box">
          <div className="image-container">
            <img src={qrData.imageUrl} alt="Uploaded" />
            <div>{qrData.name}</div>
            <div>{qrData.description}</div>
          </div>
          <div className="qr-code-container">
            <img src={qrData.qrCodeUrl} alt="QR Code" />
            <a href={qrData.qrCodeUrl} download>Download QR Code</a>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default QRViewPage;
