import React from "react";
import type { Employee } from "../../types/employee";

interface PersonalInfoFormProps {
  data: Employee;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors?: { [key: string]: string };
  showNotification?: (notif: { type: "success" | "error"; message: string }) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, isEditing, onChange, errors, showNotification }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification?.({ type: "error", message: "กรุณาเลือกไฟล์รูปภาพ" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showNotification?.({ type: "error", message: "ขนาดไฟล์ต้องไม่เกิน 2MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({
        target: { id: "profileImage", value: reader.result as string },
      } as React.ChangeEvent<HTMLInputElement>);
    };
    reader.readAsDataURL(file);
  };

  const fieldLabels: { [key: string]: string } = {
    firstName: "ชื่อ",
    lastName: "นามสกุล",
    email: "อีเมล",
    phone: "เบอร์โทร",
    address: "ที่อยู่",
    birthday: "วันเกิด",
  };

  return (
    <section className="card personal-info">
      <h2>ข้อมูลส่วนตัว</h2>
      <div className="personal-info-container">
        <div className="profile-image-container">
          <label htmlFor="profileImage" className="profile-image-label">
            {data.profileImage ? (
              <img src={data.profileImage} alt="Profile" className="profile-image" />
            ) : (
              <div className="profile-placeholder">คลิกเพื่ออัปโหลด</div>
            )}
          </label>
          <input id="profileImage" type="file" accept="image/*" onChange={handleFileChange} disabled={!isEditing} style={{ display: "none" }} />
          <div className="profile-id">ID: {data.employeeID || "-"}</div>
        </div>

        <div className="personal-fields">
          {Object.keys(fieldLabels).map((field) => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{fieldLabels[field]}</label>
              <input id={field} type={field === "birthday" ? "date" : "text"} value={data[field as keyof Employee] || ""} onChange={onChange} disabled={!isEditing} />
              {errors?.[field] && <small className="error">{errors[field]}</small>}
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="sex">เพศ</label>
            <select id="sex" value={data.sex || "male"} onChange={onChange} disabled={!isEditing}>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่น ๆ</option>
            </select>
            {errors?.sex && <small className="error">{errors.sex}</small>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalInfoForm;
