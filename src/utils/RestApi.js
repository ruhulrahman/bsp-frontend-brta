import axios from 'axios'
import { toaster } from './helpers.js';

// export const baseURL = 'http://localhost:8080'
// export const baseURL = 'http://192.168.121.25:8090/bsp-0.0.3'
export const baseURL = import.meta.env.MODE === 'production' 
    ? import.meta.env.VITE_PROD_BASE_URL 
    : import.meta.env.VITE_DEV_BASE_URL;

const accessToken = localStorage.getItem('token')

const RestApi = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': `application/json`,
    // accessMenuName: window.location.href,
  }
});

RestApi.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// Response Interceptor
RestApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle response errors globally
    console.error('Response error:', error.response);
    // You can perform actions like logging out if you get a 401 error, etc.
    return Promise.reject(errorHandler(error));
  }
);

// Handling server error
const errorHandler = (error) => {
  if (error.status === 401) {
    localStorage.clear();
    toaster('Unauthorized access', 'error')
    // window.location.href = '/logout'
  } else if (error.status === 403) {
    toaster('Forbidden, The client does not have access rights to the content', 'error')
  } else if (error.status === 404) {
    toaster('Source Not Found', 'error')
  } else if (error.status === 500) {
    if (error.response && error.response.data) {
      toaster(error.response.data.message, 'error')
    }
    // toaster('Internal Server Error', 'error')
  } else if (error.status === 503) {
    toaster('Service Unavailable', 'error')
  }
  return error
}

export default RestApi;