import { createContext, useContext, useState } from "react";
import { superAdminLogin } from "../api/superAdminApi";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("superAdminUser")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("superAdminToken") || null
  );

  const isLoggedIn = !!token;

  const login = async (email, password) => {
    const data = await superAdminLogin(email, password);
    localStorage.setItem("superAdminToken", data.token);
    localStorage.setItem("superAdminUser", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("superAdminUser");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);