import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { customerAPI } from "../services/apiService";
import { ProgressSpinner } from "primereact/progressspinner";
import "../styles/Details.css"

function CustomerTable() {
    const { userId } = useAuth();

    const [Data, setData] = useState([])
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchCustomerData = async () => {
            setIsLoading(true);
            try {
                const response = await customerAPI.getCustomers(userId);
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
            fetchCustomerData();
        }
    }, [userId]);

    return (

        <div >
            <h2 className="customer-heading">Customer&nbsp;Details</h2>
            {errorMessage && <p>{errorMessage}</p>}
            {isLoading &&
                <div className="spinner-container">
                    <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                </div>
            }

            {Data.length > 0 && (
                <div className="card">
                    <DataTable value={Data} paginator rows={5} responsiveLayout="scroll" stripedRows className="customer-table" emptyMessage="No Customers found">
                        <Column field="name" header="Name" />
                        <Column field="address" header="Address" />
                        <Column field="contact_no" header="Contact Number" />
                    </DataTable>
                </div>
            )}

        </div>


    );

}

export default CustomerTable