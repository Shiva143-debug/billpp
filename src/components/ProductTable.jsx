import { useState, useEffect, useRef } from "react"
import { productAPI } from "../services/apiService";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { MdDelete, MdEdit } from "react-icons/md";
import "../styles/Details.css"


const ProductTable = ({ searchTerm = "", onEditProduct }) => {
    const [Data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef(null);

    const filteredData = Data.filter(item => {
        return (
            (item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.sellingPrice && String(item.sellingPrice).includes(searchTerm)) ||
            (item.quantity && String(item.quantity).includes(searchTerm))
        );
    });

    const fetchProductData = async () => {
        setIsLoading(true);
        try {
            const response = await productAPI.getAllProducts();
            if (response.success && Array.isArray(response.data)) {
                setData(response.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    const handleDelete = (rowData) => {
        confirmDialog({
            message: `Are you sure you want to delete product "${rowData.productName}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    const response = await productAPI.deleteProduct(rowData.id);
                    if (response.success) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
                        fetchProductData();
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: response.message });
                    }
                } catch (error) {
                    console.error('Error deleting product:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete product' });
                }
            }
        });
    };

    const statusTemplate = (rowData) => {
        const isActive = rowData.active === true || rowData.active === 1 || rowData.active === 'true';
        return (
            <span className={`customer-status ${isActive ? 'customer-status-active' : 'customer-status-inactive'}`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    const actionsTemplate = (rowData) => {
        const isActive = rowData.active === true || rowData.active === 1 || rowData.active === 'true';
        return (
            <div className="table-actions">
                <button type="button" className="action-btn action-edit" title="Edit Product" onClick={() => onEditProduct(rowData)}>
                    <MdEdit />
                </button>
                {isActive && (
                    <button type="button" className="action-btn action-delete" title="Delete Product" onClick={() => handleDelete(rowData)}>
                        <MdDelete />
                    </button>
                )}
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
                    <h4 className="loading-text">Loading Products Data...</h4>
                </>
            }

            {!isLoading && Data.length > 0 && (
                <div className="card">
                    <DataTable value={filteredData} paginator rows={5} responsiveLayout="scroll" stripedRows className="customer-table" emptyMessage="No Products found">
                        <Column field="invoice" header="Invoice Number" />
                        <Column field="companyName" header="company Name" />
                        <Column field="productName" header="Product Name" />
                        <Column field="price" header="Price" />
                        <Column field="sellingPrice" header="Selling Price" />
                        <Column field="baseQuantity" header="Actual Quantity" />
                        <Column field="quantity" header="Current Quantity" />
                        <Column header="Status" body={statusTemplate} />
                        <Column header="Actions" body={actionsTemplate} style={{ width: '120px', textAlign: 'left' }} />
                    </DataTable>
                </div>
            )}

            {!isLoading && Data.length === 0 && (
                <div className="table-empty-state">
                    <i className="pi pi-shopping-bag" />
                    <p>No products found. Add your first product to get started.</p>
                </div>
            )}
        </div>
    );
}


export default ProductTable
