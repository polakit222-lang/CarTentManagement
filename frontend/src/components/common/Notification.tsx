import React from "react";

interface NotificationProps {
  type: "success" | "error";
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ type, message }) => {
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

export default Notification;
