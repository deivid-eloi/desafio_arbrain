import axios from 'axios';

// Em dev local: http://localhost:5000/api (via VITE_API_URL ou padrão).
// Em Docker: /api (nginx faz proxy para o backend).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default api;
