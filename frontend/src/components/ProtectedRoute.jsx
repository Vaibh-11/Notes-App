import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../utils/axios";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/user/getLogInUser", {
          withCredentials: true,
        });
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return <h1>Loading</h1>;
  } else {
    return isAuth ? children : <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
