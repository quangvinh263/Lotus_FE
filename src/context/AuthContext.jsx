import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
    accountId: localStorage.getItem("accountId"),
    role: localStorage.getItem("role"),
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("accountId", data.accountId);
    localStorage.setItem("role", data.role);
    setAuth({
      token: data.token,
      refreshToken: data.refreshToken,
      accountId: data.accountId,
      role: data.role,
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, refreshToken: null, accountId: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
