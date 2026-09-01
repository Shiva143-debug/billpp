import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useState, useEffect, useRef } from "react";
import { customerAPI } from "../services/apiService";
import { ProgressSpinner } from "primereact/progressspinner";
import { MdEdit, MdDelete } from "react-icons/md";
import "../styles/Details.css"

function CustomerTable({ searchTerm = "", onEditCustomer }) {
    const [Data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef(null);

    const filteredData = Data.filter(item => {
        return (
            (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.contactNo && String(item.contactNo).includes(searchTerm))
        );
    });

    const fetchCustomerData = async () => {
        setIsLoading(true);
        try {
            const response = await customerAPI.getAllCustomers();
            if (response.success && Array.isArray(response.data)) {
                setData(response.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, []);

    const handleDelete = (rowData) => {
        confirmDialog({
            message: `Are you sure you want to delete customer "${rowData.name}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    const response = await customerAPI.deleteCustomer(rowData.customerId);
                    if (response.success) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
                        fetchCustomerData();
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: response.message });
                    }
                } catch (error) {
                    console.error('Error deleting customer:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer' });
                }
            }
        });
    };

    const actionsTemplate = (rowData) => {
        const isActive = rowData.active === true || rowData.active === 1 || rowData.active === 'true';
        return (
            <div className="table-actions">
                <button type="button" className="action-btn action-edit" title="Edit Customer" onClick={() => onEditCustomer(rowData)}>
                    <MdEdit />
                </button>
                {isActive && (
                    <button type="button" className="action-btn action-delete" title="Delete Customer" onClick={() => handleDelete(rowData)}>
                        <MdDelete />
                    </button>
                )}
            </div>
        );
    };

    const statusTemplate = (rowData) => {
        const isActive = rowData.active === true || rowData.active === 1 || rowData.active === 'true';
        return (
            <span className={`customer-status ${isActive ? 'customer-status-active' : 'customer-status-inactive'}`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            {isLoading &&
                <>
                    <div className="spinner-container">
                        <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                    </div>
                    <h4 className="loading-text">Loading Customers Data...</h4>
                </>
            }

            {!isLoading && Data.length > 0 && (
                <div className="card">
                    <DataTable value={filteredData} paginator rows={5} responsiveLayout="scroll" stripedRows className="customer-table" emptyMessage="No Customers found">
                        <Column field="name" header="Name" />
                        <Column field="address" header="Address" />
                        <Column field="contactNo" header="Contact Number" />
                        <Column header="Status" body={statusTemplate} />
                        <Column header="Actions" body={actionsTemplate} style={{ width: '120px', textAlign: 'left' }} />
                    </DataTable>
                </div>
            )}

            {!isLoading && Data.length === 0 && (
                <div className="table-empty-state">
                    <i className="pi pi-users" />
                    <p>No customers found. Add your first customer to get started.</p>
                </div>
            )}
        </div>
    );
}

export default CustomerTable
