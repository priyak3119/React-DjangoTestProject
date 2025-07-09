// src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(() => 
    localStorage.getItem('authTokens') ? parseJwt(localStorage.getItem('authTokens')) : null
  );

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post('/api/token/', { username, password });
      setAuthTokens(response.data);
      setUser(parseJwt(response.data.access));
      localStorage.setItem('authTokens', JSON.stringify(response.data));
      return true;
    } catch (error) {
      return false;
    }
  };

  // helper to decode JWT payload
  const parseJwt = (token) => {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
  };

  return (
    <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
