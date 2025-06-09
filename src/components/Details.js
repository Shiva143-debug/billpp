import React, { useState } from "react";
import { TabMenu } from 'primereact/tabmenu';
import { Card } from 'primereact/card';
import CustomerTable from "./CustomerTable";
import ProductTable from "./ProductTable";
import Header from "./Header";
import "../styles/Details.css";

const Details = () => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    
    const tabItems = [
        { label: 'Customer Details', icon: 'pi pi-users' },
        { label: 'Product Details', icon: 'pi pi-shopping-bag' }
    ];
    
    const handleTabChange = (e) => {
        setActiveTabIndex(e.index);
    };
    
    return (
        <div className="details-container">
            <Header />
            
            <Card className="details-card">
                {/* <h2 className="details-heading">Details</h2> */}
                
                <TabMenu  model={tabItems}  activeIndex={activeTabIndex}  onTabChange={handleTabChange}  className="tab-container"/>
                
                <div className="content-container">
                    {activeTabIndex === 0 ? (<CustomerTable  />) : (<ProductTable  />)}
                </div>
            </Card>
        </div>
    );
};

export default Details;