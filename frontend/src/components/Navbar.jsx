import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      await api.get("/user/getLogInUser", {
        withCredentials: true,
      });
      setLoggedIn(true);
    } catch {
      setLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post(
        "/user/logout",
        {},

        { withCredentials: true },
      );

      setLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  if (loggedIn === null) {
    return null;
  }

  let loginButton;

  if (loggedIn) {
    loginButton = (
      <div>
        <Link to="/create" className="btn btn-info mr-2">
          Create
        </Link>
        <button onClick={handleLogout} className="btn btn-error">
          Logout
        </button>
      </div>
    );
  } else {
    loginButton = (
      <>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn">
          Signup
        </Link>
      </>
    );
  }

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <h1 className="btn btn-ghost text-xl">Real-Time-Notes</h1>
      </div>

      <div className="flex gap-5">{loginButton}</div>
    </div>
  );
};

export default Navbar;
