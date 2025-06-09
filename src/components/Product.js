import { useState, useRef } from "react";
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/apiService';
import Header from './Header';
import "../styles/Product.css";

function Product() {
    const { userId } = useAuth();
    const [invoice, setInvoice] = useState("");
    const [company, setCompany] = useState("");
    const [product, setProduct] = useState("");
    const [price, setPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [receivedDate, setReceivedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const toast = useRef(null);

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
        else if (!quantity) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Quantity' });
            return;
        }
        else if (!receivedDate) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Select Received Date' });
            return;
        }

        const productData = { invoice, company, product, price, sellingPrice, quantity, receivedDate };

        setIsLoading(true);
        try {
            await productAPI.addProduct(userId, productData);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Product added successfully' });
            handleclear();
        } catch (error) {
            console.error('Error adding product:', error);
            const errorMessage = error.response?.data?.message || "Failed to add product";
            toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleclear = () => {
        setInvoice("");
        setCompany("");
        setProduct("");
        setPrice("");
        setSellingPrice("");
        setQuantity("");
        setReceivedDate("");
    };

    return (
        <>
            <Header />
            <Toast ref={toast} />

            <div className="product-container p-3"  >
                <h2 className="product-heading">Add Product</h2>
                <div className="row mb-3">
                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="invoice" className="form-label">Invoice Number:</label>
                        <input id="invoice" type="text" placeholder="Enter invoice number" className="form-control" value={invoice} onChange={(e) => setInvoice(e.target.value)} />
                    </div>

                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="company" className="form-label">Company Name:</label>
                        <input id="company" type="text" placeholder="Enter company name" className="form-control" value={company} onChange={(e) => setCompany(e.target.value)} />
                    </div>

                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="product" className="form-label">Product Name:</label>
                        <input id="product" type="text" placeholder="Enter product name" className="form-control" value={product} onChange={(e) => setProduct(e.target.value)} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="price" className="form-label">Price:</label>
                        <input id="price" type="number" placeholder="Enter price" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>

                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="sellingPrice" className="form-label">Selling Price:</label>
                        <input id="sellingPrice" type="number" placeholder="Enter selling price" className="form-control" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
                    </div>

                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="quantity" className="form-label">Quantity:</label>
                        <input id="quantity" type="number" placeholder="Enter quantity" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="form-group col-md-4 col-12">
                        <label htmlFor="receivedDate" className="form-label">Received Date:</label>
                        <input id="receivedDate" type="date" className="form-control" value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} />
                    </div>
                    <div className="form-group col-md-4 col-12">
                    </div>
                    <div className="form-group col-md-4 col-12">
                    </div>
                </div>

                <div className="d-flex justify-content-between flex-wrap mt-4">
                    <button type="button" onClick={handleclear} className="btn btn-secondary mb-2" disabled={isLoading}>Clear</button>

                    {isLoading ? (
                        <div className="spinner-container">
                            <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                        </div>
                    ) : (
                        <button className="btn btn-primary mb-2" onClick={handleSubmit}> Add Product</button>
                    )}
                </div>
            </div>

        </>
    );
}

export default Product;