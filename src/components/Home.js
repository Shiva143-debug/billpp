import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { useAuth } from '../context/AuthContext';
import { customerAPI, itemsAPI, productAPI } from '../services/apiService';
import Header from './Header';
import Shopping from './Shopping';
import "../styles/Home.css";

function Home() {
    const { userId } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [address, setAddress] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [date, setDateChange] = useState(new Date().toISOString().split('T')[0]);
    const [grandTotal, setGrandTotal] = useState(0);

    const [items, setItems] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

    const [showProductCart, setShowProductCart] = useState(false);
    const toast = useRef(null);

    const [errorMessage, setErrorMessage] = useState(null);

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
            await itemsAPI.deleteItem(itemId, userId);
            toast.current.show({ severity: 'success', summary: 'Success', detail: "Item Deleted successfully" });
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
    useEffect(() => {
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

        if (userId) {
            fetchCustomers();
        }
    }, [userId]);

    // Fetch items when customer is selected
    useEffect(() => {
        fetchItems();
    }, [selectedOption, userId])

    const fetchItems = async () => {
        if (selectedOption !== "select") {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await itemsAPI.getItems(userId, selectedOption);
                console.log('Response Data:', response.data);

                if (response.data && response.data.length > 0) {
                    let total = 0;
                    response.data.forEach((d) => {
                        total += d.total_amount;
                    });
                    setItems(response.data);
                    setGrandTotal(total);
                } else {
                    setErrorMessage("No records found");
                    setItems([]);
                    setGrandTotal(0);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
                setErrorMessage("An error occurred while fetching data");
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
                <h2 className="home-heading">ADD PRODUCTS INTO CART</h2>
                <div className="home-card">

                    <div className="row mb-3">
                        <div className="col-md-3 col-12 mb-3 mb-md-0">
                            <label htmlFor="customerSelect" className="form-label">Name:</label>
                            <select id="customerSelect" className="form-control" value={selectedOption} onChange={handleSelectChange}>
                                <option value="">Please Select Name</option>
                                {customers.map((customer) => (
                                    <option key={customer.customer_id} value={customer.name}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
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
                                <label htmlFor="date" className="form-label">Date:</label>
                                <input type="date" id="date" className="form-control" value={date} onChange={(e) => setDateChange(e.target.value)} />
                            </div>
                        }
                    </div>

                    {showProductCart && (
                        <div className="addButtons">
                            <button type="button" onClick={productButtonClick} className="add-button"> ADD ITEMS +</button>
                        </div>
                    )}

                    {isLoading && (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".5s" />
                        </div>
                    )}

                    {!isLoading && showProductCart && (
                        <div className="d-flex flex-column">
                            <div className="mobile-table">
                                <h1 className="h1">Products in Cart</h1>

                                {/* {errorMessage && items.length === 0 && (
                                    <p className="error-message">{errorMessage}</p>
                                )} */}

                                {items.length === 0 && (
                                    <p className="error-message">No items in the cart</p>
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
                                                                        <button type="button" className="btn btn-danger me-2" onClick={() => handleDelete(item.item_id)}>Delete</button>
                                                                        <button type="button" className="btn btn-primary" onClick={() => handleEdit(item)}> Edit</button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <MdDelete className="action-button delete-button me-2" onClick={() => handleDelete(item.item_id)} />
                                                                        <GrUpdate className="action-button update-button" onClick={() => handleEdit(item)} />
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
                                            <button type="button" className="proceed-button" onClick={proceedToBuy}> Proceed to Buy</button>
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
        </>
    );
}

export default Home;