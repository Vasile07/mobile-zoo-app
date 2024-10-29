// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Base URL
});

// Interceptor to attach the Bearer token to each request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Attach Bearer token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
