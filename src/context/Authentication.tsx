import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  logout: () => void;
} | null>(null);

// Auth Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkInitialAuth = () => {
    window.ipcRenderer.send("check");
    window.ipcRenderer.once("auth-response", (_, response) => {
      setIsAuthenticated(response.status);
    });
  };

  const logout = async () => {
    window.ipcRenderer.send("logout");
    setIsAuthenticated(false);
  };

  // checking auth from main process
  useEffect(() => {
    checkInitialAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
