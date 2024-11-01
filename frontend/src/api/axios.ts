import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://79.76.98.39:3000',
  timeout: 1000,
  withCredentials: true,
});

export default function getApi() {
  return instance;
}