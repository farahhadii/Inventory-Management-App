import React, { useState } from "react";
import styles from "./auth.module.scss";
import { FaSignInAlt } from "react-icons/fa";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser, validateEmail } from "../../services/authService";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";

const initialState = {
  email: "",
  password: ""
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setformData] = useState(initialState);
  const { email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    const userData = {
      email,
      password,
    };
    try {
      const data = await loginUser(userData);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
    } catch (error) {}
  };

  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <FaSignInAlt size={35} color="#999" />
          </div>
          <h2>Login</h2>
          <form onSubmit={login}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="--btn --btn-primary --btn-block"
              style={{
                fontSize: "1.3rem",
                padding: "0.7rem",
                backgroundColor: "#1e3c72",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                width: "100%",
                textAlign: "center",
                cursor: "pointer",
                display: "inline-block",
                transition: "background-color 0.3s ease",
                textTransform: "none",
              }}
            >
              Login
            </button>
          </form>
          <div className={styles.links}>
            <div className={styles["links-left"]}>
              <Link to="/forgot">Forgot Password</Link>
            </div>
            <div className={styles["links-right"]}>
              <Link to="/">Home</Link>
            </div>
          </div>
          <div className={styles.register} style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <p style={{ display: "inline", marginRight: "0.5rem" }}>Create an account</p>
            <Link to="/register" style={{ color: "#1e3c72", fontWeight: "bold" }}>
              Register
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
