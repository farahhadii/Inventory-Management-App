import React from "react";
import { FaBox, FaGlobe, FaSmile, FaHandshake } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Home.scss";
import modernWarehouse from "../../assets/warehouse.png";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Home = () => {
  return (
    <div className="home">
      <nav className="navbar">
        <div className="logo">
          <FaBox size={30} />
          <h2>InventoryPro</h2>
        </div>
        <ul className="home-links">
          <ShowOnLogout>
            <li>
              <button className="--btn --btn-primary">
                <Link to="/register">Register</Link>
              </button>
            </li>
          </ShowOnLogout>
          <ShowOnLogout>
            <li>
              <button className="--btn --btn-primary">
                <Link to="/login">Login</Link>
              </button>
            </li>
          </ShowOnLogout>
          <ShowOnLogin>
            <li>
              <button className="--btn --btn-primary">
                <Link to="/dashboard">Dashboard</Link>
              </button>
            </li>
          </ShowOnLogin>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1>Stay in Control</h1>
          <p>
            An inventory system designed to control and manage warehouse
            products in real time. Experience effortless, real-time tracking of
            goods for any business size.
          </p>
          <div className="stats">
            <div className="stat">
              <FaGlobe size={32} />
              <h3>12,000+</h3> 
              <p>Global Brands</p>
            </div>
            <div className="stat">
              <FaSmile size={32} />
              <h3>250,000+</h3>
              <p>Happy Users</p>
            </div>
            <div className="stat">
              <FaHandshake size={32} />
              <h3>800+</h3>
              <p>Trusted Partners</p>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={modernWarehouse} alt="Modern Warehouse" loading="lazy" />
        </div>
      </section>
    </div>
  );
};

export default Home;
