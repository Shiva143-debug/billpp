import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../services/apiService';
import Header from './Header';
import "../styles/Customer.css";

function Customer() {
    const { userId } = useAuth();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toast = useRef(null);
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:768px)');

    const handleContactChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10 && /^\d*$/.test(value)) {
            setContactNo(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter name' });
            return;
        }
        else if (!address) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter address' });
            return;
        }
        else if (!contactNo) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter contact number' });
            return;
        }

        const customerData = {id:userId, name, address, contactNo };

        setIsLoading(true);
        try {
            await customerAPI.addCustomer(customerData);
            toast.current.show({severity: 'success',summary: 'Success',detail: 'Customer added successfully'});
            handleClear()
        } catch (error) {
            console.error('Error adding customer:', error);
            const errorMessage = error.response?.data?.message || "Contact number already exists in the table";
            toast.current.show({severity: 'error',summary: 'Error',detail: errorMessage});
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setName("");
        setAddress("");
        setContactNo("");
    };

    return (
        <>
            <Header />
            <Toast ref={toast} />

            <div className="customer-container">
                <div className="customer-card">
                    <h2 className="customer-heading">Add Customer</h2>

                    <div className="customer-form" >
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name:</label>
                            <input id="name" type="text" placeholder="Enter customer name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address" className="form-label">Address:</label>
                            <input id="address" type="text" placeholder="Enter customer address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contactNo" className="form-label">Contact No:</label>
                            <input id="contactNo" type="text" placeholder="Enter contact number (max 10 digits)" className="form-control" value={contactNo} onChange={handleContactChange} maxLength={10} />
                            <small className="form-text">Only up to 10 digits are allowed</small>
                        </div>

                        <div className="d-flex justify-content-between flex-wrap mt-4">
                            {/* <button  type="button"  onClick={handleBack}  className="back-button" disabled={isLoading}>Back</button> */}
                            <button type="button" onClick={handleClear} className="btn btn-secondary mb-2" disabled={isLoading}>Clear</button>
                            {isLoading ? (
                                <div className="spinner-container">
                                    <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                                </div>
                            ) : (
                                <button className="btn btn-primary mb-2" onClick={handleSubmit}> Add Customer</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Customer;