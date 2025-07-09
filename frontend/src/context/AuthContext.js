// src/context/AuthContext.jsx
import React, { createContext, useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUserInfo(null);
    navigate("/login");
  }, [navigate]);

  const fetchUser = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserInfo(response.data);
    } catch (error) {
      logoutUser();
    }
  }, [logoutUser]); // ✅ included logoutUser in dependency array

  const refreshToken = useCallback(async () => {
    try {
      const refresh = localStorage.getItem("refreshToken");
      if (!refresh) throw new Error("No refresh token");

      const response = await axios.post("http://localhost:8000/api/token/refresh/", { refresh });

      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        await fetchUser(); // ✅ this is used now
        return response.data.access;
      }

      logoutUser();
      return null;
    } catch (error) {
      logoutUser();
      return null;
    }
  }, [logoutUser, fetchUser]); // ✅ added fetchUser to dependencies

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchUser();
  }, [fetchUser]); // ✅ stable fetchUser used correctly

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
          logoutUser();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken, logoutUser]);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        email,
        password,
      });

      if (response.status === 200 && response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        await fetchUser();
        navigate("/dashboard");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        logoutUser,
        refreshToken,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
