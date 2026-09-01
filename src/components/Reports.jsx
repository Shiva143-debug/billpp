
import { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import Header from "./Header";
import { customerAPI, productAPI, reportsAPI } from "../services/apiService";
import "../styles/Reports.css";

const Reports = () => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [reportType, setReportType] = useState("Date");
    const [selectedOption, setSelectedOption] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [cashReportData, setCashReportData] = useState([]);
    const [recentPurchases, setRecentPurchases] = useState([]);
    const [date, setDate] = useState(null);
    const [cashDate, setCashDate] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const tabItems = [
        { label: 'By Purchase Date', icon: 'pi pi-calendar' },
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
                const response = await customerAPI.getCustomers();

                if (response.success && Array.isArray(response.data)) {
                    const formattedCustomers = response.data.map(customer => ({
                        label: customer.name,
                        value: customer.customerId
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

        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productAPI.getProducts();

                if (response.success && Array.isArray(response.data)) {
                    const formattedProducts = response.data.map(product => ({
                        label: product.productName,
                        value: product.id
                    }));
                    setProducts(formattedProducts);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    // Fetch recent purchases on initial load
    useEffect(() => {
        const fetchRecentPurchases = async () => {
            setIsLoading(true);
            try {
                const response = await reportsAPI.getRecentReports();
                if (response.success && Array.isArray(response.data)) {
                    setRecentPurchases(response.data);
                } else {
                    setRecentPurchases([]);
                }
            } catch (error) {
                console.error('Error fetching recent purchases:', error);
                setRecentPurchases([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (activeTabIndex === 0 && !date) {
            fetchRecentPurchases();
        }
    }, [activeTabIndex]);

    useEffect(() => {
        const fetchReportData = async () => {
            setIsLoading(true);

            try {
                let response;

                switch (reportType) {
                    case 'Date':
                        if (date) {
                            const formattedDate = formatDate(date);
                            response = await reportsAPI.getReportsByDate(formattedDate)
                            if (response.success) {
                                const data = response.data
                                setReportData(data);

                            }
                        }
                        break;

                    case 'Customer':
                        if (selectedOption) {
                            response = await reportsAPI.getReportsByName(selectedOption)
                            if (response.success) {
                                const data = response.data
                                setReportData(data);

                            }
                        }
                        break;

                    case 'Product':
                        if (selectedOption) {
                            const productId = selectedOption;
                            response = await reportsAPI.getReportsByProduct(productId)
                            if (response.success) {
                                const data = response.data
                                setReportData(data);

                            }
                        }
                        break;

                    case 'Payment':
                        if (paymentType) {
                            response = await reportsAPI.getReportsByPaymentType(paymentType)
                            if (response.success) {
                                const data = response.data
                                setReportData(data);

                            }
                        }
                        break;

                    case 'Cash':
                        if (cashDate) {
                            const formattedDate = formatDate(cashDate);
                            response = await reportsAPI.getCashReportByDate(formattedDate)
                            if (response.success) {
                                const data = response.data
                                setCashReportData(data);
                            }
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
    }, [reportType, date, selectedOption, paymentType, cashDate]);

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const handleTabChange = (e) => {
        setActiveTabIndex(e.index);

        // Reset all filters
        setDate(null);
        setSelectedOption(null);
        setPaymentType(null);
        setCashDate(null);
        setReportData([]);
        setCashReportData([]);
        setSearchTerm("");

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
                (item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.date && formatDisplayDate(item.date).includes(searchTerm))
            );
        });
    };

    const dateTemplate = (rowData) => {
        return formatDisplayDate(rowData.date);
    };

    const renderEmptyState = (message) => (
        <div className="empty-state">
            <i className="pi pi-inbox" />
            <p className="empty-message">{message}</p>
        </div>
    );

    const renderReportContent = () => {
        if (isLoading) {
            return (
                <div className="loading-container">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration=".8s" />
                    <h4 className="loading-text">Loading Report Data...</h4>
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
                <div className="d-flex justify-content-end">
                    <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="Choose date..." />
                </div>
                {!date && recentPurchases.length > 0 && (
                    <>
                        <h4 style={{ color: 'var(--text-primary)' }}>Recent Purchases</h4>
                        {renderRecentPurchasesTable()}
                    </>
                )}
                {!date && recentPurchases.length === 0 && renderEmptyState("No data found yet. Your recent purchases will appear here.")}
                {date && renderReportTable()}
            </>
        );
    };

    const renderCustomerReport = () => {
        return (
            <>
                <div className="d-flex justify-content-end">
                    <Dropdown value={selectedOption} options={customers} onChange={(e) => setSelectedOption(e.value)} placeholder="Choose customer..." />
                </div>
                {!selectedOption && recentPurchases.length > 0 && (
                    <>
                        <h4 style={{ color: 'var(--text-primary)' }}>Recent Purchases</h4>
                        {renderRecentPurchasesTable()}
                    </>
                )}
                {!selectedOption && recentPurchases.length === 0 && renderEmptyState("No data found yet. Reports by customer will appear here.")}
                {selectedOption && renderReportTable()}
            </>
        );
    };

    const renderProductReport = () => {
        return (
            <>
                <div className="d-flex justify-content-end">
                    <Dropdown value={selectedOption} options={products} onChange={(e) => setSelectedOption(e.value)} placeholder="Choose product..." />
                </div>
                {!selectedOption && recentPurchases.length > 0 && (
                    <>
                        <h4 style={{ color: 'var(--text-primary)' }}>Recent Purchases</h4>
                        {renderRecentPurchasesTable()}
                    </>
                )}
                {!selectedOption && recentPurchases.length === 0 && renderEmptyState("No data found yet. Reports by product will appear here.")}
                {selectedOption && renderReportTable()}
            </>
        );
    };

    const renderPaymentReport = () => {
        return (
            <>
                <div className="d-flex justify-content-end">
                    <Dropdown value={paymentType} options={paymentOptions} onChange={(e) => setPaymentType(e.value)} placeholder="Choose payment type..." />
                </div>
                {!paymentType && recentPurchases.length > 0 && (
                    <>
                        <h4 style={{ color: 'var(--text-primary)' }}>Recent Purchases</h4>
                        {renderRecentPurchasesTable()}
                    </>
                )}
                {!paymentType && recentPurchases.length === 0 && renderEmptyState("No data found yet. Payment type reports will appear here.")}
                {paymentType && renderReportTable()}
            </>
        );
    };


    const renderCashReport = () => {
        return (
            <>
                <div className="d-flex justify-content-end">
                    {/* <label className="filter-label">Select Date:</label> */}
                    <Calendar value={cashDate} onChange={(e) => setCashDate(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="Choose date..." />
                </div>

                {!cashDate && recentPurchases.length > 0 && (
                    <>
                        <h4 style={{ color: 'var(--text-primary)' }}>Recent Purchases</h4>
                        {renderRecentPurchasesTable()}
                    </>
                )}

                {!cashDate && recentPurchases.length === 0 && renderEmptyState("No data found yet. Cash reports will appear here.")}

                {cashDate && (
                    <div className="table-container">
                        {cashReportData.length === 0 ? (
                            renderEmptyState("No cash records found for the selected date.")
                        ) : (
                        <DataTable paginator rows={5} value={cashReportData} className="reports-table" responsiveLayout="scroll" stripedRows emptyMessage="No cash records found"
                            footer={
                                <div className="summary-container">
                                    <div className="summary-box">
                                        <span className="summary-text">Total Amount:</span>
                                        <span className="summary-value">
                                            ₹{cashReportData.reduce((acc, item) => acc + (parseFloat(item.grandTotal) || 0), 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            }
                        >
                            <Column field="customerName" header="customer" />
                            <Column field="twothousandnotes" header="2000" />
                            <Column field="fivehundrednotes" header="500" />
                            <Column field="twohundrednotes" header="200" />
                            <Column field="hundrednotes" header="100" />
                            <Column field="fiftynotes" header="50" />
                            <Column field="twentynotes" header="20" />
                            <Column field="tennotes" header="10" />
                            <Column field="fiverupees" header="5" />
                            <Column field="tworupees" header="2" />
                            <Column field="onerupees" header="1" />
                            <Column field="grandTotal" header="Total" />
                        </DataTable>
                        )}
                    </div>
                )}
            </>
        );
    };

    const renderRecentPurchasesTable = () => {
        const filteredData = filterData(recentPurchases, searchTerm);
        const tableTotal = filteredData.reduce((acc, item) => acc + (parseFloat(item.totalAmount || 0) || 0), 0);

        return (
            <>
                <div className="table-container">
                    <DataTable paginator rows={5} value={filteredData} className="reports-table" responsiveLayout="scroll" stripedRows emptyMessage="No purchase records found" footer={<div className="summary-container"><div className="summary-box"><span className="summary-text">Grand Total:</span><span className="summary-value">₹{tableTotal.toFixed(2)}</span></div></div>}>
                        <Column field="date" header="Date" body={dateTemplate} />
                        <Column field="customerName" header="Customer Name" />
                        <Column field="productName" header="Product Name" />
                        <Column field="price" header="Price" />
                        <Column field="quantity" header="Quantity" />
                        <Column field="totalAmount" header="Total Amount" />
                    </DataTable>
                </div>
            </>
        );
    };

    const renderReportTable = () => {
        const filteredData = filterData(reportData, searchTerm);
        const tableTotal = filteredData.reduce((acc, item) => acc + (parseFloat(item.totalAmount || item.amount || 0) || 0), 0);

        // if (filteredData.length === 0) {
        //     return (
        //         <div className="table-container">
        //             {renderEmptyState(reportData.length === 0 ? "No records found for the selected filter." : "No records match your search.")}
        //         </div>
        //     );
        // }
        return (
            <>
                <div className="search-container">
                    <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="search-input" />
                </div>
                <div className="table-container">
                    <DataTable paginator rows={5} value={filteredData} className="reports-table" responsiveLayout="scroll" stripedRows emptyMessage="No records found" footer={<div className="summary-container"><div className="summary-box"><span className="summary-text">Grand Total:</span><span className="summary-value">₹{tableTotal.toFixed(2)}</span></div></div>}>
                        {reportType !== 'Date' && <Column field="date" header="Date" body={dateTemplate} />}
                        {reportType !== 'Customer' && <Column field="customerName" header="Customer Name" />}
                        {(reportType !== 'Product' && reportType !== 'Payment') && <Column field="productName" header="Product Name" />}
                        {reportType !== 'Payment' && <Column field="price" header="Price" />}
                        {reportType !== 'Payment' && <Column field="quantity" header="Quantity" />}
                        {reportType !== 'Payment' && <Column field="totalAmount" header="Total Amount" />}
                        {reportType === 'Payment' && <Column field="amount" header="Total Amount" />}
                    </DataTable>
                </div>
            </>
        );
    };

    return (
        <div>
            <Header />
            <div className="reports-container">
                <Card className="reports-card">
                    <div className="tab-wrapper">
                        <TabMenu model={tabItems} activeIndex={activeTabIndex} onTabChange={handleTabChange} className="tab-container" />
                    </div>
                    <div className="reports-content">
                        {renderReportContent()}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Reports;
//         <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="search-input"/>
//     </div>

//     <div className="table-container">
//         <DataTable paginator rows={5} value={filterData(paymentTypeData, searchTerm)}
//             className="reports-table"responsiveLayout="scroll" stripedRows emptyMessage="No payment records found"
//             footer={
//                 <div className="summary-container">
//                     <div className="summary-box">
//                         <span className="summary-text">Total Amount:</span>
//                         <span className="summary-value">
//                             ₹{paymentTypeData.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0).toFixed(2)}
//                         </span>
//                     </div>
//                 </div>
//             }
//         >
//             <Column field="id" header="Bill No" />
//             <Column field="name" header="Customer Name" />
//             <Column field="date" header="Date" body={dateTemplate} />
//             <Column field="amount" header="Amount" />
//         </DataTable>
//     </div>
// </>