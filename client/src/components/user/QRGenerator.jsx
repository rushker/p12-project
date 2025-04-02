import { useNavigate } from 'react-router-dom';

export default function QRGenerator() {
  const navigate = useNavigate();
  
  const handleGenerate = () => {
    // QR generation logic here
    alert('QR Generated!');
  };

  return (
    <div>
      <h2>QR Generator</h2>
      <button onClick={handleGenerate}>Generate QR</button>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}