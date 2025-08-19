// src/services/authService.ts
import axios from 'axios';

export const API_BASE_URL = 'http://10.0.0.87:8062/api';

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

