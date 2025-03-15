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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 控制侧边栏是否展开

    // 切换侧边栏显示和隐藏
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Router>
            <div className="app-container">
                {/* 导航栏 */}
                <Navbar toggleSidebar={toggleSidebar} />

                {/* 侧边栏 */}
                <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <Sidebar />
                </div>

                {/* 主内容区域 */}
                <div className="content">
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



