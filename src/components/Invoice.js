
import { useState, useEffect, useRef } from "react";
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { ProgressSpinner } from 'primereact/progressspinner';
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { invoiceAPI, BASE_URL } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import Header from "./Header";
import AddProductModal from "./AddProductModal";
import "../styles/Invoice.css";

const Invoice = () => {
    const { userId } = useAuth();
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [companyName, setCompanyName] = useState("");
    const [amount, setAmount] = useState("");
    const [invoice, setInvoice] = useState("");
    const [invoices, setInvoices] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [companySearchTerm, setCompanySearchTerm] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);

    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const tabItems = [
        { label: 'Company Invoice', icon: 'pi pi-list' },
        { label: 'Product Invoice Details', icon: 'pi pi-list' }
    ];

    useEffect(() => {
        fetchInvoices();
        fetchProductsFromCompanies();
    }, [userId]);

    const fetchInvoices = async () => {
        try {
            setIsLoading(true);
            const response = await invoiceAPI.getInvoices(userId);
            const data = response.data;
            setInvoices(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch invoices' });
            setInvoices([]);
        } finally {
            setIsLoading(false);
        }
    };


    const fetchProductsFromCompanies = async () => {
        try {
            setIsLoading(true);
            const response = await invoiceAPI.getInvoiceProducts(userId);
            const data = response.data;
            setProductsData(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch products' });
            setProductsData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!invoice) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter invoice number' });
            return;
        }

        else if (!companyName) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter company name' });
            return;
        }

        else if (!amount) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter amount' });
            return;
        }

        else if (!file) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select a PDF file' });
            return;
        }

        const formData = new FormData();
        formData.append("pdf", file);              // MUST match multer field name
        formData.append("invoice", invoice);
        formData.append("amount", amount);
        formData.append("companyName", companyName);

        try {
            setIsLoading(true)
            await invoiceAPI.addInvoice(userId, formData);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Invoice added successfully' });
            resetForm();
            setShowModal(false);
            await fetchInvoices();
        } catch (err) {
            console.error(err);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add invoice' });
        }
        finally {
            setIsLoading(false);
        }

    };


    const handleFileChange = (e) => {
        const selectedFile = e.files ? e.files[0] : e.target.files[0];
        setFile(selectedFile);
    };


    const resetForm = () => {
        setCompanyName("");
        setAmount("");
        setInvoice("");
        setFile(null);
        if (fileUploadRef.current) {
            fileUploadRef.current.clear(); // ✅ clears selected file UI
        }
    };

    const viewPDF = (url) => {
        if (url) {
            window.open(`${'https://backend-bill-2.onrender.com'}${url}`, '_blank');
        }
    };

    const handleTabChange = (e) => {
        setActiveTabIndex(e.index);
    };

    const handleProductAdded = () => {
        setShowAddProductModal(false);
        fetchProductsFromCompanies();
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const filterData = (data) => {
        if (!searchTerm || !Array.isArray(data)) return data;

        return data.filter(item => {
            return (
                (item.invoice_number && String(item.invoice_number).includes(searchTerm)) ||
                (item.company_name && item.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.date && formatDisplayDate(item.date).includes(searchTerm))
            );
        });
    };

    const dateTemplate = (rowData) => {
        return formatDisplayDate(rowData.date);
    };

    const viewPdfTemplate = (rowData) => {
        return (
            <Button label="View PDF" icon="pi pi-file-pdf" className="p-button-sm p-button-info" onClick={() => viewPDF(rowData.file_path)} />
        );
    };

    const calculateSummary = (data) => {
        if (!Array.isArray(data)) return { totalQuantity: 0, grandTotal: 0, totalPrice: 0, totalSellingPrice: 0 };

        let totalQuantity = 0;
        let grandTotal = 0;
        let totalPrice = 0;
        let totalSellingPrice = 0;

        data.forEach((item) => {
            totalPrice += parseInt(item.price || 0);
            totalSellingPrice += parseInt(item.selling_price || 0);
            totalQuantity += parseInt(item.quantity || 0);
            grandTotal += parseFloat(item.total_amount || 0);
        });

        return { totalQuantity, grandTotal, totalPrice, totalSellingPrice };
    };

    const companyInvoice = () => {
        const filteredInvoices = invoices.filter(item => {
            return (
                (item.invoice && String(item.invoice).toLowerCase().includes(companySearchTerm.toLowerCase())) ||
                (item.company_name && item.company_name.toLowerCase().includes(companySearchTerm.toLowerCase())) ||
                (item.amount && String(item.amount).includes(companySearchTerm))
            );
        });

        return (
            <div className="invoice-form-container">
                <div className="invoice-table-section">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="search-container" style={{ margin: 0 }}>
                            <span className="p-input-icon-left">
                                <InputText value={companySearchTerm} onChange={(e) => setCompanySearchTerm(e.target.value)} placeholder="company invoices..." className="search-input" />
                            </span>
                        </div>
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>+ Add Invoice</button>
                    </div>
                    <div className="table-container">
                        {isLoading ? (
                            <>
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
                                </div>
                                <h4 className="loading-text">Loading Invoice Data...</h4>
                            </>
                        ) : (
                            <DataTable value={filteredInvoices} className="invoice-table" paginator rows={5} responsiveLayout="scroll" stripedRows emptyMessage="No invoices found">
                                <Column field="invoice" header="Invoice Number" />
                                <Column field="company_name" header="Company Name" />
                                <Column field="amount" header="Amount" />
                                <Column header="View" body={viewPdfTemplate} />
                            </DataTable>
                        )}
                    </div>
                </div>

                <Dialog header="Add Company Invoice" visible={showModal} style={{ width: '50vw' }} onHide={() => setShowModal(false)}>
                    <div className="invoice-form-section">
                        <form onSubmit={handleSubmit} className="invoice-form">
                            <div className="form-grid">
                                <div className="form-field">
                                    <label htmlFor="invoice" className="form-label">Invoice Number:</label>
                                    <InputText id="invoice" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder="Enter invoice number" />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="company" className="form-label">Company Name:</label>
                                    <InputText id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter company name" />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="amount" className="form-label">Amount:</label>
                                    <InputNumber id="amount" value={amount} onValueChange={(e) => setAmount(e.value)} placeholder="Enter amount" mode="currency" currency="INR" locale="en-IN" />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="file" className="form-label">Invoice PDF:</label>
                                    <FileUpload accept="application/pdf" ref={fileUploadRef} customUpload auto={false} onSelect={handleFileChange} maxFileSize={10485760} />
                                </div>
                            </div>

                            <div className="button-container mt-2">
                                {isLoading ? (
                                    <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" />
                                ) : (
                                    <Button label="Submit" icon="pi pi-check" type="submit" />
                                )}
                            </div>
                        </form>
                    </div>
                </Dialog>
            </div>
        );
    };

    const productInvoice = () => {
        const filteredData = filterData(productsData);
        const { totalQuantity, grandTotal, totalPrice, totalSellingPrice } = calculateSummary(filteredData);

        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="search-container" style={{ margin: 0 }}>
                        <span className="p-input-icon-left">
                            <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="SearchBy invoice,company,product..." className="search-input" />
                        </span>
                    </div>
                    <button className="btn btn-success" onClick={() => setShowAddProductModal(true)}>+ Add Product</button>
                </div>

                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
                    </div>
                ) : (
                    <>
                        <DataTable value={filteredData} className="invoice-table" responsiveLayout="scroll" rows={5} paginator stripedRows emptyMessage="No records found">
                            <Column field="invoice_number" header="Invoice Number" />
                            <Column field="company_name" header="Company Name" />
                            <Column field="product_name" header="Product Name" />
                            <Column field="price" header="Price" />
                            <Column field="selling_price" header="Selling Price" />
                            <Column field="quantity" header="Quantity" />
                            {/* <Column field="total_amount" header="Total Amount" /> */}
                            <Column field="date" header="Purchased Date" body={dateTemplate} />
                        </DataTable>

                        <div className="summary-container">
                            <div className="summary-box">
                                <div><span className="summary-text">Total Price:</span> <span className="summary-value">{totalPrice}</span></div>
                                <div><span className="summary-text">Total Selling Price:</span> <span className="summary-value">{totalSellingPrice}</span></div>
                                <div><span className="summary-text">Total Quantity:</span> <span className="summary-value">{totalQuantity}</span></div>
                                {/* <div><span className="summary-text">Grand Total:</span> <span className="summary-value">{grandTotal.toFixed(2)}</span></div> */}
                            </div>
                        </div>
                    </>
                )}
            </>
        );
    };

    return (
        <div>
            <Header />
            <Toast ref={toast} />
            <div className="invoice-container">
                <Card className="invoice-card">
                    <div className="tab-wrapper">
                        <TabMenu model={tabItems} activeIndex={activeTabIndex} onTabChange={handleTabChange} className="tab-container" />
                    </div>
                    {activeTabIndex === 0 ? companyInvoice() : productInvoice()}
                </Card>
            </div>
            <AddProductModal visible={showAddProductModal} onHide={() => setShowAddProductModal(false)} onProductAdded={handleProductAdded} />
        </div>
    );
};

export default Invoice;