import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeePaymentDetail from "./EmployeePaymentDetail";
import "./employee-payment.css";

interface Payment {
  id: number;
  amount: string;
  payment_date: string;
  status: string;
  customer?: { name: string };
  employee?: { name: string };
}

const EmployeePaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filter, setFilter] = useState<string>("ทั้งหมด");

  // ✅ โหลดรายการชำระเงิน
  const fetchPayments = () => {
    axios
      .get("http://localhost:8080/api/payments")
      .then((res) => setPayments(res.data))
      .catch((err) => console.error("Fetch error", err));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments =
    filter === "ทั้งหมด"
      ? payments
      : payments.filter((p) => p.status === filter);

  return (
    <div className="employee-payment-page">
      <h2 className="section-title">การชำระเงินทั้งหมด</h2>

      {/* ✅ Tabs Filter */}
      <div className="status-tabs">
        {["ทั้งหมด", "รอตรวจสอบ", "ชำระแล้ว", "ปฏิเสธ"].map((s) => (
          <button
            key={s}
            className={filter === s ? "active" : ""}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card-container">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className="payment-card"
            onClick={() => setSelectedPayment(payment)}
          >
            <div className="card-header">
              <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
              <span className={`status-badge ${payment.status}`}>
                {payment.status}
              </span>
            </div>
            <p className="amount">{payment.amount} บาท</p>
            <p>ลูกค้า: {payment.customer?.name || "ไม่ทราบ"}</p>
            <p>พนักงาน: {payment.employee?.name || "ไม่ทราบ"}</p>
          </div>
        ))}
      </div>

      {selectedPayment && (
        <EmployeePaymentDetail
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onUpdated={fetchPayments} // ✅ ส่ง callback มาด้วย
        />
      )}
    </div>
  );
};

export default EmployeePaymentList;
