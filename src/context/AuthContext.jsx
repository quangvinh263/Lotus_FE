import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
    accountId: localStorage.getItem("accountId"),
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("accountId", data.accountId);

    setAuth({
      token: data.token,
      refreshToken: data.refreshToken,
      accountId: data.accountId,
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, refreshToken: null, accountId: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
