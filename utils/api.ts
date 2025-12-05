import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// Create axios instance with default config 

const api = axios.create({
     baseURL: API_BASE_URL,
     headers: {
          'Content-Type': 'application/json'
     }

});
api.interceptors.request.use(
     async (config) => {
          try {
               const token = localStorage.getItem("idToken");
               if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
               }
          } catch (error) {
               console.error('Failed to get auth token:', error);
          }
          return config;
     },
     (error) => {
          return Promise.reject(error);
     }

);
api.interceptors.response.use(
     (response) => response,
     (error) => {
          if (error.response?.status === 401) {
               localStorage.clear();
               window.location.href = 'https://us-east-2vpnzrjwhp.auth.us-east-2.amazoncognito.com/login?client_id=mprqfsjl2oapu6iscbb41gk9u&response_type=token&scope=openid+email+profile&redirect_uri=https://zoomievetcare.com/callback';
          }
          return Promise.reject(error);

     }

);

export default api; 