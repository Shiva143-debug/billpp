import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';

import './Login.css';

function Login({ setUserId }) {
    const [registerClicked, setRegisterClick] = useState(true)
    const [loginClicked, setLoginClick] = useState(false)
    const [FullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [mobileNo, setmobileNumber] = useState("")
    const [address, setAddress] = useState("")
    const [userName, setLoginUserName] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    const toast = useRef(null);

    const [showForget, setShowForget] = useState(false)
    const [updatedpassword, setUpdatedPassword] = useState("")
    const [updatedConfirmpassword, setUpdatedConfirmPassword] = useState("")
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [loading, setLoading] = useState(false);

    const onRegisterClick = () => {
        setRegisterClick(true)
        setLoginClick(false)

    }

    const onLoginClick = () => {
        setLoginClick(true)
        setRegisterClick(false)

    }

    const handleFormSubmit = (e) => {

        e.preventDefault();
        const values = {
            FullName, email, mobileNo, address
        }

        if (!values.FullName) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter FullName' });
            return;
        }
        else if (!values.email) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter email' });
            return;
        }

        else if (!values.mobileNo) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter mobileNo' });
            return;
        }
        else if (!values.address) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter address' });
            return;
        }
        else {
            setLoading(true);
            axios.post("https://plum-cuboid-crest.glitch.me/registerr", values)
                .then(res => {
                    console.log(res);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'User Account Created successfully' });
                    // document.getElementById("register").reset();
                    setFullName("")
                    setEmail("")
                    setmobileNumber("")
                    setAddress("")

                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email already exists. Please use a different email address.' });
                    setFullName("")
                    setEmail("")
                    setmobileNumber("")
                    setAddress("")
                }).finally(() => setLoading(false));
        }

    }




    const handleLoginFormSubmit = (e) => {

        e.preventDefault();
        const values = {
            userName, password
        }
        if (!values.userName) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter valid Username' });
            return;
        }
        else if (!values.password) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter password' });
            return;
        }
        else {
            setLoading(true);
            axios.post("https://plum-cuboid-crest.glitch.me/loginn", values)
                .then(res => {


                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login successfully' });
                    setLoginUserName("")
                    setPassword("")
                    setTimeout(() => {
                        // navigate("/dashboard")
                        // let id = res.data.result.id;
                        navigate("/home");
                        setUserId(res.data.result.user_id);
                    }, 1000)



                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' });
                    setLoginUserName("")
                    setPassword("")
                }).finally(() => setLoading(false));

        }

    }

    const handleForgotLinkClick = () => {
        setShowForget(true)


    }

    const handleResetFormSubmit = (e) => {
        e.preventDefault();
        // Check if passwords match before submitting form

        setPasswordsMatch(true)
        const values = {
            email, updatedpassword, updatedConfirmpassword
        }

        if (!values.email) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Email' });
            return;
        }
        else if (!values.updatedpassword) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter updated password' });
            return;
        }

        else if (!values.updatedConfirmpassword) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter confirm password' });
            return;
        } else if (values.updatedpassword !== values.updatedConfirmpassword) {
            setPasswordsMatch(false);
            return;
        } else {
            setLoading(true);
            axios.put("https://plum-cuboid-crest.glitch.me/updateUser", values)
                .then(res => {
                    console.log(res);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'password updated successfully' });
                    // document.getElementById("register").reset();
                    setEmail("")
                    setUpdatedPassword("")
                    setUpdatedConfirmPassword("")
                    setPasswordsMatch(true)

                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please Enter Valid Email' });
                    setEmail("")
                    setUpdatedPassword("")
                    setUpdatedConfirmPassword("")
                    setPasswordsMatch(true)
                }).finally(() => setLoading(false));
        }

        setShowForget(false)
    }

    const onCancel = () => {
        setShowForget(false)
    }
    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <div className={isMobile ? "mobile-login-form-container" : 'login-form-container'}  >
            <Toast ref={toast} />

            <img
                src="images\login.jpg"
                className="login-img"
                alt="website login"
            />

            {!showForget &&

                <div className={isMobile ? "mobile-form-container" : 'form-container'} >

                    <div className='d-flex' style={{ width: "100%" }}>
                        <button onClick={onRegisterClick} style={{ backgroundColor: registerClicked ? "gray" : "white", color: registerClicked ? "white" : "", border: "1px solid whitesmoke", width: "100%", padding: "5px" }}>Register</button>
                        <button onClick={onLoginClick} style={{ backgroundColor: loginClicked ? "gray" : "white", color: loginClicked ? "white" : "", border: "1px solid whitesmoke", width: "100%", padding: "5px" }}>Login</button>
                    </div>
                    {registerClicked &&
                        <form id="register" onSubmit={handleFormSubmit}>
                            <div className='row pt-5'>
                                <div class="col-5">
                                    <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>FullName:</label>
                                </div>
                                <div class="col-6">
                                    <input
                                        type="text"
                                        placeholder="FullName"
                                        value={FullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        style={{ height: "30px" }}
                                        className="form-control mx-3"
                                    />
                                </div>

                            </div>

                            <div className='row pt-5'>
                                <div class="col-5">
                                    <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Email:</label>
                                </div>
                                <div class="col-6">
                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ height: "30px" }}
                                        className="form-control mx-3"
                                    />
                                </div>

                            </div>

                            <div className='row pt-5'>
                                <div class="col-5">
                                    <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Mobile Number:</label>
                                </div>
                                <div class="col-6">
                                    <input
                                        type="number"
                                        placeholder="Enter Mobile Number"
                                        value={mobileNo}
                                        onChange={(e) => setmobileNumber(e.target.value)}
                                        style={{ height: "30px" }}
                                        className="form-control mx-3"
                                    />
                                </div>

                            </div>

                            <div className='row pt-5'>
                                <div class="col-5">
                                    <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Address:</label>
                                </div>
                                <div class="col-6">
                                    <input
                                        type="text"
                                        placeholder="Enter Adress"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        style={{ height: "30px" }}
                                        className="form-control mx-3"
                                    />
                                </div>

                            </div>
                            <div className='button-container'>
                                {/* <button type="submit" className="login-button">
                                    Register
                                </button> */}
                                {loading ? (
                                    <div className="spinner-border text-primary" role="status" style={{ backgroundColor: "blue", color: "white" }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <button type="submit" className="login-button">
                                        Register
                                    </button>
                                )}
                            </div>
                        </form>
                    }

                    {loginClicked &&
                        <>
                            <form id="login" onSubmit={handleLoginFormSubmit}>
                                <div className='row pt-5'>
                                    <div class="col-5">
                                        <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>UserName:</label>
                                    </div>
                                    <div class="col-5">
                                        <input
                                            type="text"
                                            placeholder="Enter UserName"
                                            value={userName}
                                            onChange={(e) => setLoginUserName(e.target.value)}
                                            style={{ height: "30px" }}
                                            className="form-control mx-3"
                                        />
                                    </div>

                                </div>

                                <div className='row pt-5'>
                                    <div class="col-5">
                                        <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Password:</label>
                                    </div>
                                    <div class="col-6">
                                        <input
                                            type="text"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ height: "30px" }}
                                            className="form-control mx-3"
                                        />
                                    </div>

                                </div>

                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <button
                                            className="mt-5"
                                            style={{ border: "none", color: "blue" }}
                                            onClick={handleForgotLinkClick}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <div className='button-container' style={{ marginTop: "20px" }}>
                                        {/* <button type="submit" className="login-button">
                                            Login
                                        </button> */}
                                        {loading ? (
                                            <div className="spinner-border text-primary" role="status" style={{ backgroundColor: "blue", color: "white" }}>
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            <button type="submit" className="login-button">
                                                Login
                                            </button>
                                        )}
                                    </div>
                                </div>


                            </form>


                        </>
                    }

                </div>

            }
            {showForget &&
                <div className={isMobile ? "mobile-form-container" : 'form-container'} >
                    <h1 style={{ fontFamily: "sans-serif", textAlign: "center", fontWeight: "bold" }}>Update Password</h1>
                    <form id="forget" onSubmit={handleResetFormSubmit}>
                        <div className='row pt-5'>
                            <div class="col-5">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Email:</label>
                            </div>
                            <div class="col-6">
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ height: "30px" }}
                                    className="form-control mx-3"
                                />
                            </div>

                        </div>

                        <div className='row pt-5'>
                            <div class="col-5">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Password:</label>
                            </div>
                            <div class="col-6">
                                <input
                                    type="text"
                                    placeholder="Enter password"
                                    value={updatedpassword}
                                    onChange={(e) => setUpdatedPassword(e.target.value)}
                                    style={{ height: "30px" }}
                                    className="form-control mx-3"
                                />
                            </div>

                        </div>

                        <div className='row pt-5'>
                            <div class="col-5">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Confirm Password:</label>
                            </div>
                            <div class="col-6">
                                <input
                                    type="text"
                                    placeholder="Enter password"
                                    value={updatedConfirmpassword}
                                    onChange={(e) => setUpdatedConfirmPassword(e.target.value)}
                                    style={{ height: "30px" }}
                                    className="form-control mx-3"
                                />
                            </div>

                        </div>

                        {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match. Please try again.</p>}



                        <div className='button-container' style={{ display: "flex", justifyContent: "space-around" }}>
                            <button class="btn btn-dark mt-5" onClick={onCancel} style={{ marginLeft: isMobile ? "-100px" : "" }}>
                                cancel
                            </button>
                            {/* <button type="submit" className="login-button">
                                Submit
                            </button> */}

                            {loading ? (
                                <div className="spinner-border text-primary" role="status" style={{ backgroundColor: "blue", color: "white" }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <button type="submit" className="login-button">
                                    Submit
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            }

        </div>
    )
}

export default Login