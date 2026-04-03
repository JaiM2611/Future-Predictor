import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const runSimulation = (data) =>
  api.post('/api/simulation/run', data).then(r => r.data);

export const getSimulation = (id) =>
  api.get(`/api/simulation/${id}`).then(r => r.data);

export const runWhatIf = (data) =>
  api.post('/api/simulation/whatif', data).then(r => r.data);

export const generateDocumentary = (data) =>
  api.post('/api/documentary/generate', data).then(r => r.data);

export default api;
