// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {

    return (
        <div className="sidebar-content">
            {/* 一级菜单：Process */}
            <h3  style={{cursor: 'pointer'}}>
                Process
            </h3>
            {/* 二级菜单：根据 isProcessOpen 控制显示 */}
                <ul>
                    <li><Link to="/hive">Hive</Link></li>
                    <li><Link to="/oraas">Oraas</Link></li>
                    <li><Link to="/autosys">Autosys</Link></li>
                </ul>

            <h3>QA</h3>
        </div>

    );
};

export default Sidebar;
