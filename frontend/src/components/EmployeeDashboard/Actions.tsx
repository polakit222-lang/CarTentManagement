import React from "react";

interface ActionsProps {
  onLeaveRequest: () => void;
}

const Actions: React.FC<ActionsProps> = ({ onLeaveRequest }) => {
  return (
    <section className="card actions">
      <button className="action-btn" onClick={onLeaveRequest}>
        📅 ยื่นคำขอลา
      </button>
    </section>
  );
};

export default Actions;
