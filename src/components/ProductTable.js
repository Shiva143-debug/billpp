import { useState, useEffect } from "react"
import { productAPI } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../styles/Details.css"


const ProductTable = ({ searchTerm = "" }) => {
    const { userId } = useAuth();
    const [Data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const filteredData = Data.filter(item => {
        return (
            (item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.selling_price && String(item.selling_price).includes(searchTerm)) ||
            (item.quantity && String(item.quantity).includes(searchTerm))
        );
    });

    useEffect(() => {
        const fetchProductData = async () => {
            setIsLoading(true);
            try {
                const response = await productAPI.getProducts(userId);
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

        if (userId) {
            fetchProductData();
        }
    }, [userId]);

    return (
        <div>
            {errorMessage && <p>{errorMessage}</p>}

            {isLoading &&
                <>
                    <div className="spinner-container">
                        <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                    </div>
                    <h4 className="loading-text">Loading Products Data...</h4>
                </>
            }

            {Data.length > 0 && (
                <div className="card">
                    <DataTable value={filteredData} paginator rows={5} responsiveLayout="scroll" stripedRows className="customer-table" emptyMessage="No Products found">
                        <Column field="product_name" header="Product Name" />
                        <Column field="selling_price" header="Selling Price" />
                        <Column field="quantity" header="Quantity" />
                    </DataTable>
                </div>
            )}
        </div>
    );
}


export default ProductTable