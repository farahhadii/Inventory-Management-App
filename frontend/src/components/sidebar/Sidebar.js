import React, { useState } from "react";
import "./Sidebar.scss";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaBox } from "react-icons/fa";
import menu from "../../data/sidebar";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true); 
  const toggle = () => setIsOpen(!isOpen); 
  const navigate = useNavigate(); 

  const goHome = () => {
    navigate("/"); 
  };

  return (
    <div className="layout">
      <div className="sidebar" style={{ width: isOpen ? "230px" : "80px" }}>
        <div className="top_section">
          <div className="logo" style={{ display: isOpen ? "block" : "none" }}>
            <FaBox size={25} style={{ cursor: "pointer" }} onClick={goHome} />
          </div>

          <div className="bars">
            <HiMenuAlt3 onClick={toggle} />
          </div>
        </div>

        {menu.map((item, index) => {
          return <SidebarItem key={index} item={item} isOpen={isOpen} />;
        })}
      </div>

      <main className={`main ${isOpen ? "open" : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default Sidebar;