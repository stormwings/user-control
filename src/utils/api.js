import axios from "axios";
import { toast } from "react-toastify";
import { DEFAULT_API_URL } from './constants';
import { removeUser } from './localStorage';

const API_URL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

// Navigator function for handling redirects from interceptor
let authNavigator = null;

/**
 * Set the navigator function for auth redirects
 * Should be called from App.js with useNavigate hook
 */
export const setAuthNavigator = (navigateFn) => {
  authNavigator = navigateFn;
};

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
        // Bad Request - mostrar mensaje específico si está disponible
        if (data?.message) {
          toast.error(data.message);
        } else if (error.config.url?.includes('/users/')) {
          toast.error('ID de usuario inválido o solicitud incorrecta.');
        }
        break;
      case 401:
        // Unauthorized - sesión expirada o sin autenticación
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        // Limpiar estado de usuario
        removeUser();
        // Redirigir a login
        if (authNavigator) {
          authNavigator('/login', { replace: true });
        } else {
          // Fallback si no está configurado el navegador
          window.location.href = '/login';
        }
        break;
      case 403:
        // Forbidden - usuario autenticado pero sin permisos
        toast.error('No tienes permisos para realizar esta acción.');
        break;
      case 404:
        toast.error(data?.message || 'Recurso no encontrado.');
        break;
      case 409:
        toast.error(data?.message || 'Conflicto con el recurso existente.');
        break;
      case 422:
        // Validation error - mostrar mensaje del backend
        if (data?.message) {
          toast.error(data.message);
        }
        break;
      case 429:
        // Too Many Requests - Rate Limiting
        const retryAfter = data?.retryAfter || 60; // segundos
        const minutes = Math.ceil(retryAfter / 60);
        
        let rateLimitMessage;
        if (error.config.url?.includes('/login')) {
          rateLimitMessage = `Demasiados intentos de inicio de sesión. Por favor, intenta nuevamente en ${minutes} minutos.`;
        } else if (error.config.url?.includes('/register')) {
          rateLimitMessage = `Demasiados registros desde tu ubicación. Por favor, intenta nuevamente en ${minutes} minutos.`;
        } else {
          rateLimitMessage = `Demasiadas solicitudes. Por favor, intenta nuevamente en ${minutes} minutos.`;
        }
        
        toast.warning(rateLimitMessage, { autoClose: 8000 });
        break;
      case 500:
        toast.error('Error del servidor. Intenta nuevamente más tarde.');
        break;
      case 503:
        toast.error('Servicio no disponible. Intenta nuevamente más tarde.');
        break;
      default:
        // Error no manejado específicamente
        if (data?.message) {
          toast.error(data.message);
        }
        break;
    }

    return Promise.reject(error);
  }
);

export default httpRequest;
