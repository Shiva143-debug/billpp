
import React, { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { useAuth } from '../context/AuthContext';
import Header from "./Header";
import "../styles/Reports.css";
import { customerAPI, productAPI, reportsAPI } from "../services/apiService";

const Reports = () => {
    const { userId } = useAuth();
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [reportType, setReportType] = useState("Date");
    const [selectedOption, setSelectedOption] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [paymentTypeData, setPaymentTypeData] = useState([]);
    const [cashReportData, setCashReportData] = useState([]);
    const [date, setDate] = useState(null);
    const [cashDate, setCashDate] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [grandTotal, setGrandTotal] = useState(0);


    const tabItems = [
        { label: 'By Date', icon: 'pi pi-calendar' },
        { label: 'By Customer', icon: 'pi pi-user' },
        { label: 'By Product', icon: 'pi pi-shopping-bag' },
        { label: 'By Payment Type', icon: 'pi pi-credit-card' },
        { label: 'Cash Report', icon: 'pi pi-money-bill' }
    ];

    const paymentOptions = [
        { label: 'UPI Payment', value: 'upi_pay' },
        { label: 'Cash Payment', value: 'cash_pay' }
    ];

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await customerAPI.getCustomers(userId);
                const data = response.data;

                if (Array.isArray(data)) {
                    const formattedCustomers = data.map(customer => ({
                        label: customer.name,
                        value: customer.name
                    }));
                    setCustomers(formattedCustomers);
                } else {
                    setCustomers([]);
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
                setCustomers([]);
            }
        };

        if (userId) {
            fetchCustomers();
        }
    }, [userId]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productAPI.getProducts(userId); // Axios call
                const data = response.data;

                if (Array.isArray(data)) {
                    const formattedProducts = data.map(product => ({
                        label: product.product_name,
                        value: product.product_name
                    }));
                    setProducts(formattedProducts);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchProducts();
        }
    }, [userId]);

    useEffect(() => {
        const fetchReportData = async () => {
            setIsLoading(true);

            try {
                let response;

                switch (reportType) {
                    case 'Date':
                        if (date) {
                            const formattedDate = formatDate(date);
                            response = await reportsAPI.getReportsByDate(formattedDate, userId)
                            const data = response.data
                            console.log("Date Response", data)
                            setReportData(data);
                            calculateGrandTotal(data);
                        }
                        break;

                    case 'Customer':
                        if (selectedOption) {
                            response = await reportsAPI.getReportsByName(selectedOption, userId)
                            const data = response.data
                            console.log("Date Response", data)
                            setReportData(data);
                            calculateGrandTotal(data);
                        }
                        break;

                    case 'Product':
                        if (selectedOption) {
                            response = await reportsAPI.getReportsByProductName(selectedOption, userId)
                            const data = response.data
                            console.log("Date Response", data)
                            setReportData(data);
                            calculateGrandTotal(data);
                        }
                        break;

                    case 'Payment':
                        if (paymentType) {
                            response = await reportsAPI.getReportsByPaymentType(paymentType, userId)
                            const data = response.data
                            console.log("Date Response", data)
                            setPaymentTypeData(data);
                        }
                        break;

                    case 'Cash':
                        if (cashDate) {
                            const formattedDate = formatDate(cashDate);
                            response = await reportsAPI.getCashReportByDate(formattedDate, userId)
                            const data = response.data
                            console.log("Date Response", data)
                            setCashReportData(data);
                        }
                        break;

                    default:
                        break;
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (date || selectedOption || paymentType || cashDate) {
            fetchReportData();
        }
    }, [reportType, date, selectedOption, paymentType, cashDate, userId]);

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const calculateGrandTotal = (data) => {
        if (!Array.isArray(data)) return;

        const total = data.reduce((acc, item) => {
            return acc + (parseFloat(item.total_amount) || 0);
        }, 0);

        setGrandTotal(total);
    };

    const handleTabChange = (e) => {
        setActiveTabIndex(e.index);

        // Reset all filters
        setDate(null);
        setSelectedOption(null);
        setPaymentType(null);
        setCashDate(null);
        setReportData([]);
        setPaymentTypeData([]);
        setCashReportData([]);

        switch (e.index) {
            case 0:
                setReportType('Date');
                break;
            case 1:
                setReportType('Customer');
                break;
            case 2:
                setReportType('Product');
                break;
            case 3:
                setReportType('Payment');
                break;
            case 4:
                setReportType('Cash');
                break;
            default:
                setReportType('Date');
        }
    };

    const filterData = (data, searchTerm) => {
        if (!searchTerm || !Array.isArray(data)) return data;

        return data.filter(item => {
            return (
                (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.date && new Date(item.date).toLocaleDateString().includes(searchTerm))
            );
        });
    };

    const dateTemplate = (rowData) => {
        return new Date(rowData.date).toLocaleDateString();
    };

    const renderReportContent = () => {
        if (isLoading) {
            return (
                <div className="loading-container">
                    <img src="https://res.cloudinary.com/dxgbxchqm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1716964033/large_xjsnwr.png" alt="Loading" className="loading-image" />
                    <h3 className="loading-text">Loading Report Data...</h3>
                </div>
            );
        }

        switch (reportType) {
            case 'Date':
                return renderDateReport();
            case 'Customer':
                return renderCustomerReport();
            case 'Product':
                return renderProductReport();
            case 'Payment':
                return renderPaymentReport();
            case 'Cash':
                return renderCashReport();
            default:
                return null;
        }
    };

    const renderDateReport = () => {
        return (
            <>
                <div className="filter-container">
                    <label className="filter-label">Select Date:</label>
                    <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="yy-mm-dd" className="filter-input" showIcon />
                </div>

                {date && renderReportTable()}
            </>
        );
    };

    const renderCustomerReport = () => {
        return (
            <>
                <div className="filter-container">
                    <label className="filter-label">Select Customer Name:</label>
                    <Dropdown value={selectedOption} options={customers} onChange={(e) => setSelectedOption(e.value)} placeholder="Select a customer" className="filter-input" />
                </div>

                {selectedOption && renderReportTable()}
            </>
        );
    };

    const renderProductReport = () => {
        return (
            <>
                <div className="filter-container">
                    <label className="filter-label">Select Product Name:</label>
                    <Dropdown value={selectedOption} options={products} onChange={(e) => setSelectedOption(e.value)} placeholder="Select a product" className="filter-input" />
                </div>

                {selectedOption && renderReportTable()}
            </>
        );
    };

    const renderPaymentReport = () => {
        return (
            <>
                <div className="filter-container">
                    <label className="filter-label">Select Payment Type:</label>
                    <Dropdown value={paymentType} options={paymentOptions} onChange={(e) => setPaymentType(e.value)} placeholder="Select payment type" className="filter-input" />
                </div>

                {paymentType && (
                    <>
                        <div className="search-container">
                            <span className="p-input-icon-left">
                                {/* <i className="pi pi-search" /> */}
                                <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="search-input" />
                            </span>
                        </div>

                        <div className="table-container">
                            <DataTable paginator rows={5} value={filterData(paymentTypeData, searchTerm)} className="reports-table" responsiveLayout="scroll" stripedRows emptyMessage="No payment records found"
                                footer={
                                    <div className="summary-container">
                                        <div className="summary-box">
                                            <span className="summary-text">Total Amount:</span>
                                            <span className="summary-value">
                                                {paymentTypeData.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                }
                            >
                                <Column field="id" header="Bill No" />
                                <Column field="name" header="Name" />
                                <Column field="date" header="Date" body={dateTemplate} />
                                <Column field="amount" header="Amount" />
                            </DataTable>
                        </div>
                    </>
                )}
            </>
        );
    };

    const renderCashReport = () => {
        return (
            <>
                <div className="filter-container">
                    <label className="filter-label">Select Date:</label>
                    <Calendar value={cashDate} onChange={(e) => setCashDate(e.value)} dateFormat="yy-mm-dd" className="filter-input" showIcon />
                </div>

                {cashDate && (
                    <div className="table-container">
                        <DataTable paginator rows={5} value={cashReportData} className="reports-table" responsiveLayout="scroll" stripedRows emptyMessage="No cash records found"
                            footer={
                                <div className="summary-container">
                                    <div className="summary-box">
                                        <span className="summary-text">Total Amount:</span>
                                        <span className="summary-value">
                                            {cashReportData.reduce((acc, item) => acc + (parseFloat(item.grand_total) || 0), 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            }
                        >
                            <Column field="name" header="Name" />
                            <Column field="twothousandnotes" header="2000 Notes" />
                            <Column field="fivehundrednotes" header="500 Notes" />
                            <Column field="twohundrednotes" header="200 Notes" />
                            <Column field="hundrednotes" header="100 Notes" />
                            <Column field="fiftynotes" header="50 Notes" />
                            <Column field="twentynotes" header="20 Notes" />
                            <Column field="tennotes" header="10 Notes" />
                            <Column field="fiverupees" header="5 Rupees" />
                            <Column field="tworupees" header="2 Rupees" />
                            <Column field="onerupees" header="1 Rupees" />
                            <Column field="grand_total" header="Grand Total" />
                        </DataTable>
                    </div>
                )}
            </>
        );
    };

    const renderReportTable = () => {
        const filteredData = filterData(reportData, searchTerm);

        return (
            <>
                <div className="search-container">
                    <span className="p-input-icon-left">
                        {/* <i className="pi pi-search" /> */}
                        <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="search-input" />
                    </span>
                </div>

                <div className="table-container">
                    <DataTable paginator rows={5} value={filteredData} className="reports-table" responsiveLayout="scroll" stripedRows emptyMessage="No records found"
                        footer={
                            <div className="summary-container">
                                <div className="summary-box">
                                    <span className="summary-text">Grand Total:</span>
                                    <span className="summary-value">{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        }
                    >
                        {reportType !== 'Date' && <Column field="date" header="Date" body={dateTemplate} />}
                        {reportType !== 'Customer' && <Column field="name" header="Name" />}
                        {reportType !== 'Product' && <Column field="product_name" header="Product Name" />}
                        <Column field="price" header="Price" />
                        <Column field="quantity" header="Quantity" />
                        <Column field="total_amount" header="Total Amount" />
                    </DataTable>
                </div>
            </>
        );
    };

    return (
        <div className="reports-container">
            <Header />
            <Card className="reports-card">
                {/* <h2 className="reports-heading">Reports</h2> */}
                
                <div className="tab-wrapper">
                    <TabMenu 
                        model={tabItems} 
                        activeIndex={activeTabIndex} 
                        onTabChange={handleTabChange} 
                        className="tab-container" 
                    />
                </div>

                {renderReportContent()}
            </Card>
        </div>
    );
};

export default Reports;
