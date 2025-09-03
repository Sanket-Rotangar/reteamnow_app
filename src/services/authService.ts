// src/services/authService.ts
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// export const API_BASE_URL = 'https://app-backend-production-31a4.up.railway.app/api';

export const registerUser = async (
  fname: string,
  lname: string,
  username: string,
  email: string,
  password: string,
) => {
  const res = await axios.post(`${API_BASE_URL}/user/create-user`, {
    fname,
    lname,
    username,
    email,
    password,
  });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  return res.data;
};

// for logout its just clearing the token from AsyncStorage

