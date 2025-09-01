// src/components/NavBarEmployee.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../style/navbar.css';

const NavBarEmployee: React.FC = () => {
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
        <Link to="/homepage-employee" className="NavLink">🚘 Home</Link>
        <Link to="/AppointmentAll" className="NavLink">🏷️ รายการนัดหมาย</Link>
        <Link to="/Inspection" className="NavLink">📆 รายการตรวจสภาพรถยนต์</Link>
        <Link to="/Summary" className="NavLink">📈 สรุปยอดขาย</Link>
        <Link to="/Emp-Profile" className="NavLink">👨🏻‍💼 ข้อมูลของฉัน</Link>
      </div>

      <div className="NavRight">
         {/* แสดงชื่อของ user ที่ login เข้ามา */}
        <div className="ProfileName">สวัสดี, {user?.name}</div>
        <div className="Profile" onClick={toggleProfileMenu}>
          Log out ▼
        </div>
        {showProfileMenu && (
          <div className="ProfileDropdown">
            
            <div onClick={handleLogout} className="LogoutButton">ออกจากระบบ</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarEmployee;