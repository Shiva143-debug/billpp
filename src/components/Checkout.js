import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { productAPI, checkoutAPI } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import '../styles/Checkout.css';

const Checkout = () => {
    const { userId } = useAuth();
    const [checkshow, setcheckoutshow] = useState(true);
    const [upishow, setupishow] = useState(false);
    const [cashshow, setcashshow] = useState(false);
    const [isplayclick, setpay] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { orderDetails } = location.state || {};
    const [showPayButton, setShowPayButton] = useState(true);
    const [TotalAmount, setGrandTotal] = useState(0);
    const uniqueId = (Math.floor(Math.random() * 9999) + 1).toString().padStart(4, '0');
    const isMobile = useMediaQuery('(max-width:768px)');
    const [inputs, setInputs] = useState([
        { denomination: '2000 Notes', value: '' },
        { denomination: '500 Notes', value: '' },
        { denomination: '200 Notes', value: '' },
        { denomination: '100 Notes', value: '' },
        { denomination: '50 Notes', value: '' },
        { denomination: '20 Notes', value: '' },
        { denomination: '10 Notes', value: '' },
        { denomination: '5 Rupees', value: '' },
        { denomination: '2 Rupees', value: '' },
        { denomination: '1 Rupees', value: '' },
    ]);


    const calculateAmount = (denomination, value) => {
        switch (denomination) {
            case '1 Rupees':
                return value * 1;
            case '2 Rupees':
                return value * 2;
            case '5 Rupees':
                return value * 5;
            case '10 Notes':
                return value * 10;
            case '20 Notes':
                return value * 20;
            case '50 Notes':
                return value * 50;

            case '100 Notes':
                return value * 100;
            case '200 Notes':
                return value * 200;
            case '500 Notes':
                return value * 500;
            case '2000 Notes':
                return value * 2000;
            default:
                return 0;
        }

    };

    useEffect(() => {
        let total = 0;
        inputs.forEach(input => {
            total += calculateAmount(input.denomination, input.value);
        });
        setGrandTotal(total);
    }, [inputs]);

    console.log(orderDetails)

    if (!orderDetails || orderDetails.grandTotal === 0) {
        return <div style={{ textAlign: "center", fontSize: "50px" }}>No order details found</div>;
    }

    const { selectedOption, address, contactNo, grandTotal, items, date } = orderDetails;


    const handlePrint = async () => {
        setIsLoading(true);

        try {
            window.print();

            const exportData = items.map(item => ({ selectedOption, date, productName: item.product_name, price: item.price, quantity: item.quantity, total_amount: item.total_amount, }));
            const itemsArray = exportData
            const response = await checkoutAPI.exportToSales(userId, itemsArray);
            console.log(response.data.message);

            await resetDataAndGrandTotal();
            navigate("/home");
        } catch (error) {
            console.error('Error exporting to sales:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const resetDataAndGrandTotal = async () => {
        try {
            await checkoutAPI.deleteItems(selectedOption, userId);
            console.log('Items deleted successfully');
        } catch (error) {
            console.error('Failed to delete items:', error);
        }
    }


    const onBack = () => {
        orderDetails.items.forEach((item) => {
            const adddedValues = { productName: item.product_name, quantity: item.quantity };
            try {
                productAPI.addProductQuantity(userId, adddedValues);
                navigate("/home");
            } catch (err) {
                console.log(err)
            }
        });

    }

    const onPay = () => {
        setpay(true)
    }
    const oncash = () => {
        setupishow(false)
        setcheckoutshow(false)
        setcashshow(true)
    }

    const onUpi = () => {
        setupishow(true)
        setcheckoutshow(false)
        setcashshow(false)
    }


    const paymentCompleted = async () => {
        setIsLoading(true);

        try {
            const paymentData = { selectedOption, date, paymentType: "upi_pay", grandTotal };
            const response = await checkoutAPI.processPayment(userId, paymentData);
            console.log(response.data.message);
            setupishow(false);
            setcheckoutshow(true);
            setcashshow(false);
            setShowPayButton(false);
        } catch (error) {
            console.error('Error making payment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const cashpaymentCompleted = async () => {
        setIsLoading(true);

        try {
            const cashData = {
                userId, selectedOption, date, grandTotal,
                denominations: {
                    '2000notes': inputs.find(input => input.denomination === '2000 Notes').value || 0,
                    '500notes': inputs.find(input => input.denomination === '500 Notes').value || 0,
                    '200notes': inputs.find(input => input.denomination === '200 Notes').value || 0,
                    '100notes': inputs.find(input => input.denomination === '100 Notes').value || 0,
                    '50notes': inputs.find(input => input.denomination === '50 Notes').value || 0,
                    '20notes': inputs.find(input => input.denomination === '20 Notes').value || 0,
                    '10notes': inputs.find(input => input.denomination === '10 Notes').value || 0,
                    '5rupees': inputs.find(input => input.denomination === '5 Rupees').value || 0,
                    '2rupees': inputs.find(input => input.denomination === '2 Rupees').value || 0,
                    '1rupees': inputs.find(input => input.denomination === '1 Rupees').value || 0
                }
            };

            await checkoutAPI.processCashPayment(userId, cashData);

            const paymentData = { userId, selectedOption, date, paymentType: "cash_pay", grandTotal };
            await checkoutAPI.processPayment(userId, paymentData);

            setupishow(false);
            setcheckoutshow(true);
            setcashshow(false);
            setShowPayButton(false);
        } catch (error) {
            console.error('Error completing cash payment:', error);
        } finally {
            setIsLoading(false);
        }
    }
    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index].value = value;
        setInputs(newInputs);
    };

    const remainingBalance = grandTotal - inputs.reduce((acc, curr) => acc + calculateAmount(curr.denomination, curr.value), 0);

    return (
        <div className="checkout-container">

            {/* <Header className="no-print" /> */}

            {isLoading && (
                <div className="spinner-container">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
                </div>
            )}
            {checkshow && (
                <Card className="checkout-card">
                    <style>
                        {`
                            @media print {
                                .no-print {
                                    display: none !important;
                                }
                            }
                        `}
                    </style>

                    <div className="invoice-header">
                        <div className="company-logo">
                            <img src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1704974380/comapnylogo_gh2jvq.jpg" alt="Company Logo" />
                            <div>
                                {!isMobile && <h2 className="company-name">WhereSoftTechnologies</h2>}
                                {isMobile && <h6 className="company-name">WhereSoftTechnologies</h6>}
                                <p><strong>Address:</strong> pragathinagar</p>
                            </div>
                        </div>
                        {!showPayButton && (
                            <Button label="Export / Print" icon="pi pi-print" className="p-button-success no-print" onClick={handlePrint} />
                        )}
                    </div>

                    <h2 className="checkout-heading">INVOICE #{uniqueId}</h2>

                    <div className="invoice-details">
                        <div className="customer-details">
                            <p><strong>Name:</strong> {selectedOption}</p>
                            <p><strong>Address:</strong> {address}</p>
                            <p><strong>Contact No:</strong> {contactNo}</p>
                        </div>
                        <div className="invoice-date">
                            <p><strong>Date:</strong> {date}</p>
                        </div>
                    </div>

                    <DataTable value={items} className="invoice-table" responsiveLayout="scroll" stripedRows >
                        <Column field="product_name" header="Product Name" />
                        <Column field="price" header="Price" />
                        <Column field="quantity" header="Quantity" />
                        <Column field="total_amount" header="Total Amount" />
                    </DataTable>

                    <div className="grand-total">
                        <strong>Grand Total:</strong> {grandTotal}
                    </div>

                    {showPayButton && (
                        <div className="payment-options no-print">
                            <Button label="Back" icon="pi pi-arrow-left" className="p-button-info" onClick={onBack} disabled={isLoading} />

                            {!isplayclick ? (
                                <Button label="Pay" icon="pi pi-credit-card" className="p-button-primary" onClick={onPay} disabled={isLoading} />
                            ) : (
                                <div className="payment-methods">
                                    <Button label="Pay Cash" icon="pi pi-money-bill" className="p-button-info" onClick={oncash} disabled={isLoading} />
                                    <Button label="UPI Pay" icon="pi pi-mobile" className="p-button-info" onClick={onUpi} disabled={isLoading} style={{ marginLeft: '1rem' }} />
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            )}

            {upishow && (
                <Card className="checkout-card qr-container">
                    <h2 className="checkout-heading">Scan QR Code to Pay</h2>
                    <QRCode value={"shiva"} size={isMobile ? 300 : 400} className="qr-code" />
                    <div className="action-buttons">
                        <Button label="Back" icon="pi pi-arrow-left" className="p-button-info" onClick={onBack} disabled={isLoading} />
                        <Button label="Payment Completed" icon="pi pi-check" className="p-button-success" onClick={paymentCompleted} disabled={isLoading} />
                    </div>
                </Card>
            )}

            {cashshow && (
                <Card className="checkout-card">
                    <h2 className="checkout-heading">Cash Payment</h2>
                    <h3>Total Amount to Pay: {grandTotal}</h3>

                    <DataTable value={inputs} className="denomination-table" responsiveLayout="scroll" stripedRows>
                        <Column field="denomination" header="Denomination" />
                        <Column header="Input" body={(rowData, rowIndex) => (
                            <InputNumber value={rowData.value} onValueChange={(e) => handleInputChange(rowIndex.rowIndex, e.value)} className="denomination-input" />
                        )} />
                        <Column header="Amount" body={(rowData) => calculateAmount(rowData.denomination, rowData.value)} />
                    </DataTable>

                    <div className="grand-total">
                        <strong>Grand Total:</strong> {TotalAmount}
                    </div>

                    <div className="remaining-balance">
                        <p>
                            <strong>Remaining Balance to Pay:</strong> {remainingBalance >= 0 ? remainingBalance : 0}
                        </p>
                        {remainingBalance < 0 && (
                            <p className="balance-warning">Amount paid exceeds the total amount.</p>
                        )}
                    </div>

                    <div className="action-buttons">
                        <Button label="Back" icon="pi pi-arrow-left" className="p-button-info" onClick={onBack} disabled={isLoading} />

                        {remainingBalance === 0 && (
                            <Button label="Cash Payment Completed" icon="pi pi-check" className="p-button-success" onClick={cashpaymentCompleted} disabled={isLoading} />
                        )}
                    </div>
                </Card>
            )}


        </div>
    );
};

export default Checkout;
