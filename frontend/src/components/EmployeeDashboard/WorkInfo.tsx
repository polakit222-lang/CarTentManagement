import React from "react";

interface Props {
  position: string;
  jobType: string;
  totalSales: string;
}

const WorkInfo: React.FC<Props> = ({ position, jobType, totalSales }) => {
  const formatSales = (value: string) => {
    const num = Number(value.replace(/,/g, ""));
    return isNaN(num) ? value : num.toLocaleString();
  };

  return (
    <section className="card work-info">
      <h2>ข้อมูลการทำงาน</h2>
      <div className="grid">
        <div className="form-group">
          <label>ตำแหน่ง</label>
          <input value={position} disabled />
        </div>
        <div className="form-group">
          <label>ประเภทงาน</label>
          <input value={jobType} disabled />
        </div>
        <div className="form-group">
          <label>ยอดขายรวม</label>
          <input value={formatSales(totalSales)} disabled />
        </div>
      </div>
    </section>
  );
};

export default WorkInfo;
