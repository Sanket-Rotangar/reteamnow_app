// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = 'http://10.0.0.66:8062';

export const registerUser = async (
  fname: string,
  lname: string,
  username: string,
  email: string,
  password: string,
) => {
  const res = await axios.post(`${API_BASE_URL}/api/user/create-user`, {
    fname,
    lname,
    username,
    email,
    password,
  });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
    email,
    password,
  });
  console.log(res.data);
  return res.data;
};
