import { useState, useEffect } from "react"
import { productAPI } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import "../styles/Details.css"
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


const ProductTable = () => {
    const { userId } = useAuth();
    const [Data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);


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
            <h2 className="customer-heading">Products&nbsp; Details</h2>
            {errorMessage && <p>{errorMessage}</p>}

            {isLoading &&
                <div className="spinner-container">
                    <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                </div>
            }

            {Data.length > 0 && (
                <div className="card">
                    <DataTable value={Data} paginator rows={5} responsiveLayout="scroll" stripedRows className="customer-table" emptyMessage="No Customers found">
                        <Column field="product_name" header="Product" />
                        <Column field="selling_price" header="Price" />
                        <Column field="quantity" header="Quantity" />
                    </DataTable>
                </div>
            )}
        </div>
    );
}


export default ProductTable