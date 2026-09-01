import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { productAPI, checkoutAPI } from '../services/apiService';
import '../styles/Checkout.css';

const Checkout = () => {
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
    const toast = useRef(null);
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

    if (!orderDetails || orderDetails.grandTotal === 0) {
        return <div style={{ textAlign: "center", fontSize: "50px" }}>No order details found</div>;
    }

    const { selectedOption, customerName, address, contactNo, grandTotal, items, date } = orderDetails;

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return String(dateString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const getFileNameDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return String(dateString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const formatCurrency = (value) => {
        const num = Number(String(value ?? 0).replace(/[^0-9.-]/g, ''));
        return `₹${(isNaN(num) ? 0 : num).toLocaleString('en-IN')}`;
    };

    const handlePrint = async () => {
        setIsLoading(true);

        try {
            const previousTitle = document.title;
            const safeCustomer = (selectedOption || 'customer')
                .replace(/[^a-zA-Z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') || 'customer';
            const printTitle = `${safeCustomer}-${getFileNameDate(date)}-Invoice`;

            document.title = printTitle;
            window.addEventListener('afterprint', () => {
                document.title = previousTitle;
            }, { once: true });
            window.print();
            setTimeout(() => {
                if (document.title === printTitle) {
                    document.title = previousTitle;
                }
            }, 10000);

            const exportData = items.map(item => ({ customerId: selectedOption, date, productId: item.productId, price: item.price, quantity: item.quantity, totalAmount: item.totalAmount, }));
            const itemsArray = exportData
            const response = await checkoutAPI.exportToSales(itemsArray);
            console.log(response.message);
            if (response.success) {
                await resetDataAndGrandTotal();
                navigate("/home");
            } else {
                console.error('Export to sales failed:', response.message);
            }
        } catch (error) {
            console.error('Error exporting to sales:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const resetDataAndGrandTotal = async () => {
        try {
            const response = await checkoutAPI.deleteItems(selectedOption);
            if (response.success) {
                console.log('Items deleted successfully:', response.message);
            } else {
                console.log('Failed to delete items:', response.message);
            }
        } catch (error) {
            console.error('Failed to delete items:', error);
        }
    }


    const onBack = () => {
        orderDetails.items.forEach((item) => {
            const adddedValues = { productId: item.productId, quantity: item.quantity };
            try {
                productAPI.addProductQuantity(adddedValues);
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
            const paymentData = { customerId: selectedOption, date, paymentType: "upi_pay", grandTotal };
            const response = await checkoutAPI.processPayment(paymentData);
            if (!response.success) {
                throw new Error(response.message);
            }
            setupishow(false);
            setcheckoutshow(true);
            setcashshow(false);
            setShowPayButton(false);
        } catch (error) {
            console.error('Error making payment:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to process payment. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const cashpaymentCompleted = async () => {
        setIsLoading(true);

        try {
            const cashData = {
                customerId: selectedOption, date, grandTotal,
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

            const cashResponse = await checkoutAPI.processCashPayment(cashData);
            if (!cashResponse.success) {
                throw new Error(cashResponse.message);
            }

            const paymentData = { customerId: selectedOption, date, paymentType: "cash_pay", grandTotal };
            const paymentResponse = await checkoutAPI.processPayment(paymentData);
            if (!paymentResponse.success) {
                throw new Error(paymentResponse.message);
            }

            setupishow(false);
            setcheckoutshow(true);
            setcashshow(false);
            setShowPayButton(false);
        } catch (error) {
            console.error('Error completing cash payment:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to complete cash payment. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    }
    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index].value = value;
        setInputs(newInputs);
    };

    const remainingBalance = parseInt(grandTotal - inputs.reduce((acc, curr) => acc + calculateAmount(curr.denomination, curr.value), 0));

    return (
        <div className="checkout-container">
            <Toast ref={toast} />
            {isLoading && (
                <div className="spinner-container">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
                </div>
            )}
            {checkshow && (
                <div className="checkout-sheet">
                    <div className="sheet-header">
                        <div className="invoice-brand">
                            <div className="brand-badge">BP</div>
                            <div className="brand-meta">
                                {!isMobile && <h2 className="company-name">BillPro</h2>}
                                {isMobile && <h6 className="company-name">BillPro</h6>}
                                <p className="brand-tagline">Official Sales Receipt</p>
                            </div>
                        </div>
                        <div className="sheet-meta">
                            <span className="meta-label">Invoice No: {uniqueId}</span>
                            <span className="meta-label">Date: {formatDisplayDate(date)}</span>
                        </div>
                        {!showPayButton && (
                            <Button label="Export / Print" icon="pi pi-print" className="export-btn no-print" onClick={handlePrint} />
                        )}
                    </div>

                    <div className="checkout-body">
                        <div className="checkout-left">

                            <div className="section-card">
                                <h3 className="section-title">Customer Details</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Name</span>
                                    <span className="detail-value">{customerName || selectedOption}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Address</span>
                                    <span className="detail-value">{address}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Contact</span>
                                    <span className="detail-value">{contactNo}</span>
                                </div>
                            </div>
                        </div>

                        <div className="checkout-divider" />

                        <div className="checkout-right">
                            <h3 className="section-title">Purchased Products</h3>
                            <DataTable value={items} className="invoice-table" responsiveLayout="scroll" stripedRows scrollable scrollHeight="320px">
                                <Column field="productName" header="Product" />
                                <Column field="price" header="Price" />
                                <Column field="quantity" header="Qty" />
                                <Column field="totalAmount" header="Total" />
                            </DataTable>

                            <div className="total-box">
                                <div className="total-line">
                                    <span className="total-label">Number of Items:{items.length}</span>
                                    {/* <span className="total-value">{items.length}</span> */}
                                </div>
                                <div className="total-line total-main">
                                    <span className="total-label">Grand Total</span>
                                    <span className="total-value">{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showPayButton && (
                        <div className="payment-options no-print">
                            <Button label="Back" icon="pi pi-arrow-left" className="back-btn" onClick={onBack} disabled={isLoading} />

                            {!isplayclick ? (
                                <Button label="Proceed to Pay" icon="pi pi-credit-card" className="pay-btn" onClick={onPay} disabled={isLoading} />
                            ) : (
                                <div className="payment-methods">
                                    <Button label="Cash" icon="pi pi-money-bill" className="cash-btn" onClick={oncash} disabled={isLoading} />
                                    <Button label="UPI" icon="pi pi-mobile" className="upi-btn" onClick={onUpi} disabled={isLoading} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {upishow && (
                <Card className="checkout-card qr-container">
                    <div className="screen-header">
                        <h2 className="screen-title">Scan QR Code to Pay</h2>
                        <div className="amount-due">{formatCurrency(parseInt(grandTotal))}</div>
                    </div>
                    <div className="qr-frame">
                        <QRCode value={"shiva"} size={isMobile ? 220 : 280} className="qr-code" />
                    </div>
                    <div className="action-buttons no-print">
                        <Button label="Back" icon="pi pi-arrow-left" className="back-btn" onClick={onBack} disabled={isLoading} />
                        <Button label="Done" icon="pi pi-check" className="pay-btn" onClick={paymentCompleted} disabled={isLoading} />
                    </div>
                </Card>
            )}

            {cashshow && (
                <Card className="checkout-card cash-card">
                    <div className="cash-header">
                        <div className="cash-header-left">
                            <Button label="" icon="pi pi-arrow-left" className="cash-back-btn no-print" onClick={onBack} disabled={isLoading} />
                            <h2 className="screen-title">Cash Payment</h2>
                        </div>
                        <div className="amount-due">{formatCurrency(parseInt(grandTotal))}</div>
                    </div>

                    <div className="denomination-grid">
                        {inputs.map((input, index) => (
                            <div className="denomination-item" key={input.denomination}>
                                <span className="denomination-name">{input.denomination}</span>
                                <div className="denomination-input-wrap">
                                    <InputNumber
                                        value={input.value}
                                        onValueChange={(e) => handleInputChange(index, e.value)}
                                        className="denomination-input"
                                        min={0}
                                    />
                                </div>
                                <span className="denomination-amount">
                                    {formatCurrency(calculateAmount(input.denomination, input.value))}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="cash-summary">
                        <div className="total-line">
                            <span className="total-label">Cash Received</span>
                            <span className="total-value">{formatCurrency(TotalAmount)}</span>
                        </div>
                        <hr className="cash-summary-divider" />
                        <div className="total-line">
                            <span className="total-label">Remaining Balance</span>
                            <span className="total-value">{formatCurrency(remainingBalance >= 0 ? remainingBalance : 0)}</span>
                        </div>
                        {remainingBalance < 0 && (
                            <p className="balance-warning">Amount paid exceeds the total amount.</p>
                        )}
                    </div>

                    <div className="action-buttons no-print">
                        {remainingBalance === 0 && (
                            <Button label="Complete Cash Payment" icon="pi pi-check" className="pay-btn" onClick={cashpaymentCompleted} disabled={isLoading} />
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Checkout;
