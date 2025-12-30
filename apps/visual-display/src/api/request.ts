import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
});

request.interceptors.request.use((conifg) => {
  return conifg;
});

request.interceptors.response.use((response) => {
  return response;
});

export default request;
