import axios from 'axios';
import { STORAGE_KEYS } from '../config/constants';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      window.location.href = '/login';
    }

    // Extraire le message précis renvoyé par la validation de schéma ou le backend
    const serverMessage =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      error.response?.data?.error;

    if (serverMessage) {
      error.message = serverMessage;
    } else if (error.response?.status === 429) {
      error.message = 'Trop de requêtes effectuées. Veuillez patienter un instant avant de réessayer.';
    } else if (error.response?.status === 403) {
      error.message = 'Accès non autorisé pour cette action.';
    } else if (error.response?.status === 404) {
      error.message = 'Ressource introuvable.';
    } else if (error.response?.status === 500) {
      error.message = 'Une erreur interne est survenue sur le serveur.';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
