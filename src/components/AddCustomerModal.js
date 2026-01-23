import { useState, useRef } from "react";
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../services/apiService';
import "../styles/Customer.css";

function AddCustomerModal({ visible, onHide, onCustomerAdded }) {
    const { userId } = useAuth();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toast = useRef(null);

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

        const customerData = { id: userId, name, address, contactNo };

        setIsLoading(true);
        try {
            await customerAPI.addCustomer(customerData);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Customer added successfully' });
            handleClear();
            onCustomerAdded();
        } catch (error) {
            console.error('Error adding customer:', error);
            const errorMessage = error.response?.data?.message || "Contact number already exists in the table";
            toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setName("");
        setAddress("");
        setContactNo("");
    };

    const handleDialogHide = () => {
        handleClear();
        onHide();
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} onHide={handleDialogHide} header="Add New Customer" modal
                style={{ width: '90vw', maxWidth: '600px' }} className="modal-dialog" appendTo={document.body}>
                <div className="customer-form">
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
                        <input id="contactNo" type="text" placeholder="Enter contact number" className="form-control" value={contactNo} onChange={handleContactChange} maxLength={10} />
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
                            <button className="btn btn-primary mb-2" onClick={handleSubmit}>Add Customer</button>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default AddCustomerModal;
