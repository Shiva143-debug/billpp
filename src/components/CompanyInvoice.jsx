import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { MdDelete } from 'react-icons/md';
import { invoiceAPI, BASE_URL } from '../services/apiService';
import "../styles/Invoice.css";

const CompanyInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [amount, setAmount] = useState("");
    const [invoice, setInvoice] = useState("");
    const [companySearchTerm, setCompanySearchTerm] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const fetchInvoices = async () => {
        try {
            setIsLoading(true);
            const response = await invoiceAPI.getInvoices();
            if (response.success && Array.isArray(response.data)) {
                setInvoices(response.data);
            } else {
                setInvoices([]);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch invoices' });
            setInvoices([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!invoice) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter invoice number' });
            return;
        }

        if (!companyName) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter company name' });
            return;
        }

        if (!amount) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter amount' });
            return;
        }

        if (!file) {
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
            const response = await invoiceAPI.addInvoice(formData);
            if (response.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
                resetForm();
                setShowModal(false);
                await fetchInvoices();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.message });
            }
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
            window.open(`${BASE_URL}${url}`, '_blank');
        }
    };

    const handleDelete = (rowData) => {
        confirmDialog({
            message: `Are you sure you want to delete invoice "${rowData.invoice}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    const response = await invoiceAPI.deleteCompanyInvoice(rowData.id || rowData.invoice_id);
                    if (response.success) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
                        await fetchInvoices();
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: response.message });
                    }
                } catch (error) {
                    console.error('Error deleting invoice:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete invoice' });
                }
            }
        });
    };

const ActionTemplate = (rowData) => {
        return (
            <div className="table-actions">
                <button type="button" className="action-btn action-view" title="View PDF" onClick={() => viewPDF(rowData.filePath)}>
                    <i className="pi pi-file-pdf"></i>
                </button>
                <button type="button" className="action-btn action-delete" title="Delete Invoice" onClick={() => handleDelete(rowData)}>
                    <MdDelete />
                </button>
            </div>
        );
    };

    const filteredInvoices = invoices.filter(item => {
        return (
            (item.invoice && String(item.invoice).toLowerCase().includes(companySearchTerm.toLowerCase())) ||
            (item.companyName && item.companyName.toLowerCase().includes(companySearchTerm.toLowerCase())) ||
            (item.amount && String(item.amount).includes(companySearchTerm))
        );
    });

    return (
        <div className="invoice-form-container">
            <Toast ref={toast} />
            <ConfirmDialog />
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
                        <DataTable value={filteredInvoices} className="reports-table" paginator rows={5} responsiveLayout="scroll" stripedRows emptyMessage="No invoices found">
                            <Column field="invoice" header="Invoice Number" />
                            <Column field="companyName" header="Company Name" />
                            <Column field="amount" header="Amount" />
                            <Column header="Actions" body={ActionTemplate} />
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

export default CompanyInvoice;
