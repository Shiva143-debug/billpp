import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { AiOutlinePlus } from "react-icons/ai";
import { useAuth } from '../context/AuthContext';
import { customerAPI, cartAPI, productAPI, reportsAPI } from '../services/apiService';
import Header from './Header';
import Shopping from './Shopping';
import AddCustomerModal from './AddCustomerModal';
import "../styles/Home.css";

function Home() {
    const { userId } = useAuth();
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

    console.log("userId", userId)
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:768px)');

    const productButtonClick = () => {
        setVisible(true);
    };

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        const selectedData = customers.find(d => d.name === selectedValue);
        setAddress(selectedData ? selectedData.address : "");
        setContactNo(selectedData ? selectedData.contact_no : "");
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
            await cartAPI.deleteItem(itemId, userId);
            toast.current.show({ severity: 'success', summary: 'Success', detail: "Item Removed From Cart successfully" });
            setItems((prevItems) => prevItems.filter((item) => item.item_id !== itemId));
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
        const orderDetails = { selectedOption, address, contactNo, grandTotal, items, date };

        const processItems = async () => {
            setIsLoading(true);
            let allItemsProcessed = true;

            for (const item of orderDetails.items) {
                try {
                    const deductValues = { productName: item.product_name, quantity: item.quantity };
                    const response = await productAPI.deductProductQuantity(userId, deductValues);
                    if (response.data.message && response.data.message.includes("greater than what the store has in stock")) {
                        toast.current.show({ severity: 'warn', summary: 'Warning', detail: response.data.message });
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
            const response = await customerAPI.getCustomers(userId);
            if (Array.isArray(response.data)) {
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
        if (userId) {
            fetchCustomers();
        }
    }, [userId]);

    // Fetch recent sales for today
    useEffect(() => {
        const fetchRecentSales = async () => {
            try {
                setIsLoading(true);
                const today = new Date().toISOString().split('T')[0];
                const response = await reportsAPI.getRecentReports(userId);
                if (Array.isArray(response.data)) {
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

        if (userId && !selectedOption) {
            fetchRecentSales();
        }
    }, [userId, selectedOption]);

    // Fetch items when customer is selected
    useEffect(() => {
        fetchItems();
    }, [selectedOption, userId])

    const fetchItems = async () => {
        if (selectedOption !== "") {
            setIsLoading(true);
            try {
                const response = await cartAPI.getItems(userId, selectedOption);
                if (response.data && response.data.length > 0) {
                    let total = 0;
                    response.data.forEach((d) => {
                        total += d.total_amount;
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
                                        <option key={customer.customer_id} value={customer.name}> {customer.name}</option>
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
                            <div className="table-responsive">
                                <table className="cart-table">
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Customer Name</th>
                                            <th>Quantity</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentSales.map((sale, i) => (
                                            <tr key={i}>
                                                <td>{sale.product_name}</td>
                                                <td>{sale.name}</td>
                                                <td>{sale.quantity}</td>
                                                <td>₹{parseFloat(sale.total_amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {showProductCart && (
                        <div className="addButtons">
                            <button type="button" onClick={productButtonClick} className="add-button">Add Product To Cart +</button>
                        </div>
                    )}



                    {!isLoading && showProductCart && (
                        <div className="d-flex flex-column">
                            <div className="mobile-table">
                                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Cart Items</h4>
                                {items.length === 0 && (
                                    <p className="error-message">No items in your cart</p>
                                )}
                                {items.length > 0 && (
                                    <>
                                        <div className="table-responsive">
                                            <table className="cart-table">
                                                <thead>
                                                    <tr>
                                                        <th>Product Name</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Total Amount</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items.map((item, i) => (
                                                        <tr key={i}>
                                                            <td>{item.product_name}</td>
                                                            <td>{item.price}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.total_amount}</td>
                                                            <td>
                                                                {!isMobile ? (
                                                                    <>
                                                                        <button type="button" className="btn btn-primary mx-2" onClick={() => handleEdit(item)}>Edit</button>
                                                                        <button type="button" className="btn btn-danger " onClick={() => handleDelete(item.item_id)}>Remove</button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <GrUpdate className="action-button update-button mx-2" onClick={() => handleEdit(item)} />
                                                                        <MdDelete className="action-button delete-button" onClick={() => handleDelete(item.item_id)} />
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

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
                <Shopping id={userId} name={selectedOption} date={date} onHide={onHide} itemsAddedToCart={itemsAddedToCart} />
            </Dialog>

            <Dialog visible={visibleEdit} style={{ width: isMobile ? '100vw' : "80vw" }} onHide={() => setVisibleEdit(false)} >
                {selectedRowData && (
                    <Shopping id={userId} name={selectedOption} date={date} onHide={onHide} itemsAddedToCart={itemsAddedToCart} editMode={true} itemData={selectedRowData} />
                )}
            </Dialog>
            <AddCustomerModal visible={showAddCustomerModal} onHide={() => setShowAddCustomerModal(false)} onCustomerAdded={handleCustomerAdded} />
        </>
    );
}

export default Home;