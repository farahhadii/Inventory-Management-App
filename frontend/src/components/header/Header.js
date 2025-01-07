import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectName, SET_LOGIN } from "../../redux/features/auth/authSlice";
import { logoutUser } from "../../services/authService";
import "./Header.scss"

const Header = ({ isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectName);

  const logout = async () => {
    await logoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/login");
  };

  return (
    <div
      className="header"
      style={{
        width: isOpen ? "calc(100% - 230px)" : "100%"
      }}
    >
      <div className="header-content">
        <h3 className="welcome-text">
          Welcome, <span className="user-name">{name}</span>
        </h3>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;