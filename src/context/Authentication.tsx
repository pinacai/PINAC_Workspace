import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  logout: () => void;
} | null>(null);

// Auth Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const checkInitialAuth = async () => {
    window.ipcRenderer.send("get-backend-port");
    window.ipcRenderer.once("backend-port", async (_, backendPort) => {
      const response = await fetch(
        `http://localhost:${backendPort}/api/auth/status`
      );
      response.json().then((data) => {
        setIsAuthenticated(data.authenticated);
      });
    });
  };

  const logout = async () => {
    window.ipcRenderer.send("get-backend-port");
    window.ipcRenderer.once("backend-port", async (_, backendPort) => {
      const response = await fetch(
        `http://localhost:${backendPort}/api/auth/logout`
      );
      response.json().then((data) => {
        setIsAuthenticated(data.success);
      });
    });
  };

  // checking auth from main process
  useEffect(() => {
    checkInitialAuth();
  });

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
