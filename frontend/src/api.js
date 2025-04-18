// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/users', // Base URL for the API
});

export default api;
