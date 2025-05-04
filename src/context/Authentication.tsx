import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
} | null>(null);

// Auth Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading,setIsLoading]=useState(true);

  const checkInitialAuth = () => {
    window.ipcRenderer.send("check-auth-status");
    window.ipcRenderer.once("auth-response", (_, response) => {
      setIsAuthenticated(response.status);
      setIsLoading(false);
    });
  };

  const logout = async () => {
    window.ipcRenderer.send("logout");
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  // checking auth from main process
  useEffect(() => {
    checkInitialAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated,isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
