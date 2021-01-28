import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_baseURL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
    }
});

export default apiClient