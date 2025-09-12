import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const BuyInsurancePage: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [open, setOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
    const navigate = useNavigate();

    const [selectedInsuranceType, setSelectedInsuranceType] = useState<string | undefined>(undefined);
    const [selectedRepairType, setSelectedRepairType] = useState<string | undefined>(undefined);
    const [contractNumber, setContractNumber] = useState<string>('');
    
    // เพิ่ม state สำหรับตรวจสอบว่าได้กดปุ่ม "เลือกแผนนี้" แล้วหรือยัง
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

    // เพิ่มตัวแปรสำหรับเก็บข้อมูลประกันที่เลือก
    const [selectedInsuranceDetails] = useState(insuranceDetail[0]);
    const [selectedSalecontract] = useState(SaleContracts[0]);
    const [selectedCar] = useState(car[0]);
    const [selectedInsuranceCard] = useState(InsuranceCardProp[0]);

    const onClose = () => {
        setOpen(false);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    // ปรับปรุงฟังก์ชัน handleSelectPlan
    const handleSelectPlan = () => {
        // ตั้งค่าให้แสดงว่าได้กดปุ่มแล้ว
        setHasTriedSubmit(true);
        
        console.log('คลิกเลือกแผนนี้');
        console.log('หมายเลขรายการที่กรอก:', contractNumber);
        console.log('หมายเลขหลังจาก trim:', contractNumber.trim());
        console.log('ว่างเปล่าหรือไม่:', !contractNumber.trim());

        // ตรวจสอบว่ากรอกหมายเลขรายการหรือยัง
        if (!contractNumber || !contractNumber.trim()) {
            console.log('แสดง warning modal - ยังไม่ได้กรอกหมายเลข');
            Modal.warning({
                centered: true,
                maskClosable: true,
                onOk: () => {
                    console.log('ปิด warning modal แล้ว');
                },
            });
            return; // หยุดการทำงาน ไม่เปิด buy modal
        }
        
        // ถ้ากรอกหมายเลขแล้ว ให้เปิด buy modal เลย
        console.log('กรอกหมายเลขแล้ว - เปิด buy modal');
        setIsBuyModalVisible(true);
    };

    const handleBuyModalClose = () => {
        setIsBuyModalVisible(false);
    };

    const handleConfirmBuy = () => {
        message.success('การซื้อประกันสำเร็จ!');
        setIsBuyModalVisible(false);
    };

    const InsuranceCard: React.FC<InsuranceCardProps> = ({ planName, price, features, repairType, onSelectPlan }) => {
        return (
            <div style={{
                background: '#262626',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                marginBottom: '20px',
                border: '1px solid #ddd',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 'auto',
                minHeight: '250px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left' }}>
                        <SmileOutlined style={{ fontSize: '30px', color: '#f1d430ff', marginRight: '5px' }} />
                        <p style={{ color: 'white', fontWeight: 'bold', margin: 0, fontSize: '1.0em' }}>{planName}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'b', fontSize: '0.9em', margin: 0 }}>{repairType}</p>
                        <h2 style={{ color: '#f1d430ff', fontSize: '2em', margin: '0' }}>{price}</h2>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: 'auto',
                    marginBottom: '20px',
                    width: '100%',
                    textAlign: 'right'
                }}>
                    {features.map((feature, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'gray', fontSize: '0.9em' }}>
                            <CheckCircleOutlined style={{ color: '#f1d430ff' }} />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                <Space size="small" style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '5px 0'
                }}>
                    <Button
                        onClick={showModal}
                        style={{
                            width: '90px',
                            background: '#262626',
                            color: 'white',
                            borderRadius: '5px',
                            border: '1px solid #d4b434',
                            transition: 'background-color 0.3s, color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f7efc7ff';
                            e.currentTarget.style.color = '#262626';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#262626';
                            e.currentTarget.style.color = 'white';
                        }}
                    >
                        รายละเอียด
                    </Button>
                    <Button
                        onClick={onSelectPlan}
                        style={{
                            width: '90px',
                            background: '#f1d430ff',
                            color: 'black',
                            borderRadius: '5px',
                            border: '1px solid #d4b434',
                            transition: 'background-color 0.3s, color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f7efc7ff';
                            e.currentTarget.style.color = 'black';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1d430ff';
                            e.currentTarget.style.color = 'black';
                        }}
                    >
                        เลือกแผนนี้
                    </Button>
                </Space>
            </div>
        );
    };

    const handleMenuClick = (e: MenuInfo) => {
        const selectedItem = drawerMenuItems.find(item => item.key === e.key);
        if (selectedItem && selectedItem.path) {
            navigate(selectedItem.path);
            onClose();
        }
    };

    return (
        <>

            <Drawer
                title="เมนู"
                onClose={onClose}
                open={open}
                placement="right"
                style={{ background: '#262626' }}
            >
                <Menu
                    mode="vertical"
                    style={{ background: '#262626' }}
                    onClick={handleMenuClick}
                    items={drawerMenuItems}
                />
            </Drawer>
            <Content style={{ padding: '0 48px', display: 'flex', justifyContent: 'center' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 1080,
                        borderRadius: borderRadiusLG,
                        width: '100%',
                        maxWidth: '1200px',
                        padding: '24px',
                    }}
                >
                    <Row gutter={[16, 16]} style={{ width: '100%', maxWidth: '1000px', marginBottom: '20px' }}>
                        <Col xs={24} sm={8}>
                            <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>แผนประกัน</p>
                            <Select
                                value={selectedInsuranceType}
                                style={{ width: '100%' }}
                                onChange={(value) => setSelectedInsuranceType(value)}
                                options={insuranceTypeItems}
                                placeholder="เลือกแผนประกัน"
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>ประเภทการซ่อม</p>
                            <Select
                                value={selectedRepairType}
                                style={{ width: '100%' }}
                                onChange={(value) => setSelectedRepairType(value)}
                                options={repairTypeItems}
                                placeholder="เลือกประเภทการซ่อม"
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <p style={{ color: 'black', fontSize: '1.0em', marginBottom: '5px' }}>
                                หมายเลขรายการซื้อรถยนต์ <span style={{ color: 'yellow' }}>*</span>
                            </p>
                            <Input
                                value={contractNumber}
                                onChange={(e) => {
                                    console.log('กำลังพิมพ์หมายเลขรายการ:', e.target.value);
                                    setContractNumber(e.target.value);
                                }}
                                placeholder="กรอกหมายเลขของคุณ"
                                style={{ 
                                    width: '100%',
                                    // แสดงกรอบสีแดงเฉพาะเมื่อได้กดปุ่มแล้วและ input ว่าง
                                    borderColor: (hasTriedSubmit && !contractNumber.trim()) ? '#ff4d4f' : '#d9d9d9'
                                }}
                                // แสดง error status เฉพาะเมื่อได้กดปุ่มแล้วและ input ว่าง
                                status={(hasTriedSubmit && !contractNumber.trim()) ? 'error' : ''}
                            />
                            {/* แสดงข้อความ error เฉพาะเมื่อได้กดปุ่มแล้วและ input ว่าง */}
                            {hasTriedSubmit && !contractNumber.trim() && (
                                <small style={{ color: '#ff4d4f', fontSize: '12px' }}>
                                    จำเป็นต้องกรอกหมายเลขรายการ
                                </small>
                            )}
                        </Col>
                    </Row>

                    <p style={{ width: '100%', maxWidth: '1000px', textAlign: 'left', color: 'gray', marginBottom: '30px', fontWeight: 'bold' }}>
                        Brand รุ่นรถยนต์ ปีผลิต &gt; รายละเอียดรุ่น
                    </p>

                    <Row gutter={[30, 30]} justify="center" style={{ width: '100%', maxWidth: '1200px' }}>
                        {[...Array(6)].map((_, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                                <InsuranceCard
                                    planName="รู้หมดประกันภัย"
                                    repairType="ชั้น 1 | ซ่อมอู่"
                                    price="6,399"
                                    features={['คุ้มครองน้ำท่วม', 'ไม่ระบุชื่อ']}
                                    onSelectPlan={handleSelectPlan}
                                />
                            </Col>
                        ))}
                    </Row>

                    <div style={{ width: '100%', maxWidth: '1000px', textAlign: 'left', marginTop: '40px', padding: '20px', background: '#000000', borderRadius: '8px' }}>
                        <h3 style={{ color: 'white', marginBottom: '10px' }}>ข้อกำหนดและเงื่อนไข</h3>
                        <p style={{ color: 'white', fontSize: '0.9em', lineHeight: '1.5' }}>
                            เบี้ยประกันและทุนประกันของบริการอิเล็กทรอนิกส์, งานซ่อมและลักษณะการใช้งาน
                        </p>
                    </div>
                </div>
            </Content>

            <Modal
                title={<span style={{ color: '#f1d430ff', fontWeight: 'bold' }}>รายละเอียดประกันภัย</span>}
                open={isModalVisible}
                onOk={handleModalClose}
                onCancel={handleModalClose}
                styles={{ 
                    body: { 
                        backgroundColor: '#000000' 
                    },
                    header: {
                        backgroundColor: '#000000',
                        borderBottom: '1px solid #000000'
                    },
                    footer: {
                        backgroundColor: '#000000',
                        borderTop: '1px solid #000000'
                    },
                    content: {
                        backgroundColor: '#000000',
                        border: '2px solid #f1d430ff',
                        borderRadius: '8px'
                    }
                }}
                footer={[
                    <Button
                        style={{
                            backgroundColor: '#f1d430ff',
                            color: '#000000',
                            borderRadius: '5px',
                            border: '1px solid #f1d430ff',
                            transition: 'background-color 0.3s, color 0.3s',
                            fontWeight: 'bold'
                        }}
                        onMouseEnter={(e) => { 
                            e.currentTarget.style.backgroundColor = '#383836ff';
                            e.currentTarget.style.color = '#000000';
                        }}
                        onMouseLeave={(e) => { 
                            e.currentTarget.style.backgroundColor = '#f1d430ff';
                            e.currentTarget.style.color = '#000000';
                        }}
                        key="back" onClick={handleModalClose}>
                        ปิด
                    </Button>
                ]}
            >
                <div style={{ color: 'white' }}>
                    <p>{selectedInsuranceDetails.description}</p>
                    <h4 style={{ marginTop: '20px', color: '#f1d430ff', fontWeight: 'bold' }}>ความคุ้มครอง:</h4>
                    <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                        {selectedInsuranceDetails.features.map((feature, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>{feature}</li>
                        ))}
                    </ul>
                </div>
            </Modal>

            <Modal
                title={<span style={{ color: '#f1d430ff' }}>สรุปข้อมูลการซื้อประกัน</span>}
                open={isBuyModalVisible}
                onCancel={handleBuyModalClose}
                width={600}
                centered
                styles={{ 
                    body: { 
                        backgroundColor: '#000000' 
                    },
                    header: {
                        backgroundColor: '#000000',
                        borderBottom: '1px solid #000000'
                    },
                    footer: {
                        backgroundColor: '#000000',
                        borderTop: '1px solid #000000'
                    },
                    content: {
                        backgroundColor: '#000000',
                        border: '2px solid #f1d430ff',
                        borderRadius: '8px'
                    }
                }}
                footer={[
                    <Button 
                        key="back" 
                        onClick={handleBuyModalClose}
                        style={{
                            backgroundColor: '#000000',
                            color: '#f1d430ff',
                            border: '1px solid #f1d430ff',
                            borderRadius: '5px'
                        }}
                        onMouseEnter={(e) => { 
                            e.currentTarget.style.backgroundColor = '#333'; 
                        }}
                        onMouseLeave={(e) => { 
                            e.currentTarget.style.backgroundColor = '#000000'; 
                        }}
                    >
                        ยกเลิก
                    </Button>,
                    <Button 
                        key="submit" 
                        onClick={handleConfirmBuy}
                        style={{
                            backgroundColor: '#f1d430ff',
                            color: '#000000',
                            border: '1px solid #f1d430ff',
                            borderRadius: '5px',
                            fontWeight: 'bold'
                        }}
                        onMouseEnter={(e) => { 
                            e.currentTarget.style.backgroundColor = '#383836ff';
                            e.currentTarget.style.color = '#000000';
                        }}
                        onMouseLeave={(e) => { 
                            e.currentTarget.style.backgroundColor = '#f1d430ff';
                            e.currentTarget.style.color = '#fdfafaff';
                        }}
                    >
                        ยืนยันซื้อประกัน
                    </Button>,
                ]}
            >
                <div style={{ color: 'white' }}>
                    
                    <h4 style={{ marginTop: '15px', color: '#f1d430ff' }}>ข้อมูลลูกค้า</h4>
                    <p>ชื่อ-นามสกุล: {selectedSalecontract.customer_id?.first_name} {selectedSalecontract.customer_id?.last_name} </p>
                    <p>หมายเลขรายการซื้อรถยนต์: <strong style={{ color: '#f1d430ff' }}>{contractNumber}</strong></p>

                    <h4 style={{ marginTop: '15px', color: '#f1d430ff' }}>รายละเอียดรถ</h4>
                    <p>ยี่ห้อ: {selectedCar?.brand}</p>
                    <p>รุ่น: {selectedCar?.model}</p>
                    <p>ปี: {selectedCar?.yearManufactured}</p>

                    <h4 style={{ marginTop: '15px', color: '#f1d430ff' }}>รายละเอียดประกัน</h4>
                    <p>ชื่อแผน: {selectedInsuranceCard.planName}</p>
                    <p>ประเภทการซ่อม: {selectedInsuranceCard.repairType}</p>
                    <p>ราคา: <strong style={{ color: '#f1d430ff', fontSize: '18px' }}>{selectedInsuranceCard.price} บาท</strong></p>
                </div>
            </Modal>
        </>
    );
};

export default BuyInsurancePage;