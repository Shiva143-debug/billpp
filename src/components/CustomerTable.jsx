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
            (item.contact_no && String(item.contact_no).includes(searchTerm))
        );
    });

    const fetchCustomerData = async () => {
        setIsLoading(true);
        try {
            const response = await customerAPI.getCustomers();
            if (Array.isArray(response.data)) {
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
                    await customerAPI.deleteCustomer(rowData.customer_id);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Customer deleted successfully' });
                    fetchCustomerData();
                } catch (error) {
                    console.error('Error deleting customer:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer' });
                }
            }
        });
    };

    const actionsTemplate = (rowData) => {
        return (
            <div className="table-actions">
                <button type="button" className="action-btn action-edit" title="Edit Customer" onClick={() => onEditCustomer(rowData)}>
                    <MdEdit />
                </button>
                <button type="button" className="action-btn action-delete" title="Delete Customer" onClick={() => handleDelete(rowData)}>
                    <MdDelete />
                </button>
            </div>
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
                        <Column field="contact_no" header="Contact Number" />
                        <Column header="Actions" body={actionsTemplate} style={{ width: '120px', textAlign: 'center' }} />
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
