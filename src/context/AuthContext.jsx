// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading, true/false: done

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("uToken");
      if (!token) return setIsAuthenticated(false);

      try {
        const res = await axios.get(`${baseURL}/api/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthenticated(res.status === 200);
      } catch (err) {
        localStorage.removeItem("uToken");
        setIsAuthenticated(false);
      }
    };

    verify();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
