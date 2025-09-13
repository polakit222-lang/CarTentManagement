import React, { useState } from "react";
import PaymentList from "../../../components/PaymentForCustomer/PaymentList";
import "../../../components/PaymentForCustomer/customer-payment.css";

const CustomerPaymentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ซื้อ");

  return (
    <div className="customer-payment-page">
      <h1 className="page-title">💳 การชำระเงิน</h1>
      <div className="tabs">
        {["ซื้อ", "เช่า", "ประกัน"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <PaymentList type={activeTab} />
    </div>
  );
};

export default CustomerPaymentPage;
