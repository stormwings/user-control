import axios from "axios";
import { toast } from "react-toastify";
import { DEFAULT_API_URL } from '../constants';

const API_URL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

const httpRequest = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

httpRequest.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

httpRequest.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error);

    if (!error.response) {
      toast.error('Error de conexión. Verifica tu conexión a internet.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        break;
      case 401:
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        break;
      case 403:
        toast.error('No tienes permisos para realizar esta acción.');
        break;
      case 404:
        toast.error(data?.message || 'Recurso no encontrado.');
        break;
      case 409:
        toast.error(data?.message || 'Conflicto con el recurso existente.');
        break;
      case 422:
        break;
      case 500:
        toast.error('Error del servidor. Intenta nuevamente más tarde.');
        break;
      case 503:
        toast.error('Servicio no disponible. Intenta nuevamente más tarde.');
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default httpRequest;
