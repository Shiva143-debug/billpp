import { useState, useRef, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { customerAPI } from '../services/apiService';
import "../styles/Customer.css";

function AddCustomerModal({ visible, onHide, onCustomerAdded, editMode = false, customerData = null }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [active, setActive] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const toast = useRef(null);

    useEffect(() => {
        if (visible) {
            if (editMode && customerData) {
                setName(customerData.name || "");
                setAddress(customerData.address || "");
                setContactNo(customerData.contactNo || "");
                setActive(customerData.active === true || customerData.active === 1 || customerData.active === 'true');
            } else {
                handleClear();
            }
        }
    }, [visible, editMode, customerData]);

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

        const customerDataPayload = editMode && customerData ? { name, address, contactNo, active } : { name, address, contactNo };

        setIsLoading(true);
        try {
            let response;
            if (editMode && customerData) {
                response = await customerAPI.updateCustomer(customerData.customerId, customerDataPayload);
            } else {
                response = await customerAPI.addCustomer(customerDataPayload);
            }

            if (response.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
                handleClear();
                onCustomerAdded();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.message || "Failed to save customer" });
            }
        } catch (error) {
            console.error('Error saving customer:', error);
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
        setActive(true);
    };

    const handleDialogHide = () => {
        handleClear();
        onHide();
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} onHide={handleDialogHide} header={editMode ? "Update Customer" : "Add New Customer"} modal
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
                    {editMode && (
                        <div className="form-group">
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
                                {editMode ? 'Update Customer' : 'Add Customer'}
                            </button>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default AddCustomerModal;
