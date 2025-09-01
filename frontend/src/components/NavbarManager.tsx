// src/components/NavbarManager.tsx (แก้ไขชื่อไฟล์ถ้ามีอักขระแปลกๆ)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../style/navbar.css';

const NavbarManager: React.FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // --- vvv แก้ไข vvv ---
  const { user, logout } = useAuth(); // ดึง user มาด้วย
  // --- ^^^ แก้ไข ^^^ --- 
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    logout();
    navigate('/buycar'); 
  };

  return (
    <nav className='Navstyle'>
      <div className="NavLeft">
        <Link to="/home" className="NavLink">🚘 Home</Link>
        <Link to="/sell" className="NavLink">🏷️ รายการขาย</Link>
        <Link to="/rent" className="NavLink">📆 รายการให้เช่า</Link>
        <Link to="/tent-summary" className="NavLink">📈 สรุปยอด</Link>
        <Link to="/manage-employee" className="NavLink">👨🏻‍💼 จัดการพนักงาน</Link>
        <Link to="/manager-insurance" className="NavLink">🗂️ รายการประกัน</Link>
      </div>

      <div className="NavRight">
        <div className="ProfileName">สวัสดี, {user?.name}</div>
        <div className="Profile" onClick={toggleProfileMenu}>
          👨🏻‍💻 Admin ▼
        </div>
        {showProfileMenu && (
          <div className="ProfileDropdown">
            <Link to="manager-profile">Profile</Link>
            <div onClick={handleLogout} className="LogoutButton">ออกจากระบบ</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarManager;