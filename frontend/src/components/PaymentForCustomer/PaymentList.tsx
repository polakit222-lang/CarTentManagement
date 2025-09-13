import React, { useState, useEffect } from "react";
import axios from "axios";
import PaymentMethodForm from "./PaymentMethodForm";
import ReceiptButton from "./ReceiptButton";
import "./customer-payment.css";

interface Customer {
  id: number;
  name: string;
}
interface Payment {
  id: number;
  amount: string;
  payment_date: string;
  status: string;
  sales_contract_id?: number;
  rent_contract_id?: number;
  customer?: Customer;
}

const PaymentList: React.FC<{ type: string }> = ({ type }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/payments?segment=${type}`)
      .then((res) => setPayments(res.data))
      .catch((err) => console.error("Fetch error", err));
  }, [type]);

  return (
    <div className="payment-list">
      <h2 className="section-title">รายการ{type}</h2>
      <div className="card-container">
        {payments.map((payment) => (
          <div key={payment.id} className="payment-card">
            <div className="card-header">
              <span className="payment-date">
                {new Date(payment.payment_date).toLocaleDateString()}
              </span>
              <span className={`status-badge ${payment.status}`}>
                {payment.status}
              </span>
            </div>
            <div className="card-body">
              <p>
                <strong>ลูกค้า:</strong> {payment.customer?.name || "ไม่ระบุ"}
              </p>
              <p className="amount">{payment.amount} บาท</p>
              <div className="actions">
                {payment.status === "รอชำระ" && (
                  <button
                    className="btn-primary"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    ชำระเงิน
                  </button>
                )}
                {payment.status === "ชำระแล้ว" && (
                  <ReceiptButton paymentId={payment.id} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPayment && (
        <PaymentMethodForm
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};

export default PaymentList;
