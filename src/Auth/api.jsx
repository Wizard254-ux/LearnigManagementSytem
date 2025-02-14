import axios from 'axios';
import { useAuth } from './AuthProvider';
import { getGlobalLogout } from './AuthProvider';
// Create axios instance
export const api = axios.create({
  baseURL: 'https://lmsbackendexpress.onrender.com/',
  // baseURL: 'http://localhost:5000/',
  withCredentials: true, // Important for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors remain mostly the same, but remove manual token handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        await api.post(
          'api/auth/refreshToken'
        );

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.log('calling global logout')
        getGlobalLogout()
        return Promise.reject(refreshError);
      }
    }
    console.log('calling global logout')
    getGlobalLogout()
    return Promise.reject(error);
  }
);


// Fetch all lecturers
export const fetchLecturers = async () => {
  try {
    const response = await api.get(`api/lecturers`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    throw error;
  }
};



// Add a new lecturer
export const addLecturer = async (lecturerData) => {
  try {
    const response = await api.post(`api/lecturers`, lecturerData);
    return response.data;
  } catch (error) {
    console.error("Error adding lecturer:", error);
    throw error;
  }
};

// Update a lecturer
export const updateLecturer = async (lecturerData) => {
  try {
    const response = await api.put(`api/lecturers`, lecturerData);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error updating lecturer:", error);
    throw error;
  }
};

// Delete a lecturer
export const deleteLecturer = async (id) => {
  try {
    const response = await api.delete(`api/lecturers/${id}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error deleting lecturer:", error);
    throw error;
  }
};

// Fetch all departments
export const fetchDepartments = async () => {
  try {
    const response = await api.get(`api/departments`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

// Fetch all courses
export const fetchCourses = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/courses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Fetch all units
export const fetchUnits = async () => {
  try {
    const response = await api.get(`api/units`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
};
export const getLecUnits = async () => {
  try {
    const response = await api.get(`api/Lec/getLecUnits`);
    console.log('lecturer units ',response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
};

export const useAuthApi = () => {
  const { login, logout } = useAuth();

  const createLecAccount = async (data) => {
    try {
      const response = await api.post(`api/auth/createLecAccount`, data);
      console.log(response.data);
      login(response.data.lecturer); // Log the user in after creating the account
      return response.data;
    } catch (error) {
      console.error("Error creating lecturer account:", error);
      throw error;
    }
  };

  const loginLecAccount = async (data) => {
    try {
      const response = await api.post(`api/auth/loginLecAccount`, data);
      console.log('Logged in', response.data);
      login(response.data.lecturer); // Log the user in after successful login
      return response.data;
    } catch (error) {
      console.error("Error logging in lecturer account:", error);
      throw error;
    }
  };

  return {
    createLecAccount,
    loginLecAccount,
  };
};

