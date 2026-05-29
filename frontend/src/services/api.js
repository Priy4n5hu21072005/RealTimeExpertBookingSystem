import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error(
    'VITE_API_URL is not defined. ' +
    'Create a .env file in the frontend directory with VITE_API_URL=http://localhost:5000/api'
  );
}

const API = axios.create({ baseURL });

export default API;
