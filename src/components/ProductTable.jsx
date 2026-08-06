import { useState, useEffect, useRef } from "react"
import { productAPI } from "../services/apiService";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { MdEdit, MdDelete } from "react-icons/md";
import "../styles/Details.css"


const ProductTable = ({ searchTerm = "", onEditProduct }) => {
    const [Data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef(null);

    const filteredData = Data.filter(item => {
        return (
            (item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.selling_price && String(item.selling_price).includes(searchTerm)) ||
            (item.quantity && String(item.quantity).includes(searchTerm))
        );
    });

    const fetchProductData = async () => {
        setIsLoading(true);
        try {
            const response = await productAPI.getProducts();
            if (Array.isArray(response.data)) {
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
            message: `Are you sure you want to delete product "${rowData.product_name}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await productAPI.deleteProduct(rowData.product_id);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully' });
                    fetchProductData();
                } catch (error) {
                    console.error('Error deleting product:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete product' });
                }
            }
        });
    };

    const actionsTemplate = (rowData) => {
        return (
            <div className="table-actions">
                <button type="button" className="action-btn action-edit" title="Edit Product" onClick={() => onEditProduct(rowData)}>
                    <MdEdit />
                </button>
                <button type="button" className="action-btn action-delete" title="Delete Product" onClick={() => handleDelete(rowData)}>
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
                    <h4 className="loading-text">Loading Products Data...</h4>
                </>
            }

            {!isLoading && Data.length > 0 && (
                <div className="card">
                    <DataTable value={filteredData} paginator rows={5} responsiveLayout="scroll" stripedRows className="customer-table" emptyMessage="No Products found">
                        <Column field="product_name" header="Product Name" />
                        <Column field="selling_price" header="Selling Price" />
                        <Column field="quantity" header="Quantity" />
                        {/* <Column header="Actions" body={actionsTemplate} style={{ width: '120px', textAlign: 'center' }} /> */}
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
