import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code'; // QR Code library to render QR codes
import { useParams } from 'react-router-dom';
import '../styles/QRViewPage.css';

function QRViewPage() {
  const { id } = useParams(); // Get the QR code ID from the URL
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    // Fetch the QR data (image, name, description) based on the QR ID
    const fetchQRData = async () => {
      try {
        const response = await axios.get(`/api/qr/${id}/data`);
        setQrData(response.data);
      } catch (err) {
        console.error('Error fetching QR data:', err);
      }
    };
    fetchQRData();
  }, [id]);

  return (
    <div className="qr-view-page">
      {qrData ? (
        <>
          <div className="image-section">
            <img src={qrData.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
            <h3>{qrData.name}</h3>
            <p>{qrData.description}</p>
          </div>

          <div className="qr-section">
            <h3>QR Code</h3>
            <QRCode value={qrData.imageUrl} size={256} />
            <a href={qrData.imageUrl} download="QRCode.png">
              <button>Download QR Code</button>
            </a>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default QRViewPage;
