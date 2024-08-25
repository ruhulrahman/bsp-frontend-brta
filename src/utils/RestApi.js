import axios from 'axios'

export const baseURL = 'https://api-nuxtgen.nvs.la'

const accessToken = localStorage.getItem('token')

const RestApi = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    accessMenuName: window.location.href,
    // 'Content-Type': 'multipart/form-data'
  },
  Authorization: {
    'token': 'token e6865b0c7034527cc56eb7a97007f4d18bbd1c9e'
  }
});

if (accessToken) {
  RestApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  // RestApi.defaults.Authorization['token'] = `Bearer ${accessToken}`;
}

export default RestApi;