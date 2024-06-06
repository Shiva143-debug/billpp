import { Link, useNavigate, useLocation } from 'react-router-dom'
import React, { useRef, useState } from 'react';
import "./Header.css"
import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { MdProductionQuantityLimits } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { TbReportSearch } from "react-icons/tb";
import { FaFileInvoice } from "react-icons/fa";
import { BiSolidDetail } from "react-icons/bi";
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';


const Header = () => {
    const location = useLocation();
    const [activeButton, setActiveButton] = useState(getActiveButton(location.pathname));
    const navigate = useNavigate();
    const toast = useRef(null);
    const accept = () => {
        toast.current.show({ severity: 'success', summary: 'Confirmed', detail: 'You have LoggedOut successflly', life: 3000 });
        setTimeout(() => {
            navigate("/");
        }, 1000)

    };

    const reject = () => {
        toast.current.show({ severity: 'success', summary: 'Rejected', detail: 'You have not Logout', life: 3000 });
    };


    const onClickLogout = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to Logout?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };

    function getActiveButton(pathname) {
        switch (pathname) {
            case "/home":
                return "home";
            case "/product":
                return "product";
            case "/customer":
                return "customer";
            case "/reports":
                return "reports";
            case "/invoice":
                return "invoice";
            case "/details":
                return "details";
            default:
                return "home";
        }
    }

    const isMobile = useMediaQuery('(max-width:768px)');
    return (
        <nav className="nav-header">
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="nav-content">
                <div className="nav-bar-mobile-logo-container">
                    <Link to="/home">
                        <img
                            className="website-logo"
                            src="https://res.cloudinary.com/dxgbxchqm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1716964033/large_xjsnwr.png"
                            alt="website logo"
                        />
                    </Link>

                    <button
                        type="button"
                        className="nav-mobile-btn"
                        onClick={onClickLogout}
                    >
                        <img
                            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
                            alt="nav logout"
                            className="nav-bar-img"
                        />
                    </button>
                </div>

                <div className="nav-bar-large-container">
                    <Link to="/home">
                        <div style={{ display: "flex", marginLeft: "-150px" }}>
                            <h3>Biiling App</h3>
                            <img
                                className="website-logo"
                                src="https://res.cloudinary.com/dxgbxchqm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1716964033/large_xjsnwr.png"
                                alt="website logo"
                            />
                        </div>
                    </Link>
                    <ul className="nav-menu" style={{ marginRight: "-150px" }}>
                        <li className='nav-menu-item'>
                            <Link to="/home" onClick={() => setActiveButton("home")} className={`${activeButton === 'home' ? "active-Nav" : "n"}`}>
                                Home
                            </Link>
                        </li>

                        <li className='nav-menu-item'>
                            <Link to="/product" onClick={() => setActiveButton("product")} className={`${activeButton === 'product' ? "active-Nav" : "n"}`}>
                                Products
                            </Link>
                        </li>

                        <li className='nav-menu-item'>
                            <Link to="/customer" onClick={() => setActiveButton("customer")} className={`${activeButton === 'customer' ? "active-Nav" : "n"}`}>
                                Customers
                            </Link>
                        </li>
                        <li className='nav-menu-item'>
                            <Link to="/reports" onClick={() => setActiveButton("reports")} className={`${activeButton === 'reports' ? "active-Nav" : "n"}`}>
                                Reports
                            </Link>
                        </li>

                        <li className='nav-menu-item'>
                            <Link to="/invoice" onClick={() => setActiveButton("invoice")} className={`${activeButton === 'invoice' ? "active-Nav" : "n"}`}>
                                Invoice
                            </Link>
                        </li>


                        <li className='nav-menu-item'>
                            <Link to="/details" onClick={() => setActiveButton("details")} className={`${activeButton === 'details' ? "active-Nav" : "n"}`}>
                                Details
                            </Link>
                        </li>
                        <button
                            type="button"
                            className="logout-desktop-btn"
                            onClick={onClickLogout}
                        >
                            Logout
                        </button>
                    </ul>

                </div>
            </div>
            <div className="nav-menu-mobile">
                <ul className="nav-menu-list-mobile">
                    <li className="nav-menu-item-mobile">
                        <Link to="/home" onClick={() => setActiveButton("home")} className={`${activeButton === 'home' ? "active-Nav" : "n"}`}>
                            <img
                                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
                                alt="nav home"
                                className="nav-bar-img"
                            />
                        </Link>
                    </li>

                    <li className="nav-menu-item-mobile">
                        <Link to="/product" onClick={() => setActiveButton("product")} className={`${activeButton === 'product' ? "active-Nav" : "n"}`}>
                            <MdProductionQuantityLimits />
                        </Link>
                    </li>
                    <li className="nav-menu-item-mobile">
                        <Link to="/customer" onClick={() => setActiveButton("customer")} className={`${activeButton === 'customer' ? "active-Nav" : "n"}`}>
                            <IoIosPeople />
                        </Link>
                    </li>

                    <li className="nav-menu-item-mobile">
                        <Link to="/reports" onClick={() => setActiveButton("reports")} className={`${activeButton === 'reports' ? "active-Nav" : "n"}`}>
                            <TbReportSearch />
                        </Link>
                    </li>

                    <li className="nav-menu-item-mobile">
                        <Link to="/details" onClick={() => setActiveButton("details")} className={`${activeButton === 'details' ? "active-Nav" : "n"}`}>
                            <BiSolidDetail />
                        </Link>
                    </li>

                </ul>
            </div>
        </nav>
    )
}

export default Header
