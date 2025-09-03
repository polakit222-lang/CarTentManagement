import React, { useState, useMemo } from 'react';
import { Select, Button, Row, Col, Input, Upload, DatePicker, Modal, Descriptions } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd/es/upload';
import { brandList, modelList, subModelList, provinceList } from '../../../data/carList';

import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.locale('th');

const { Option } = Select;

const AddnewCarPage: React.FC = () => {
  // const {
  //   token: { colorBgContainer, borderRadiusLG },
  // } = theme.useToken();

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedsubModel, setSelectedsubModel] = useState<string | null>(null);
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(null);
  const [manufactureYear, setManufactureYear] = useState<Dayjs | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [mileage, setMileage] = useState<string>('');
  const [usageType, setUsageType] = useState<string | null>(null);
  const [color, setColor] = useState<string>('');
  const [importPrice, setImportPrice] = useState<string>('');
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [cancelConfirmVisible, setCancelConfirmVisible] = useState<boolean>(false);

  const carAgeInYears = useMemo(() => {
    if (!purchaseDate) return '';
    const today = dayjs();
    const diffInYears = today.diff(purchaseDate, 'year');
    return diffInYears.toString();
  }, [purchaseDate]);

  // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
  const isFormValid = useMemo(() => {
    return (
      selectedBrand &&
      selectedModel &&
      selectedsubModel &&
      manufactureYear &&
      purchaseDate &&
      licensePlate.trim() &&
      selectedProvince &&
      mileage.trim() &&
      usageType &&
      color.trim() &&
      importPrice.trim()
    );
  }, [
    selectedBrand,
    selectedModel,
    selectedsubModel,
    manufactureYear,
    purchaseDate,
    licensePlate,
    selectedProvince,
    mileage,
    usageType,
    color,
    importPrice,
  ]);

  // ได้รับข้อมูลจังหวัดที่เลือก
  const getSelectedProvinceName = () => {
    const province = provinceList.find(p => p.province === selectedProvince);
    return province ? province.province : '';
  };

  // ได้รับข้อมูลประเภทการใช้งาน
  const getUsageTypeName = () => {
    if (usageType === '1') return 'ใช้ทำงาน';
    if (usageType === '2') return 'ใช้ส่วนตัว';
    return '';
  };

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedModel(null);
    setSelectedsubModel(null);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    setSelectedsubModel(null);
  };

  const handlesubModelChange = (value: string) => {
    setSelectedsubModel(value);
  };

  const handlePurchaseDateChange = (date: Dayjs | null) => {
    setPurchaseDate(date);
  };

  const handleManufactureYearChange = (date: Dayjs | null) => {
    setManufactureYear(date);
  };

  const handleCancel = () => {
    setCancelConfirmVisible(true);
  };

  const handleConfirmCancel = () => {
    setCancelConfirmVisible(false);
    window.history.back();
  };

  const handleSaveData = () => {
    setConfirmVisible(true);
  };

  const handleConfirmSave = () => {
    console.log('Save button clicked');
    console.log('Selected Brand:', selectedBrand);
    console.log('Selected Model:', selectedModel);
    console.log('Selected Sub Model:', selectedsubModel);
    console.log('Manufacture Year:', manufactureYear?.year());
    console.log('Purchase Date:', purchaseDate?.format('DD/MM/YYYY'));
    console.log('Calculated Car Age:', carAgeInYears);
    console.log('License Plate:', licensePlate);
    console.log('Province:', getSelectedProvinceName());
    console.log('Mileage:', mileage);
    console.log('Usage Type:', getUsageTypeName());
    console.log('Color:', color);
    console.log('Import Price:', importPrice);
    console.log('Uploaded Files:', fileList);

    // ปิด Modal และรีเซ็ตฟอร์ม หรือเปลี่ยนเส้นทาง
    setConfirmVisible(false);
    Modal.success({
      title: 'บันทึกข้อมูลสำเร็จ',
      content: 'ข้อมูลรถยนต์ถูกบันทึกเรียบร้อยแล้ว',
      onOk() {
        window.history.back(); // หรือเปลี่ยนเส้นทางไปหน้าอื่น
      },
    });
  };

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-5);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url || 'https://via.placeholder.com/150';
      }
      return file;
    });
    setFileList(newFileList);
  };

  const filteredModels = useMemo(() => {
    return selectedBrand
      ? modelList.filter((model) => model.brand === selectedBrand)
      : [];
  }, [selectedBrand]);

  const filteredsubModels = useMemo(() => {
    return selectedModel
      ? subModelList.filter((subModel) => subModel.model === selectedModel)
      : [];
  }, [selectedModel]);

  const uploadProps: UploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    listType: 'picture-card',
    fileList: fileList,
    onChange: handleUploadChange,
    multiple: true,
  };
  
  const disabledFutureYear = (current: Dayjs | null) => {
    return current ? current > dayjs().endOf('year') : false;
  };

  const disabledFutureDate = (current: Dayjs | null) => {
    return current ? current > dayjs().endOf('day') : false;
  };

  return (
    <>
      <div style={{ marginLeft: '20px', marginTop: 100 }}>
        <h1>เพิ่มรถคันใหม่เข้าระบบ</h1>
      </div>
      <div
        style={{
          background: '#262626',
          minHeight: 800,
          padding: 24,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1000px', padding: '20px' }}>
          <Row gutter={[38, 38]}>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                ยี่ห้อรถยนต์ <span style={{ color: 'yellow' }}>*</span>
              </p>
              <Select
                placeholder=""
                style={{ width: '100%' }}
                onChange={handleBrandChange}
                value={selectedBrand}
              >
                {brandList.map((brand) => (
                  <Option key={brand.id} value={brand.brand}>
                    {brand.brand}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                รุ่นรถยนต์ <span style={{ color: 'red' }}>*</span>
              </p>
              <Select
                placeholder=""
                style={{ width: '100%' }}
                disabled={!selectedBrand}
                onChange={handleModelChange}
                value={selectedModel}
              >
                {filteredModels.map((model) => (
                  <Option key={model.id} value={model.model}>
                    {model.model}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                ปีผลิต (พ.ศ.) <span style={{ color: 'red' }}>*</span>
              </p>
              <DatePicker
                placeholder="เลือกปี"
                style={{ width: '100%' }}
                onChange={handleManufactureYearChange}
                picker="year"
                disabledDate={disabledFutureYear}
                value={manufactureYear}
              />
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                รายละเอียดรุ่นรถ <span style={{ color: 'red' }}>*</span>
              </p>
              <Select
                placeholder=""
                style={{ width: '100%' }}
                disabled={!selectedModel}
                onChange={handlesubModelChange}
                value={selectedsubModel}
              >
                {filteredsubModels.map((submodel) => (
                  <Option key={submodel.id} value={submodel.submodel}>
                    {submodel.submodel}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'white', fontSize: '1.0em', marginBottom: '5px' }}>
                วัน/เดือน/ปี ที่ซื้อครั้งแรก <span style={{ color: 'red' }}>*</span>
              </p>
              <DatePicker
                placeholder="เลือก วัน/เดือน/ปี ที่ซื้อ"
                style={{ width: '100%', backgroundColor: '#4a4a4a', borderColor: '#666666' }}
                onChange={handlePurchaseDateChange}
                format="DD/MM/YYYY"
                disabledDate={disabledFutureDate}
                value={purchaseDate}
              />
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>อายุการใช้งาน (ปี)</p>
              <Input
                placeholder="คำนวณอัตโนมัติ"
                value={carAgeInYears}
                disabled
              />
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                ทะเบียนรถยนต์ <span style={{ color: 'red' }}>*</span>
              </p>
              <Input
                placeholder=""
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                จังหวัดของป้ายทะเบียน <span style={{ color: 'red' }}>*</span>
              </p>
              <Select
                placeholder=""
                style={{ width: '100%' }}
                value={selectedProvince}
                onChange={(value) => setSelectedProvince(value)}
              >
                {provinceList.map((province) => (
                  <Option key={province.province} value={province.province}>
                    {province.province}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                เลขไมล์ปัจจุบัน <span style={{ color: 'red' }}>*</span>
              </p>
              <Input
                placeholder=""
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                ประเภทการใช้งาน <span style={{ color: 'red' }}>*</span>
              </p>
              <Select
                placeholder=""
                style={{ width: '100%' }}
                value={usageType}
                onChange={(value) => setUsageType(value)}
              >
                <Option value="1">ใช้ทำงาน</Option>
                <Option value="2">ใช้ส่วนตัว</Option>
              </Select>
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                สีรถยนต์ <span style={{ color: 'red' }}>*</span>
              </p>
              <Input
                placeholder=""
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                ราคานำเข้า (บาท) <span style={{ color: 'red' }}>*</span>
              </p>
              <Input
                placeholder=""
                value={importPrice}
                onChange={(e) => setImportPrice(e.target.value)}
              />
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>รูปภาพรถยนต์</p>
              <Upload {...uploadProps}>
                {fileList.length < 5 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>อัปโหลด</div>
                  </div>
                )}
              </Upload>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: '40px', width: '100%', maxWidth: '1000px', textAlign: 'right' }}>
          <Button
            style={{
              marginRight: '10px',
              width: '100px',
              background: 'black',
              color: '#f1d430ff',
              borderRadius: '5px',
              border: '1px solid #d9d9d9',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f0f0f0';
              e.currentTarget.style.color = 'black';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'black';
              e.currentTarget.style.color = '#f1d430ff';
            }}
            onClick={handleCancel}
          >
            ยกเลิก
          </Button>
          <Button
            style={{
              width: '100px',
              background: '#f1d430ff',
              color: isFormValid ? 'black' : '#0c0c0cff',
              borderRadius: '5px',
              border: `1px solid ${isFormValid ? '#d4b434' : '#d9d9d9'}`,
              cursor: isFormValid ? 'pointer' : 'not-allowed',
            }}
            disabled={!isFormValid}
            onMouseOver={(e) => {
              if (isFormValid) {
                e.currentTarget.style.background = '#d4b434';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseOut={(e) => {
              if (isFormValid) {
                e.currentTarget.style.background = '#f1d430ff';
                e.currentTarget.style.color = 'black';
              }
            }}
            onClick={handleSaveData}
          >
            บันทึกข้อมูล
          </Button>
        </div>
      </div>

      {/* Modal สำหรับยืนยันการยกเลิก */}
      <Modal
        title="ยืนยันการยกเลิก"
        open={cancelConfirmVisible}
        onCancel={() => setCancelConfirmVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCancelConfirmVisible(false)}>
            แก้ไขต่อ
          </Button>,
          <Button key="confirm" type="primary" danger onClick={handleConfirmCancel}>
            ยกเลิก
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '22px', marginRight: '10px' }} />
          <span>คุณต้องการยกเลิกการเพิ่มรถคันใหม่ใช่หรือไม่?</span>
        </div>
        <p style={{ color: '#999', marginLeft: '32px' }}>ข้อมูลที่กรอกจะหายไป</p>
      </Modal>

      {/* Modal สำหรับยืนยันข้อมูล */}
      <Modal
        title="ยืนยันการบันทึกข้อมูล"
        open={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setConfirmVisible(false)}>
            ยกเลิก
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmSave}>
            บันทึกข้อมูล
          </Button>,
        ]}
      >
        <p style={{ marginBottom: '20px' }}>กรุณาตรวจสอบข้อมูลก่อนบันทึก:</p>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="ยี่ห้อรถยนต์">{selectedBrand}</Descriptions.Item>
          <Descriptions.Item label="รุ่นรถยนต์">{selectedModel}</Descriptions.Item>
          <Descriptions.Item label="ปีผลิต">{manufactureYear?.year()}</Descriptions.Item>
          <Descriptions.Item label="รายละเอียดรุ่นรถ">{selectedsubModel}</Descriptions.Item>
          <Descriptions.Item label="วันที่ซื้อ">{purchaseDate?.format('DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="อายุการใช้งาน">{carAgeInYears} ปี</Descriptions.Item>
          <Descriptions.Item label="ทะเบียนรถยนต์">{licensePlate}</Descriptions.Item>
          <Descriptions.Item label="จังหวัด">{selectedProvince}</Descriptions.Item>
          <Descriptions.Item label="เลขไมล์ปัจจุบัน">{mileage}</Descriptions.Item>
          <Descriptions.Item label="ประเภทการใช้งาน">{getUsageTypeName()}</Descriptions.Item>
          <Descriptions.Item label="สีรถยนต์">{color}</Descriptions.Item>
          <Descriptions.Item label="ราคานำเข้า">{importPrice} บาท</Descriptions.Item>
          <Descriptions.Item label="รูปภาพ" span={2}>
            {fileList.length > 0 ? `${fileList.length} รูป` : 'ไม่มีรูปภาพ'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default AddnewCarPage;