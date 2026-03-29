import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Login = () => {
  const [email, setEmail] = useState("solankivaibhav589@gmail.com");
  const [password, setPassword] = useState("Vaibhav11");
  const Navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Email and password are required");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Invalid email format");
        return;
      }
      const data = await api.post(
        "/user/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      (Navigate("/home"), (window.location.href = "/home"));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="card card-border bg-base-300 w-96 mt-5">
        <div className="card-body">
          <h2 className="card-title justify-center">User Login</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              className="input mt-5"
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <br />
            <input
              className="input mt-5"
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="card-actions justify-center mt-5">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
