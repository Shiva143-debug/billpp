import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '../context/AuthContext';

import "../styles/Login.css";
import { authAPI } from '../services/apiService';
import { ProgressSpinner } from 'primereact/progressspinner';

function Login({ setUserId }) {
    const toast = useRef(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login');
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNumber] = useState("");
    const [address, setAddress] = useState("");
    const [userName, setLoginUserName] = useState("");
    const [password, setPassword] = useState("");

    const [showForget, setShowForget] = useState(false);
    const [updatedPassword, setUpdatedPassword] = useState("");
    const [updatedConfirmPassword, setUpdatedConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [loading, setIsLoading] = useState(false);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!fullName) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Full Name' });
            return;
        }
        else if (!email) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter email' });
            return;
        }
        else if (!mobileNo) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter mobile number' });
            return;
        }
        else if (!address) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter address' });
            return;
        }

        const userData = { FullName: fullName, email, mobileNo, address };

        try {
            setIsLoading(true);
            const response = await authAPI.register(userData);

            if (response.data.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: response.data.message });
                setFullName("");
                setEmail("");
                setMobileNumber("");
                setAddress("");
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message || "Registration failed" });
            }
        } catch (error) {
            const message = error.response?.data?.error || "Something went wrong. Please try again.";
            toast.current.show({ severity: 'error', summary: 'Error', detail: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();

        if (!userName) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter valid Username' });
            return;
        }
        else if (!password) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter password' });
            return;
        }

        const credentials = { userName, password };

        try {
            setIsLoading(true);
            const { data, status } = await authAPI.login(credentials);

            if (status === 200) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login Successful' });
                setUserId(data.result.user_id);
                setLoginUserName("");
                setPassword("");
                setTimeout(() => {
                    navigate("/home");
                }, 3000);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid Credentials' });
            }
        } catch (error) {
            const errMsg = error?.response?.data?.error || error.message || "Login Failed";
            toast.current.show({ severity: 'error', summary: 'Login Error', detail: errMsg });
        } finally {
            setIsLoading(false);
        }
    };


    const handleForgotLinkClick = () => {
        setShowForget(true);
    };

    const handleResetFormSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Enter Email' });
            return;
        }
        else if (!updatedPassword) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Enter New password' });
            return;
        }
        else if (!updatedConfirmPassword) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Enter Confirm password' });
            return;
        }
        else if (updatedPassword !== updatedConfirmPassword) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'New password and  Confirm password should match' });
            return;
        }

        const userData = { email, updatedpassword: updatedPassword, updatedConfirmpassword: updatedConfirmPassword };

        try {
            setIsLoading(true);
            const { data, status } = await authAPI.updatePassword(userData);

            if (status) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: "Password Updated Successfully" });
                setEmail("");
                setUpdatedPassword("");
                setUpdatedConfirmPassword("");
                setPasswordsMatch(true);
                setShowForget(false);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: "password update failed" });
            }
        } catch (error) {
            const errMsg = error?.response?.data?.error || error.message || "password update Failed";
            toast.current.show({ severity: 'error', summary: 'Login Error', detail: errMsg });
        } finally {
            setIsLoading(false);
        }

    };

    const onCancel = () => {
        setShowForget(false);
    };

    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <div className={isMobile ? "mobile-login-form-container" : 'login-form-container'}>
            <Toast ref={toast} />

            {/* {!isMobile && (
                <img src="images/login.jpg" className="login-img" alt="website login"/>
            )} */}

            {!showForget ? (
                <div className={isMobile ? "mobile-form-container" : 'form-container'}>
                    <div className="login-tabs">
                        <button className={`login-tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => handleTabChange('register')}> Register</button>
                        <button className={`login-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => handleTabChange('login')}>Login</button>
                    </div>

                    {activeTab === 'register' && (
                        <div id="register" >
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name:</label>
                                <input id="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-control" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mobileNo">Mobile Number:</label>
                                <input id="mobileNo" type="number" placeholder="Enter your mobile number" value={mobileNo} onChange={(e) => setMobileNumber(e.target.value)} className="form-control" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address:</label>
                                <input id="address" type="text" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" />
                            </div>

                            <div className="button-container">
                                {loading ? (
                                    <div className="spinner-container">
                                        <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                                    </div>
                                ) : (
                                    <button type="submit" className="login-button" onClick={handleFormSubmit}>Register</button>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'login' && (
                        <div id="login">
                            <div className="form-group">
                                <label htmlFor="userName">Username:</label>
                                <input id="userName" type="text" placeholder="Enter your username" value={userName} onChange={(e) => setLoginUserName(e.target.value)} className="form-control" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
                            </div>

                            <div className="forgot-password" onClick={handleForgotLinkClick}>Forgot Password?</div>

                            <div className="button-container">
                                {loading ? (
                                    <div className="spinner-container">
                                        <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                                    </div>
                                ) : (
                                    <button type="submit" className="login-button" onClick={handleLoginFormSubmit}>Login</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className={isMobile ? "mobile-form-container" : 'form-container'}>
                    <h2 className="text-center mb-4">Reset Password</h2>
                    <div id="reset">
                        <div className="form-group">
                            <label htmlFor="resetEmail">Email:</label>
                            <input id="resetEmail" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password:</label>
                            <input id="newPassword" type="password" placeholder="Enter new password" value={updatedPassword} onChange={(e) => setUpdatedPassword(e.target.value)} className="form-control" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input id="confirmPassword" type="password" placeholder="Confirm new password" value={updatedConfirmPassword} onChange={(e) => setUpdatedConfirmPassword(e.target.value)} className={`form-control ${!passwordsMatch ? 'is-invalid' : ''}`} />
                            {!passwordsMatch && (
                                <div className="invalid-feedback"> Passwords do not match</div>
                            )}
                        </div>

                        <div className="d-flex justify-content-between mt-4 flex-wrap">
                            <button type="button" onClick={onCancel} className="btn btn-secondary mb-2" disabled={loading}>Cancel</button>

                            {loading ? (
                                <div className="spinner-container">
                                    <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".5s" />
                                </div>
                            ) : (
                                <button type="submit" className="btn btn-primary mb-2" onClick={handleResetFormSubmit}>Reset Password</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;