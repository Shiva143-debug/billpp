import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { AiOutlinePlus } from "react-icons/ai";
import { customerAPI, cartAPI, productAPI, reportsAPI } from '../services/apiService';
import Header from './Header';
import Shopping from './Shopping';
import AddCustomerModal from './AddCustomerModal';
import "../styles/Home.css";

function Home() {
    const [customers, setCustomers] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [address, setAddress] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [date, setDateChange] = useState(new Date().toISOString().split('T')[0]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [recentSales, setRecentSales] = useState([]);
    const [items, setItems] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [showProductCart, setShowProductCart] = useState(false);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const toast = useRef(null);

    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:768px)');

    const productButtonClick = () => {
        setVisible(true);
    };

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        if (selectedValue === "") {
            setShowProductCart(false);
            setAddress("");
            setContactNo("");
            return;
        }
        const selectedData = customers.find(d => d.customerId == selectedValue);
        setAddress(selectedData ? selectedData.address : "");
        setContactNo(selectedData ? selectedData.contactNo : "");
        setShowProductCart(true);
    };

    const handleCustomerAdded = () => {
        setShowAddCustomerModal(false);
        fetchCustomers();
    };

    const onHide = (isAction, severityName) => {
        if (isAction) {
            if (severityName === 'warn') {
                toast.current.show({ severity: severityName, summary: 'Warning', detail: isAction });
            } else {
                toast.current.show({ severity: severityName, summary: 'Success', detail: isAction });
            }
        }
        setVisible(false);
        setVisibleEdit(false);
        fetchItems();
        setIsLoading(false);
    };

    const itemsAddedToCart = () => {
        setIsLoading(true);
    };

    const handleDelete = async (itemId) => {
        setIsLoading(true);
        try {
            const response = await cartAPI.deleteItem(itemId);
            if (response.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
                setItems((prevItems) => {
                    const newItems = prevItems.filter((item) => item.itemId !== itemId);
                    const newTotal = newItems.reduce((acc, item) => acc + (Number(item.totalAmount) || 0), 0);
                    setGrandTotal(newTotal);
                    return newItems;
                });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.message });
            }
        } catch (error) {
            console.error('Error during item deletion:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: "Failed to delete item" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (rowData) => {
        setSelectedRowData(rowData);
        setVisibleEdit(true);
    };

    const proceedToBuy = () => {
        const selectedCustomer = customers.find(d => String(d.customerId) === String(selectedOption));
        const customerName = selectedCustomer ? selectedCustomer.name : selectedOption;
        const orderDetails = { selectedOption, customerName, address, contactNo, grandTotal, items, date };

        const processItems = async () => {
            setIsLoading(true);
            let allItemsProcessed = true;

            for (const item of orderDetails.items) {
                try {
                    const deductValues = { productId: item.productId, quantity: item.quantity };
                    const response = await productAPI.deductProductQuantity(deductValues);
                    if (!response.success) {
                        toast.current.show({ severity: 'warn', summary: 'Warning', detail: response.message });
                        allItemsProcessed = false;
                        break;
                    }
                } catch (error) {
                    console.error('Error processing item:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to process item' });
                    allItemsProcessed = false;
                    break;
                }
            }

            setIsLoading(false);
            if (allItemsProcessed) {
                navigate('/checkout', { state: { orderDetails } });
            }
        };
        processItems();
    };

    // Fetch customers
    const fetchCustomers = async () => {
        try {
            const response = await customerAPI.getCustomers();
            if (response.success && Array.isArray(response.data)) {
                setCustomers(response.data);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Fetch recent sales for today
    useEffect(() => {
        const fetchRecentSales = async () => {
            try {
                setIsLoading(true);
                const today = new Date().toISOString().split('T')[0];
                const response = await reportsAPI.getRecentReports();
                if (response.success && Array.isArray(response.data)) {
                    setRecentSales(response.data);
                } else {
                    setRecentSales([]);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching recent sales:', error);
                setRecentSales([]);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };

        if (!selectedOption) {
            fetchRecentSales();
        }
    }, [selectedOption]);

    // Fetch items when customer is selected
    useEffect(() => {
        fetchItems();
    }, [selectedOption])

    const fetchItems = async () => {
        if (selectedOption !== "") {
            setIsLoading(true);
            try {
                const response = await cartAPI.getItems(selectedOption);
                if (response.success && response.data && response.data.length > 0) {
                    let total = 0;
                    response.data.forEach((d) => {
                        total += Number(d.totalAmount) || 0;
                    });
                    setItems(response.data);
                    setGrandTotal(total);
                } else {
                    setItems([]);
                    setGrandTotal(0);
                }
            } catch (error) {
                setItems([]);
                setGrandTotal(0);
            } finally {
                setIsLoading(false);
            }
        } else {
            setItems([]);
            setGrandTotal(0);
        }
    };

    return (
        <>
            <Header />
            <Toast ref={toast} />
            <div className="home-container">


                <h2 className="home-heading">Build Your Order</h2>
                <div className="home-card">
                    <div className="row mb-3">
                        <div className="col-md-3 col-12 mb-3 mb-md-0">
                            <label htmlFor="customerSelect" className="form-label">Customer Name:</label>
                            <div className="customer-select-container">
                                <select id="customerSelect" className="form-control" value={selectedOption} onChange={handleSelectChange}>
                                    <option value="">Select Customer...</option>
                                    {customers.map((customer) => (
                                        <option key={customer.customerId} value={customer.customerId}> {customer.name}</option>
                                    ))}
                                </select>
                                <button className="add-customer-icon-btn" onClick={() => setShowAddCustomerModal(true)} title="Add new customer"><AiOutlinePlus /> </button>
                            </div>
                        </div>

                        {selectedOption &&
                            <div className="col-md-3 col-12 mb-3 mb-md-0">
                                <label htmlFor="address" className="form-label">Address:</label>
                                <p className="form-control form-value">{address}</p>
                            </div>
                        }
                        {selectedOption &&
                            <div className="col-md-3 col-12 mb-3 mb-md-0">
                                <label htmlFor="contactNo" className="form-label">Contact No:</label>
                                <p className="form-control form-value">{contactNo}</p>
                            </div>
                        }
                        {selectedOption &&
                            <div className="col-md-3 col-12">
                                <label htmlFor="date" className="form-label">Order Date:</label>
                                <input type="date" id="date" className="form-control" value={date} onChange={(e) => setDateChange(e.target.value)} />
                            </div>
                        }
                    </div>

                    {isLoading && (
                        <>
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration=".8s" />
                            </div>
                            <h4 className="loading-text">Loading Data...</h4>
                        </>
                    )}

                    {!isLoading && !selectedOption && recentSales.length > 0 && (
                        <div className="recent-sales-container mt-4">
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Recent Purchases</h4>
                            <DataTable value={recentSales} paginator rows={5} responsiveLayout="scroll" stripedRows className="customer-table" emptyMessage="No Products found">
                                <Column field="productName" header="Product Name" />
                                <Column field="customerName" header="Customer Name" />
                                <Column field="quantity" header="Quantity" />
                                <Column header="Date" body={(rowData) => new Date(rowData.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} />
                                <Column header="Total Amount" body={(rowData) => `₹${parseInt(rowData.totalAmount).toFixed(0)}`} />
                            </DataTable>
                        </div>
                    )}

                    {!isLoading && !selectedOption && recentSales.length === 0 && (
                        <div className="empty-state">
                            <i className="pi pi-shopping-cart" />
                            <p className="empty-message">No data found yet. Add a customer and start building your order.</p>
                        </div>
                    )}

                    {showProductCart && (
                        <div className="addButtons">
                            <button type="button" onClick={productButtonClick} className="add-button">Add Product To Cart +</button>
                        </div>
                    )}



                    {!isLoading && showProductCart && (
                        <div className="d-flex flex-column cart-section">
                            <div className="mobile-table">
                                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Cart Items</h4>
                                {items.length === 0 && (
                                    <div className="empty-cart">
                                        <p className="error-message">No items in your cart</p>
                                    </div>
                                )}
                                {items.length > 0 && (
                                    <>
                                        <DataTable value={items} paginator rows={5} responsiveLayout="scroll" stripedRows className="customer-table" emptyMessage="No items in your cart">
                                            <Column header="Date" body={(rowData) => new Date(rowData.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} />
                                            <Column field="productName" header="Product Name" />
                                            <Column field="price" header="Price" />
                                            <Column field="quantity" header="Quantity" />
                                            <Column field="totalAmount" header="Total Amount" />
                                            <Column header="Actions" body={(rowData) => (
                                                !isMobile ? (
                                                    <>
                                                        <button type="button" className="btn btn-primary mx-2" onClick={() => handleEdit(rowData)}>Edit</button>
                                                        <button type="button" className="btn btn-danger " onClick={() => handleDelete(rowData.itemId)}>Remove</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <GrUpdate className="action-button update-button mx-2" onClick={() => handleEdit(rowData)} />
                                                        <MdDelete className="action-button delete-button" onClick={() => handleDelete(rowData.itemId)} />
                                                    </>
                                                )
                                            )} />
                                        </DataTable>

                                        <div className="grand-total">
                                            Grand Total: ₹{grandTotal.toFixed(2)}
                                        </div>

                                        <div className="d-flex justify-content-end mt-4">
                                            <button type="button" className="proceed-button" onClick={proceedToBuy}>Proceed To Checkout</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Dialog visible={visible} style={{ width: isMobile ? '100vw' : "80vw" }} onHide={() => setVisible(false)}>
                <Shopping customerId={selectedOption} date={date} onHide={onHide} itemsAddedToCart={itemsAddedToCart} />
            </Dialog>

            <Dialog visible={visibleEdit} style={{ width: isMobile ? '100vw' : "80vw" }} onHide={() => setVisibleEdit(false)} >
                {selectedRowData && (
                    <Shopping customerId={selectedOption} date={date} onHide={onHide} itemsAddedToCart={itemsAddedToCart} editMode={true} itemData={selectedRowData} />
                )}
            </Dialog>
            <AddCustomerModal visible={showAddCustomerModal} onHide={() => setShowAddCustomerModal(false)} onCustomerAdded={handleCustomerAdded} />
        </>
    );
}

export default Home;