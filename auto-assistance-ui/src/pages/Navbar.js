// src/components/Navbar.js
import React from 'react';
import '../css/Navbar.css';  // 引入导航栏样式

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="navbar">
      <div className="hamburger-menu" onClick={toggleSidebar}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <div className="navbar-title">My Application</div>
    </div>
  );
};

export default Navbar;
