import React, { useState } from "react";
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
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
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
        setEditingCustomer(null);
        setRefreshKey(prev => prev + 1);
    };

    const handleProductAdded = () => {
        setShowAddProductModal(false);
        setEditingProduct(null);
        setRefreshKey(prev => prev + 1);
    };

    const handleEditCustomer = (rowData) => {
        setEditingCustomer(rowData);
        setShowAddCustomerModal(true);
    };

    const handleEditProduct = (rowData) => {
        setEditingProduct(rowData);
        setShowAddProductModal(true);
    };

    const handleAddCustomerModalHide = () => {
        setShowAddCustomerModal(false);
        setEditingCustomer(null);
    };

    const handleAddProductModalHide = () => {
        setShowAddProductModal(false);
        setEditingProduct(null);
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
                            <CustomerTable searchTerm={customerSearch} onEditCustomer={handleEditCustomer} />
                        ) : (
                            <ProductTable searchTerm={productSearch} onEditProduct={handleEditProduct} />
                        )}
                    </div>
                </Card>
            </div>
            <AddCustomerModal visible={showAddCustomerModal} onHide={handleAddCustomerModalHide} onCustomerAdded={handleCustomerAdded} editMode={!!editingCustomer} customerData={editingCustomer} />
            <AddProductModal visible={showAddProductModal} onHide={handleAddProductModalHide} onProductAdded={handleProductAdded} editMode={!!editingProduct} productData={editingProduct} />
        </div>
    );
};

export default Details;
