import axios from 'axios'
import { toaster } from './helpers.js';

export const baseURL = 'http://localhost:8080'
// export const baseURL = 'https://192.168.122.15'

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

if (accessToken) {
  RestApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}


RestApi.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(errorHandler(error));
});

// Handling server error
const errorHandler = (error) => {
  if (error.response.status === 401) {
    localStorage.clear();
    toaster('Unauthorized access.', 'error')
    window.location.href = '/logout'
  } else if (error.response.status === 500) {
    toaster('Internal Server Error.', 'error')
  }
  return error
}

export default RestApi;