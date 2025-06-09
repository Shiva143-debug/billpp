
import React, { useState, useEffect, useRef } from "react";
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from "axios";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { invoiceAPI } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import Header from "./Header";
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
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const toast = useRef(null);

    const tabItems = [
        { label: 'Add Invoice', icon: 'pi pi-plus' },
        { label: 'Invoice Details', icon: 'pi pi-list' }
    ];

    useEffect(() => {
        fetchInvoices();
        fetchProductsFromCompanies();
    }, [userId]);

    const fetchInvoices = async () => {
        try {
            const response = await invoiceAPI.getInvoices(userId);
            const data = response.data;
            setInvoices(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch invoices' });
            setInvoices([]);
        }
    };


    const fetchProductsFromCompanies = async () => {
        try {
            const response = await invoiceAPI.getProductsFromCompanies(userId);
            const data = response.data;
            setProductsData(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch products' });
            setProductsData([]);
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
        formData.append("pdf", file);
        formData.append("invoice", invoice);
        formData.append("amount", amount);
        formData.append("companyName", companyName);

        try {
            setIsLoading(true)
            const response = await axios.post(`https://plum-cuboid-crest.glitch.me/addInvoice/${userId}`, formData, { headers: { "Content-Type": "multipart/form-data" }, });
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Invoice added successfully' });
            resetForm();
            await fetchInvoices();
        } catch (error) {
            console.error('Error adding customer:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add invoice' });
        }  finally {
            setIsLoading(false);
        }

    };


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (selectedFile && selectedFile.size > maxSize) {
            alert("File is too large. Upload a file under 1MB.");
            return;
        }
        setFile(selectedFile);
    };

    const resetForm = () => {
        setCompanyName("");
        setAmount("");
        setInvoice("");
        setFile(null);
    };

    const viewPDF = (url) => {
        const newTab = window.open('', '_blank');
        const pdfContent = `
            <embed src="data:application/pdf;base64,${url}" type="application/pdf" width="100%" height="100%">
        `;
        newTab.document.body.innerHTML = pdfContent;
    };

    const handleTabChange = (e) => {
        setActiveTabIndex(e.index);
    };

    const filterData = (data) => {
        if (!searchTerm || !Array.isArray(data)) return data;

        return data.filter(item => {
            return (
                (item.invoice_number && String(item.invoice_number).includes(searchTerm)) ||
                (item.company_name && item.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.date && new Date(item.date).toLocaleDateString().includes(searchTerm))
            );
        });
    };

    const dateTemplate = (rowData) => {
        return new Date(rowData.date).toLocaleDateString();
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

    const renderAddInvoice = () => {
        return (
            <div className="d-flex justify-content-between gap-5">
                <div style={{ width: "50vw" }}>
                    <h2 className="invoice-heading">Add Invoice</h2>
                    <div className="card px-5 pt-3" >

                        <form onSubmit={handleSubmit}>
                            <div className=" d-flex align-items-start gap-3 mb-3">
                                <label htmlFor="invoice" className="form-label">Invoice Number:</label>
                                <InputText id="invoice" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder="Enter invoice number" className="form-control" />
                            </div>

                            <div className="d-flex align-items-start gap-3 mb-3">
                                <label htmlFor="company" className="form-label">Company Name:</label>
                                <InputText id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter company name" className="form-control" />
                            </div>

                            <div className="d-flex align-items-start gap-3 mb-3">
                                <label htmlFor="amount" className="form-label">Amount:</label>
                                <InputNumber id="amount" value={amount} onValueChange={(e) => setAmount(e.value)} placeholder="Enter amount" mode="currency" currency="INR" locale="en-IN" className="form-control" />
                            </div>

                            <div className="d-flex align-items-start gap-3 mb-3">
                                <label htmlFor="file" className="form-label">Invoice PDF:</label>
                                <input id="file" type="file" onChange={handleFileChange} accept=".pdf" className="file-input" />
                            </div>

                            <div className="button-container mb-5 mt-5">
                                {isLoading ? (
                                    <div className="spinner-container">
                                        <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" />
                                    </div>
                                ) : (
                                    <Button label="Submit" icon="pi pi-check" type="submit" className="p-button-primary" />
                                )}
                            </div>
                        </form>
                    </div>

                </div>
                <div style={{ width: "50vw" }}>
                    <h2 className="invoice-heading">Recent Invoices</h2>
                    <div className="table-container">
                        <DataTable value={invoices} className="invoice-table" paginator rows={4} responsiveLayout="scroll" stripedRows emptyMessage="No invoices found">
                            <Column field="invoice" header="Invoice Number" />
                            <Column field="company_name" header="Company Name" />
                            <Column field="amount" header="Amount" />
                            <Column header="View" body={viewPdfTemplate} />
                        </DataTable>
                    </div>
                </div>
            </div>
        );
    };

    const renderViewInvoice = () => {
        const filteredData = filterData(productsData);
        const { totalQuantity, grandTotal, totalPrice, totalSellingPrice } = calculateSummary(filteredData);

        return (
            <>
                <div className="search-container">
                    <span className="p-input-icon-left">
                        {/* <i className="pi pi-search" /> */}
                        <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="SearchBy invoice,company,product..." className="search-input" />
                    </span>
                </div>

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
        );
    };

    return (
        <div className="invoice-container">
            <Header />
            <Toast ref={toast} />

            <Card className="invoice-card">
                <h2 className="invoice-heading">Invoice Management</h2>

                <TabMenu model={tabItems} activeIndex={activeTabIndex} onTabChange={handleTabChange} className="tab-container" />

                {activeTabIndex === 0 ? renderAddInvoice() : renderViewInvoice()}
            </Card>
        </div>
    );
};

export default Invoice;