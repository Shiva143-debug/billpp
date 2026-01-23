import React, { useState, useRef } from "react";
import { TabMenu } from 'primereact/tabmenu';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import CustomerTable from "./CustomerTable";
import ProductTable from "./ProductTable";
import AddCustomerModal from "./AddCustomerModal";
import AddProductModal from "./AddProductModal";
import Header from "./Header";
import "../styles/Details.css";

const Details = () => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [customerSearch, setCustomerSearch] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const tabItems = [
        { label: 'Customer Details', icon: 'pi pi-users' },
        { label: 'Product Details', icon: 'pi pi-shopping-bag' }
    ];

    const handleTabChange = (e) => {
        setActiveTabIndex(e.index);
    };

    const handleCustomerAdded = () => {
        setShowAddCustomerModal(false);
        setRefreshKey(prev => prev + 1);
    };

    const handleProductAdded = () => {
        setShowAddProductModal(false);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div >
            <Header />
            <div className="details-container">
                <Card className="details-card">
                    <TabMenu model={tabItems} activeIndex={activeTabIndex} onTabChange={handleTabChange} className="tab-container" />
                    <div className="details-header d-flex justify-content-between align-items-center mb-4 mt-4 mx-3">
                        <div className="search-container" style={{ margin: 0 }}>
                            <span className="p-input-icon-left">
                                {activeTabIndex === 0 ? (
                                    <InputText value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} placeholder="Search customers..." className="search-input" />
                                ) : (
                                    <InputText value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products..." className="search-input" />
                                )}
                            </span>
                        </div>
                        {activeTabIndex === 0 && (
                            <button className="btn btn-success" onClick={() => setShowAddCustomerModal(true)} > + Add Customer</button>
                        )}
                        {activeTabIndex === 1 && (
                            <button className="btn btn-success" onClick={() => setShowAddProductModal(true)}> + Add Product</button>
                        )}
                    </div>

                    <div className="content-container" key={refreshKey}>
                        {activeTabIndex === 0 ? (
                            <CustomerTable searchTerm={customerSearch} />
                        ) : (
                            <ProductTable searchTerm={productSearch} />
                        )}
                    </div>
                </Card>
            </div>
            <AddCustomerModal visible={showAddCustomerModal} onHide={() => setShowAddCustomerModal(false)} onCustomerAdded={handleCustomerAdded} />
            <AddProductModal visible={showAddProductModal} onHide={() => setShowAddProductModal(false)} onProductAdded={handleProductAdded} />
        </div>
    );
};

export default Details;