import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { TbHome, TbReportSearch } from "react-icons/tb";
import { FaFileInvoice } from "react-icons/fa";
import { BiSolidDetail } from "react-icons/bi";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '../context/AuthContext';
import "../styles/Header.css";

const Header = () => {
    const location = useLocation();
    const [activeButton, setActiveButton] = useState(getActiveButton(location.pathname));
    const navigate = useNavigate();
    const toast = useRef(null);
    const { logout } = useAuth();
    const isMobile = useMediaQuery('(max-width:768px)');

    const accept = () => {
        toast.current.show({ severity: 'success', summary: 'Confirmed', detail: 'You have logged out successfully', life: 3000 });
        logout();
        setTimeout(() => {
            navigate("/");
        }, 1000);
    };

    const reject = () => {
        toast.current.show({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Logout cancelled',
            life: 3000
        });
    };

    const onClickLogout = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to logout?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    function getActiveButton(pathname) {
        switch (pathname) {
            case "/home": return "home";
            case "/reports": return "reports";
            case "/details": return "details";
            default: return "home";
        }
    }

    return (
        <nav className="nav-header">
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="nav-content">
                <Link to="/home" className="logo-link">
                    <div className="logo-container">
                        <div className="logo-badge">
                            <FaFileInvoice className="logo-icon" />
                        </div>
                        <div className="logo-text">
                            <span className="logo-brand">Bill</span>
                            <span className="logo-accent">Pro</span>
                        </div>
                    </div>
                </Link>
                {!isMobile && (
                    <ul className="nav-menu">
                        <li><Link to="/home" onClick={() => setActiveButton("home")} className={activeButton === "home" ? "active-nav" : ""}>Home</Link></li>
                        <li><Link to="/reports" onClick={() => setActiveButton("reports")} className={activeButton === "reports" ? "active-nav" : ""}>Reports</Link></li>
                        <li><Link to="/details" onClick={() => setActiveButton("details")} className={activeButton === "details" ? "active-nav" : ""}>Details</Link></li>
                    </ul>
                )}

                {!isMobile && <button type="button" className="logout-desktop-btn" onClick={onClickLogout}> Logout </button>}
                {isMobile && <img src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png" alt="nav logout" className="nav-bar-img" onClick={onClickLogout} />}
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <div className="nav-menu-mobile">
                    <ul className="nav-menu-list-mobile">
                        <li><Link to="/home" onClick={() => setActiveButton("home")} className={activeButton === "home" ? "active-nav" : ""}><TbHome className="nav-icon" /></Link></li>
                        <li><Link to="/reports" onClick={() => setActiveButton("reports")} className={activeButton === "reports" ? "active-nav" : ""}><TbReportSearch className="nav-icon" /></Link></li>
                        <li><Link to="/details" onClick={() => setActiveButton("details")} className={activeButton === "details" ? "active-nav" : ""}><BiSolidDetail className="nav-icon" /></Link></li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Header;
