import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import useMediaQuery from '@mui/material/useMediaQuery';
import { authAPI } from '../services/apiService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";

function Login({ onLogin }) {
    const toast = useRef(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login');
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNumber] = useState("");
    const [loginmobileNo, setLoginMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [showForget, setShowForget] = useState(false);
    const [updatedPassword, setUpdatedPassword] = useState("");
    const [updatedConfirmPassword, setUpdatedConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        else if (!/^\d{10}$/.test(mobileNo)) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Mobile number must be exactly 10 digits' });
            return;
        }
        const userData = { FullName: fullName, email, mobileNo };

        try {
            setIsLoading(true);
            const response = await authAPI.register(userData);

            if (response.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
                setFullName("");
                setEmail("");
                setMobileNumber("");
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.message || "Registration failed" });
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

        if (!loginmobileNo) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter valid mobile Number' });
            return;
        }
        else if (!password) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter password' });
            return;
        }

        const credentials = { mobileNo: loginmobileNo, password };

        try {
            setIsLoading(true);
            const response = await authAPI.login(credentials);

            if (response.success && response.data?.token) {
                const loginData = { token: response.data.token, user: response.data.user };
                await onLogin(loginData);
                toast.current.show({ severity: 'success', summary: 'Success', detail: response.message || 'Login Successful' });
                setLoginMobileNo("");
                setPassword("");
                setTimeout(() => {
                    navigate("/home");
                }, 1500);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.message || 'Invalid Credentials' });
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

        const userData = { email, updatedpassword: updatedPassword };

        try {
            setIsLoading(true);
            const response = await authAPI.updatePassword(userData);

            if (response.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: response.message || "Password Updated Successfully" });
                setEmail("");
                setUpdatedPassword("");
                setUpdatedConfirmPassword("");
                setPasswordsMatch(true);
                setShowNewPassword(false);
                setShowConfirmPassword(false);
                setShowForget(false);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.message || "password update failed" });
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
                                <label htmlFor="fullName">Name:</label>
                                <input id="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-control" disabled={loading} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" disabled={loading} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mobileNo">Mobile Number:</label>
                                <input id="mobileNo" type="text" inputMode="numeric" maxLength={10} placeholder="Enter your mobile number" value={mobileNo} onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} className="form-control" disabled={loading} />
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
                                <label htmlFor="loginmobileNo">Mobile Number:</label>
                                <input id="loginmobileNo" type="text" placeholder="Enter your mobile Number" value={loginmobileNo} maxLength={10}  onChange={(e) => setLoginMobileNo(e.target.value)} className="form-control" disabled={loading} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <div className="password-wrapper">
                                    <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" disabled={loading} />
                                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="forgot-password" onClick={!loading ? handleForgotLinkClick : null} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>Forgot Password?</div>

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
                            <input id="resetEmail" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" disabled={loading} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password:</label>
                            <div className="password-wrapper">
                                <input id="newPassword" type={showNewPassword ? "text" : "password"} placeholder="Enter new password" value={updatedPassword} onChange={(e) => setUpdatedPassword(e.target.value)} className="form-control" disabled={loading} />
                                <button type="button" className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)} disabled={loading}>
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <div className="password-wrapper">
                                <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm new password" value={updatedConfirmPassword} onChange={(e) => setUpdatedConfirmPassword(e.target.value)} className={`form-control ${!passwordsMatch ? 'is-invalid' : ''}`} disabled={loading} />
                                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
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