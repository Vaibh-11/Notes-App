import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        alert("Please enter all fields");
        return;
      }

      const nameRegex = /^[A-Za-z][A-Za-z\s]{1,49}$/;
      if (!nameRegex.test(name)) {
        alert("Invalid name");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Invalid email format");
        return;
      }
      const data = await api.post("/user/signup", {
        name,
        email,
        password,
      });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="card card-border bg-base-300 w-96 mt-5">
        <div className="card-body">
          <h2 className="card-title justify-center">User Registration</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <input
              className="input mt-5"
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
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
              <button className="btn btn-primary">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
