import axios from 'axios';

// Aqui fica o endereço que o back-end Java está rodando
export const api = axios.create({
  baseURL: 'http://localhost:8080', 
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@DignaMente:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});