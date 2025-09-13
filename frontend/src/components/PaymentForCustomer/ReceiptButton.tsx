import React, { useState } from "react";
import axios from "axios";
import "./customer-payment.css";

interface ReceiptButtonProps {
  paymentId?: number; // ✅ กัน undefined
}

const ReceiptButton: React.FC<ReceiptButtonProps> = ({ paymentId }) => {
  const [loading, setLoading] = useState(false);

  const fetchReceipt = async () => {
    if (!paymentId) {
      alert("❌ ไม่พบ Payment ID");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/receipts/${paymentId}`);

      if (res.data.length > 0) {
        // ✅ เลือกใบเสร็จล่าสุด
        const receipt = res.data[0];
        if (receipt.link) {
          // เปิดไฟล์ PDF
          window.open(`http://localhost:8080${receipt.link}`, "_blank");
        } else {
          alert("❌ ไม่พบลิงก์ใบเสร็จในระบบ");
        }
      } else {
        alert("❌ ไม่มีใบเสร็จสำหรับการชำระนี้");
      }
    } catch (error) {
      console.error("Fetch receipt failed", error);
      alert("❌ โหลดใบเสร็จไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn-secondary" onClick={fetchReceipt} disabled={loading}>
      {loading ? "กำลังโหลด..." : "📄 ดูใบเสร็จ"}
    </button>
  );
};

export default ReceiptButton;
