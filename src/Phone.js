import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import './Login.css';

const Phone = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const toast = useRef(null);
  const navigate = useNavigate();
  console.log(message)


  const handleSendOTP = async () => {
    try {
      const response = await fetch('http://localhost:8083/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber }),
      });

      if (response.ok) {
        setMessage('OTP sent successfully');
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'OTP sent successfully', life: 3000 });
      } else {
        const errorMessage = await response.text();
        setMessage(`Failed to send OTP: ${errorMessage}`);

        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to send OTP', life: 3000 });

      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }

  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('http://localhost:8083/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber, enteredOTP: otp }),
      });

      if (response.ok) {
        setMessage('OTP verified successfully');
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'OTP verified successfully', life: 3000 });
        setTimeout(()=>{
          navigate("/home")
      },1000)
        

      } else {
        const errorMessage = await response.text();
        setMessage(errorMessage);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'invalid otp', life: 3000 });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }

    setMobileNumber("")
    setOtp("")
  };

  return (


    <div className="login-form-container">

      <img
        src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1675667166/Layer_2_zpnk6t.jpg"
        className="login-img"
        alt="website login"
      />



      <div className='form-container'>
        <Toast ref={toast} />

        <img
          src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1675668478/Standard_Collection_8_lbjbou.svg"
          className="login-website-logo-desktop-img"
          alt="website logo"
        />
        <h1 className="app-name">APP NAME</h1>

        <h2 style={{ paddingTop: "50px" }}>Enter Mobile Number</h2>
        <div className='d-flex'>
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            style={{ height: "50px" }}
          />
          <Button style={{ height: "50px" }} onClick={handleSendOTP}>Send OTP</Button>
        </div>

        <h2 style={{ paddingTop: "50px", marginLeft: "-100px" }}>Enter OTP</h2>
        <div className='d-flex'>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            style={{ height: "50px" }}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button style={{ height: "50px" }} onClick={handleVerifyOTP}>Verify OTP</Button>
        </div>

      </div>
    </div>

  );
};

export default Phone;
