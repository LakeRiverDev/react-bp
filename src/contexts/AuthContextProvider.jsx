import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setIsAuth(!!access_token);
  }, []);

  const login = (access_token, name, email) => {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    setIsAuth(true);
    navigate("/workspace");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    setIsAuth(false);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
