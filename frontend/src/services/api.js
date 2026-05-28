import axios from 'axios';

const API = axios.create({
  baseURL: 'https://realtimeexpertbookingsystem.onrender.com/api'
});

export default API;