// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../services/authService';

type User = {
  fname: string;
  lname: string;
  username: string;
  email: string;
};

type AuthContextType = {
  userToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (fname: string, lname: string, username: string, email: string, password: string) => Promise<void>;
  userInfo: User | null;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  userInfo: null,
});

export const AuthProvider = ({ children }: any) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) setUserToken(token);
      const user = await AsyncStorage.getItem('userInfo');
      if (user) setUserInfo(JSON.parse(user));
    };
    loadData();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    setUserToken(res.token);
    setUserInfo(res.user);
    await AsyncStorage.setItem('userToken', res.token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(res.user));
  };

  const logout = async () => {
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  };

  const register = async (fname: string, lname: string, username: string, email: string, password: string) => {
    await registerUser(fname, lname, username, email, password);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, register, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
