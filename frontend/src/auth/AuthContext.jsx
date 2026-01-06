import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState("GUEST");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
    setLoading(false);
  }, []);

  const loginAs = (newRole) => {
    localStorage.setItem("role", newRole);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("role");
    setRole("GUEST");
  };

  return (
    <AuthContext.Provider value={{ role, loading, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
