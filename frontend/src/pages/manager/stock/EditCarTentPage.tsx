/* eslint-disable no-irregular-whitespace */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carList } from '../../../data/carList';
import { Row, Col, Select, Input, Upload, Button, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd/es/upload';
import { brandList, modelList, subModelList, provinceList } from '../../../data/carList';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';

import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.locale('th');

const { Option } = Select;

  const EditCarTentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = carList.find(c => c.id === Number(id));

  if (!car) {
    return <div>ไม่พบรถ</div>;
  }

  const [selectedBrand, setSelectedBrand] = useState<string>(car.brand);
  const [selectedModel, setSelectedModel] = useState<string>(car.model);
  const [selectedSubModel, setSelectedSubModel] = useState<string>(car.subModel);
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(car.purchaseDate ? dayjs(car.purchaseDate) : null);
  const [manufactureYear, setManufactureYear] = useState<Dayjs | null>(car.yearManufactured ? dayjs().year(car.yearManufactured) : null);
  const [fileList, setFileList] = useState<UploadFile[]>(car.pic.map((url, index) => ({
    uid: index.toString(),
    name: `image-${index}.png`,
    status: 'done',
    url,
  })));
  const [carAgeInYears, setCarAgeInYears] = useState<string>(car.yearUsed ? car.yearUsed.toString() : '');
  const [mileage, setMileage] = useState<number | string>(car.mileage);
  const [carCondition, setCarCondition] = useState<string>(car.condition);
  const [carColor, setCarColor] = useState<string>(car.color || '');
  const [carPrice, setCarPrice] = useState<number | string>(car.price);
  const [carRegistration, setCarRegistration] = useState<string>(car.registrationNumber || '');
  const [registrationProvince, setRegistrationProvince] = useState<string | null>(car.registrationProvince || '');

  useEffect(() => {
    if (purchaseDate) {
      const today = dayjs();
      const diffInYears = today.diff(purchaseDate, 'year');
      setCarAgeInYears(diffInYears.toString());
    } else {
      setCarAgeInYears(car.yearUsed ? car.yearUsed.toString() : '');
    }
  }, [purchaseDate, car.yearUsed]);

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedModel(modelList.find(m => m.brand === value)?.model || '');
    setSelectedSubModel(subModelList.find(sm => sm.model === (modelList.find(m => m.brand === value)?.model))?.submodel || '');
  };
  
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    setSelectedSubModel(subModelList.find(sm => sm.model === value)?.submodel || '');
  };
  
  const handleSubModelChange = (value: string) => {
    setSelectedSubModel(value);
  };
  
  const handlePurchaseDateChange = (date: Dayjs | null) => {
    setPurchaseDate(date);
  };
  
  const handleManufactureYearChange = (date: Dayjs | null) => {
    setManufactureYear(date);
  };
  
  const handleCancel = () => {
    navigate(-1);
  };

  const handleSaveData = () => {
    const updatedCarData = {
      id: car.id,
      brand: selectedBrand,
      model: selectedModel,
      subModel: selectedSubModel,
      yearManufactured: manufactureYear?.year(),
      purchaseDate: purchaseDate?.format('DD/MM/YYYY'),
      yearUsed: carAgeInYears,
      registrationNumber: carRegistration,
      registrationProvince: registrationProvince,
      mileage: mileage,
      condition: carCondition,
      color: carColor,
      price: carPrice,
      pic: fileList.map(file => file.url || file.thumbUrl).filter(Boolean),
    };
    
    console.log('Saving updated car data:', updatedCarData);
    message.success('ข้อมูลรถยนต์ถูกบันทึกเรียบร้อยแล้ว!');
    navigate('/stock/edit');
  };

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-5);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url || file.url;
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

  const filteredSubModels = useMemo(() => {
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
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>ยี่ห้อรถยนต์</p>
              <Select value={selectedBrand} style={{ width: '100%' }} onChange={handleBrandChange}>
                {brandList.map((brand) => (
                  <Option key={brand.id} value={brand.brand}>
                    {brand.brand}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>รุ่นรถยนต์</p>
              <Select value={selectedModel} style={{ width: '100%' }} onChange={handleModelChange}>
                {filteredModels.map((model) => (
                  <Option key={model.id} value={model.model}>
                    {model.model}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>ปีผลิต (พ.ศ.)</p>
              <DatePicker
                value={manufactureYear}
                style={{ width: '100%' }}
                onChange={handleManufactureYearChange}
                picker="year"
                disabledDate={disabledFutureYear}
              />
            </Col>
            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>รายละเอียดรุ่นรถ</p>
              <Select value={selectedSubModel} style={{ width: '100%' }} onChange={handleSubModelChange}>
                {filteredSubModels.map((submodel) => (
                  <Option key={submodel.id} value={submodel.submodel}>
                    {submodel.submodel}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>วัน/เดือน/ปี ที่ซื้อครั้งแรก</p>
              <DatePicker
                value={purchaseDate}
                style={{ width: '100%' }}
                onChange={handlePurchaseDateChange}
                format="DD/MM/YYYY"
                disabledDate={disabledFutureDate}
              />
            </Col>

            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>อายุการใช้งาน (ปี)</p>
              <Input value={carAgeInYears} style={{ width: '100%' }} disabled />
            </Col>

            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>ทะเบียนรถยนต์</p>
              <Input 
                placeholder="ป้อนทะเบียนรถยนต์" 
                value={carRegistration} 
                onChange={(e) => setCarRegistration(e.target.value)} 
              />
            </Col>

            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>จังหวัดของป้ายทะเบียน</p>
              <Select 
                placeholder="เลือกจังหวัด" 
                style={{ width: '100%' }} 
                value={registrationProvince} 
                onChange={(value) => setRegistrationProvince(value as unknown as string)}
              >
                {provinceList.map((province) => (
                  <Option key={province.id} value={province.id}>
                    {province.province}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>เลขไมล์ปัจจุบัน</p>
              <Input 
                placeholder="ป้อนเลขไมล์" 
                value={mileage} 
                onChange={(e) => setMileage(e.target.value)} 
              />
            </Col>

            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>สภาพรถยนต์</p>
              <Select 
                placeholder="เลือกลักษณะรถยนต์" 
                style={{ width: '100%' }} 
                value={carCondition} 
                onChange={(value) => setCarCondition(value)}
              >
                <Option value="สวย">สวย</Option>
                <Option value="ปานกลาง">ปานกลาง</Option>
                <Option value="พอใช้">พอใช้</Option>
              </Select>
            </Col>

            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>สีรถยนต์</p>
              <Input 
                placeholder="ป้อนสีรถยนต์" 
                value={carColor} 
                onChange={(e) => setCarColor(e.target.value)}
              />
            </Col>

            <Col xs={24} md={12}>
              <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>ราคานำเข้า (บาท)</p>
              <Input 
                placeholder="ป้อนราคานำเข้า" 
                value={carPrice} 
                onChange={(e) => setCarPrice(e.target.value)}
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
              color: 'black',
              borderRadius: '5px',
              border: '1px solid #d4b434',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#d4b434';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f1d430ff';
              e.currentTarget.style.color = 'black';
            }}
            onClick={handleSaveData}
          >
            บันทึกข้อมูล
          </Button>
        </div>
    </div>
    </>
  );
};

export default EditCarTentPage;