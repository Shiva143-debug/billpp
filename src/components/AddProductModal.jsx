import { useState, useRef, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { productAPI } from '../services/apiService';
import "../styles/Product.css";

function AddProductModal({ visible, onHide, onProductAdded, editMode = false, productData = null }) {
    const [invoice, setInvoice] = useState("");
    const [company, setCompany] = useState("");
    const [product, setProduct] = useState("");
    const [price, setPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [baseQuantity, setBaseQuantity] = useState("");
    const [receivedDate, setReceivedDate] = useState(null);
    const [active, setActive] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const toast = useRef(null);

    useEffect(() => {
        if (visible) {
            if (editMode && productData) {
                setInvoice(productData.invoiceNumber || productData.invoice || "");
                setCompany(productData.company || productData.companyName || "");
                setProduct(productData.productName || productData.product || "");
                setPrice(productData.price ?? "");
                setSellingPrice(productData.sellingPrice ?? "");
                setBaseQuantity(productData.baseQuantity ?? productData.quantity ?? "");
                setReceivedDate(formatInputDate(productData.receivedDate || productData.date || ""));
                setActive(productData.active === true || productData.active === 1 || productData.active === 'true');
            } else {
                handleClear();
            }
        }
    }, [visible, editMode, productData]);

    const formatInputDate = (dateString) => {
        if (!dateString) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
        const parts = dateString.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
        if (parts) {
            const [, day, month, year] = parts;
            const fullYear = year.length === 2 ? `20${year}` : year;
            return `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "";
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!invoice) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Invoice Number' });
            return;
        }
        else if (!company) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Company Name' });
            return;
        }
        else if (!product) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Product Name' });
            return;
        }
        else if (!price) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Price' });
            return;
        }
        else if (!sellingPrice) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Selling Price' });
            return;
        }
        else if (!baseQuantity) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Base Quantity' });
            return;
        }
        else if (!receivedDate) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Select Received Date' });
            return;
        }

        const productDataPayload = { invoice, company, product, price, sellingPrice, baseQuantity, receivedDate, active };

        setIsLoading(true);
        try {
            let response;
            if (editMode && productData) {
                const saveUpdate = productAPI.updateProduct;
                response = await saveUpdate(productData.productId || productData.id, productDataPayload);
            } else {
                response = await productAPI.addProduct(productDataPayload);
            }

            if (response.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
                handleClear();
                onProductAdded();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.message || "Failed to save product" });
            }
        } catch (error) {
            console.error('Error saving product:', error);
            const errorMessage = error.response?.data?.message || "Failed to save product";
            toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setInvoice("");
        setCompany("");
        setProduct("");
        setPrice("");
        setSellingPrice("");
        setBaseQuantity("");
        setReceivedDate("");
        setActive(true);
    };

    const handleDialogHide = () => {
        handleClear();
        onHide();
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} onHide={handleDialogHide} header={editMode ? "Update Product" : "Add New Product"} modal
                style={{ width: '90vw', maxWidth: '1000px' }} className="modal-dialog" appendTo={document.body}>
                <div className="row mb-3">
                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="invoice" className="form-label">Invoice Number:</label>
                        <input id="invoice" type="text" placeholder="Enter invoice number" className="form-control"
                            value={invoice} onChange={(e) => setInvoice(e.target.value)} />
                    </div>
                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="company" className="form-label">Company Name:</label>
                        <input id="company" type="text" placeholder="Enter company name" className="form-control"
                            value={company} onChange={(e) => setCompany(e.target.value)} />
                    </div>
                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="product" className="form-label">Product Name:</label>
                        <input id="product" type="text" placeholder="Enter product name" className="form-control"
                            value={product} onChange={(e) => setProduct(e.target.value)} />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="price" className="form-label">Price:</label>
                        <input id="price" type="number" placeholder="Enter price" className="form-control"
                            value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="sellingPrice" className="form-label">Selling Price:</label>
                        <input id="sellingPrice" type="number" placeholder="Enter selling price" className="form-control"
                            value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
                    </div>
                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="baseQuantity" className="form-label">Base Quantity:</label>
                        <input id="baseQuantity" type="number" placeholder="Enter base quantity" className="form-control"
                            value={baseQuantity} onChange={(e) => setBaseQuantity(e.target.value)} />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="receivedDate" className="form-label">Received Date:</label>
                        <input id="receivedDate" type="date" className="form-control"
                            value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} />
                    </div>
                    {editMode && (
                        <div className="form-group col-md-4 col-12">
                            <label htmlFor="active" className="form-label">Status:</label>
                            <div className="d-flex align-items-center" style={{ paddingTop: '8px' }}>
                                <div className="form-check form-switch" style={{ paddingLeft: '2.5em', margin: 0 }}>
                                    <input id="active" className="form-check-input" type="checkbox" role="switch"
                                        checked={active === true || active === 1 || active === 'true'}
                                        onChange={(e) => setActive(e.target.checked)}
                                        style={{ width: '2.5em', height: '1.25em' }} />
                                </div>
                                <span className="ms-2 form-text" style={{ fontSize: '1rem', color: (active === true || active === 1 || active === 'true') ? 'var(--success-color)' : 'var(--error-color)', fontWeight: 600 }}>
                                    {active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="d-flex justify-content-between flex-wrap mt-4">
                    <button type="button" onClick={handleClear} className="btn btn-secondary mb-2" disabled={isLoading}>
                        Clear
                    </button>
                    {isLoading ? (
                        <div className="spinner-container">
                            <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                        </div>
                    ) : (
                        <button className="btn btn-primary mb-2" onClick={handleSubmit}>
                            {editMode ? 'Update Product' : 'Add Product'}
                        </button>
                    )}
                </div>
            </Dialog>
        </>
    );
}

export default AddProductModal;
