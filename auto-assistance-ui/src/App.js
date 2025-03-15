// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Sidebar from './pages/Sidebar';
import HivePage from './pages/HivePage';
import OraasPage from './pages/OraasPage';
import AutosysPage from './pages/AutosysPage';
import Navbar from './pages/Navbar';
import './css/App.css';  // 引入样式

const App = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Router>
            <div className="app-container">
                {/* 导航栏 */}
                <Navbar toggleSidebar={toggleSidebar} />

                {/* 侧边栏 */}
                <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                    <Sidebar/>
                </div>

                {/* 主内容区域 */}
                <div className="main-content">
                    <Routes>
                        <Route path="/hive" element={<HivePage />} />
                        <Route path="/oraas" element={<OraasPage />} />
                        <Route path="/autosys" element={<AutosysPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};


export default App;



