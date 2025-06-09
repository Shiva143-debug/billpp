import React, { useState, useEffect, useRef } from "react";
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '../context/AuthContext';
import { productAPI, itemsAPI } from '../services/apiService';
import "../styles/Shopping.css";

function Shopping({ name, date, onHide, itemsAddedToCart, editMode = false, itemData = null }) {
    const { userId } = useAuth();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("select");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [availableQuantity, setAvailableQuantity] = useState(0);

    const toast = useRef(null);
    const isMobile = useMediaQuery('(max-width:768px)');

    // Set initial values if in edit mode
    useEffect(() => {
        if (editMode && itemData) {
            setSelectedProduct(itemData.product_name);
            setPrice(itemData.price);
            setQuantity(itemData.quantity);
        }
    }, [editMode, itemData]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await productAPI.getProducts(userId);
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
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

    const handleProductChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedProduct(selectedValue);

        const selectedProductData = products.find(p => p.product_name === selectedValue);
        if (selectedProductData) {
            setPrice(selectedProductData.selling_price);
            setAvailableQuantity(selectedProductData.quantity);
        } else {
            setPrice("");
            setAvailableQuantity(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedProduct === "select") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select a product' });
            return;
        }

        else if (!quantity || quantity <= 0) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter a valid quantity' });
            return;
        }

        else if (parseInt(quantity) > availableQuantity && !editMode) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: `Only ${availableQuantity} items available in stock` });
            return;
        }

        setIsLoading(true);

        try {
            const itemDataValues = { userId, name, date, productName: selectedProduct, price, quantity: parseInt(quantity), totalAmount: price * quantity };

            if (editMode && itemData) {
                await itemsAPI.updateItem(userId, itemData.item_id, itemDataValues);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Item updated successfully' });
            } else {
                await itemsAPI.addItem(userId, itemDataValues);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Item added to cart successfully' });
            }

            setSelectedProduct("select");
            setPrice("");
            setQuantity("");
            if (itemsAddedToCart) {
                itemsAddedToCart();
            }
            if (onHide) {
                onHide('Item processed successfully', 'success');
            }
        } catch (error) {
            console.error('Error processing item:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Failed to process item' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (onHide) {
            onHide();
        }
    };

    return (
        <div className="shopping-container">
            <Toast ref={toast} />
            <div className="shopping-card">
                <h2 className="shopping-heading">
                    {editMode ? 'Update Product' : 'Add Product to Cart'}
                </h2>

                <form className="shopping-form" onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="form-group col-md-6 col-12">
                            <label htmlFor="product" className="form-label">Product:</label>
                            <select id="product" className="form-control" value={selectedProduct} onChange={handleProductChange} disabled={editMode}>
                                <option value="select">Select Product</option>
                                {products.map((product) => (
                                    <option key={product.product_id} value={product.product_name}>
                                        {product.product_name} (Available: {product.quantity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group col-md-6 col-12">
                            <label htmlFor="price" className="form-label">Price:</label>
                            <input id="price" type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} readOnly={!editMode} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="form-group col-md-6 col-12">
                            <label htmlFor="quantity" className="form-label">Quantity:</label>
                            <input id="quantity" type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" max={editMode ? undefined : availableQuantity} />

                            <small className="form-text"> Available: {availableQuantity} items
                            </small>

                        </div>

                        <div className="form-group col-md-6 col-12">
                            <label htmlFor="totalAmount" className="form-label">Total Amount:</label>
                            <input id="totalAmount" type="number" className="form-control" value={(price * quantity) || 0} readOnly />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between flex-wrap">
                        <button type="button" onClick={handleCancel} className="btn btn-secondary mb-2" disabled={isLoading}>Cancel</button>

                        {isLoading ? (
                            <div className="spinner-container">
                                <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                            </div>
                        ) : (
                            <button type="submit" className="btn btn-primary mb-2">{editMode ? 'Update Product' : 'Add to Cart'}</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Shopping;