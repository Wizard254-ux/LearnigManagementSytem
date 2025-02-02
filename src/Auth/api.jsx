import axios from 'axios';
import { jwtDecode } from "jwt-decode";  // ✅ Correct way
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';

// Create axios instance
const api = axios.create({
  baseURL: 'http://192.168.137.1:5000', // Base URL for all requests,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Function to check if the access token is expired
const isTokenExpired = (token) => {
  if (!token) return true; // If no token, consider it expired

  try {
    const decoded = jwtDecode(token); // Decode the token
    const currentTime = Date.now() / 1000; // Get current time in seconds
    return decoded.exp < currentTime; // Check if token is expired
  } catch (error) {
    return true; // If decoding fails, consider it expired
  }
};

// Function to refresh the access token
const refreshTokenRequest = async () => {
  try {
    const refreshToken =  localStorage.getItem(REFRESH_TOKEN);
    const response = await axios.post(`${api.defaults.baseURL}/api/user/auth/refreshToken`, {
      refreshToken,
    });
    const { accessToken } = response.data;

     localStorage.setItem(ACCESS_TOKEN, accessToken); // Save the new access token
    return accessToken;
  } catch (error) {
    // Clear tokens if refresh fails
     localStorage.removeItem(ACCESS_TOKEN);
     localStorage.removeItem(REFRESH_TOKEN);
    throw error;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const accessToken =  localStorage.getItem(ACCESS_TOKEN);

    // Check if the access token is expired
    if (accessToken && isTokenExpired(accessToken)) {
      try {
        // Refresh the access token
        const newToken = await refreshTokenRequest();
        config.headers.Authorization = `Bearer ${newToken}`; // Update the request header
      } catch (error) {
        // If refresh fails, clear tokens and reject the request
         localStorage.removeItem(ACCESS_TOKEN);
         localStorage.removeItem(REFRESH_TOKEN);
        return Promise.reject(error);
      }
    } else if (accessToken) {
      // If the token is valid, add it to the request header
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response; // Return the response if successful
  },
  (error) => {
    return Promise.reject(error); // Reject the error if the response fails
  }
);

export default api;