// In services/qr.js
import api from '../api';

export const generateQR = (data) => api.post('/qr/generate', data);
export const getQR = (id) => api.get(`/qr/${id}`);