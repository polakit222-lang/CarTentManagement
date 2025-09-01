import React from "react";

interface SidebarProps {
  onSelect: (tab: string) => void;
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, activeTab }) => {
  const menuItems = [
    { id: "profile", label: "ข้อมูลส่วนตัว" },
    { id: "leave", label: "ประวัติการลา" },
  ];

  return (
    <aside className="sidebar" role="navigation">
      <h2>เมนู</h2>
      <ul>
        {menuItems.map(item => (
          <li
            key={item.id}
            className={activeTab === item.id ? "active" : ""}
            onClick={() => onSelect(item.id)}
            aria-current={activeTab === item.id ? "page" : undefined}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
