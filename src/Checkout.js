import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import { v4 as uuidv4 } from 'uuid';



const Checkout = (props) => {
    const id = props.id
    const [checkshow, setcheckoutshow] = useState(true)
    const [upishow, setupishow] = useState(false)
    const [cashshow, setcashshow] = useState(false)
    const [isplayclick, setpay] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const { orderDetails } = location.state || {};
    const [showPayButton, setShowPayButton] = useState(true)
    const [TotalAmount, setGrandTotal] = useState(0);
    const uniqueId = (Math.floor(Math.random() * 9999) + 1).toString().padStart(4, '0');
    const isMobile = useMediaQuery('(max-width:768px)');
    const [inputs, setInputs] = useState([
        { denomination: '2000 Notes', value: '' },
        { denomination: '500 Notes', value: '' },
        { denomination: '200 Notes', value: '' },
        { denomination: '100 Notes', value: '' },
        { denomination: '50 Notes', value: '' },
        { denomination: '20 Notes', value: '' },
        { denomination: '10 Notes', value: '' },
        { denomination: '5 Rupees', value: '' },
        { denomination: '2 Rupees', value: '' },
        { denomination: '1 Rupees', value: '' },

    ]);


    const calculateAmount = (denomination, value) => {
        switch (denomination) {
            case '1 Rupees':
                return value * 1;
            case '2 Rupees':
                return value * 2;
            case '5 Rupees':
                return value * 5;
            case '10 Notes':
                return value * 10;
            case '20 Notes':
                return value * 20;
            case '50 Notes':
                return value * 50;

            case '100 Notes':
                return value * 100;
            case '200 Notes':
                return value * 200;
            case '500 Notes':
                return value * 500;
            case '2000 Notes':
                return value * 2000;
            default:
                return 0;
        }

    };

    useEffect(() => {
        let total = 0;
        inputs.forEach(input => {
            total += calculateAmount(input.denomination, input.value);
        });
        setGrandTotal(total);
    }, [inputs]);

    console.log(orderDetails)

    if (!orderDetails || orderDetails.grandTotal === 0) {
        return <div style={{ textAlign: "center", fontSize: "50px" }}>No order details found</div>;
    }

    const { selectedOption, address, contactNo, grandTotal, items, date } = orderDetails;


    const handlePrint = () => {
        window.print();

        const exportData = items.map(item => ({
            selectedOption,
            date,
            productName: item.product_name,
            price: item.price,
            quantity: item.quantity,
            total_amount: item.total_amount,
        }));

        const userId = id;

        fetch(`https://plum-cuboid-crest.glitch.me/exportToSales/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemsArray: exportData }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);

                navigate("/home");
                resetDataAndGrandTotal();
            })
            .catch(error => {
                console.error('Error exporting to sales:', error);
            });

    }

    const resetDataAndGrandTotal = async () => {
        const userId = id;
        const response = await fetch(`https://plum-cuboid-crest.glitch.me/deleteItems/${selectedOption}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Items deleted successfully');
        } else {
            console.error('Failed to delete items');
        }
    }


    const onBack = () => {


        orderDetails.items.forEach((item) => {
            const adddedValues = {
                productName: item.product_name,
                quantity: item.quantity
            };
            const userId = id;
            fetch(`https://plum-cuboid-crest.glitch.me/addProductQuantity/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(adddedValues),
            })
                .then((response) => response.json())
                .then((deductResponse) => {
                    console.log("Quantity added successfully:", deductResponse);
                    navigate("/home");
                })
                .catch((error) => {
                    console.error("Error added quantity:", error);
                });
        });

    }

    const onPay = () => {
        setpay(true)
    }
    const oncash = () => {
        setupishow(false)
        setcheckoutshow(false)
        setcashshow(true)
    }

    const onUpi = () => {
        setupishow(true)
        setcheckoutshow(false)
        setcashshow(false)
    }


    const paymentCompleted = () => {
        const exportData = {
            selectedOption,
            date,
            paymentType: "upi_pay",
            grandTotal
        };
        const userId = id;

        fetch(`https://plum-cuboid-crest.glitch.me/payment/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exportData),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);

            })
            .catch(error => {
                console.error('Error making payment:', error);
            });

        setupishow(false);
        setcheckoutshow(true);
        setcashshow(false);
        setShowPayButton(false);
    };

    const cashpaymentCompleted = () => {
        const data = {
            id, selectedOption, date, grandTotal,
            denominations: {
                '2000notes': inputs.find(input => input.denomination === '2000 Notes').value || 0,
                '500notes': inputs.find(input => input.denomination === '500 Notes').value || 0,
                '200notes': inputs.find(input => input.denomination === '200 Notes').value || 0,
                '100notes': inputs.find(input => input.denomination === '100 Notes').value || 0,
                '50notes': inputs.find(input => input.denomination === '50 Notes').value || 0,
                '20notes': inputs.find(input => input.denomination === '20 Notes').value || 0,
                '10notes': inputs.find(input => input.denomination === '10 Notes').value || 0,
                '5rupees': inputs.find(input => input.denomination === '5 Rupees').value || 0,
                '2rupees': inputs.find(input => input.denomination === '2 Rupees').value || 0,
                '1rupees': inputs.find(input => input.denomination === '1 Rupees').value || 0
            }
        };

        const userId = id
        fetch(`https://plum-cuboid-crest.glitch.me/cashCompleted/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                // Handle success response
            })
            .catch(error => {
                console.error('Error completing cash payment:', error);

            })


        const exportData = {
            id, selectedOption, date, paymentType: "cash_pay", grandTotal
        }

        fetch(`https://plum-cuboid-crest.glitch.me/payment/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exportData),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);


                // resetDataAndGrandTotal();
            })
            .catch(error => {
                console.error('Error to pay:', error);
            });

        setupishow(false)
        setcheckoutshow(true)
        setcashshow(false)
        setShowPayButton(false)

    }
    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index].value = value;
        setInputs(newInputs);
    };

    const remainingBalance = grandTotal - inputs.reduce((acc, curr) => acc + calculateAmount(curr.denomination, curr.value), 0);



    return (
        <>
            {checkshow && <div>

                <style>
                    {`
        @media print {
            .btn {
                display: none !important;
            }
        }
    `}
                </style>


                <div style={{ border: "1px solid gray", padding: "20px 50px 10px 50px", height: "100vh", background: "whiteSmoke" }}>
                    <h1 style={{ textAlign: "center", color: "red", paddingBottom: "20px" }}>INVOICE {uniqueId}</h1>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex" }}>
                            <img src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1704974380/comapnylogo_gh2jvq.jpg" alt="pic" style={{ width: "50px", height: "40px" }} />
                            {!isMobile && <h1 style={{ fontFamily: "sans-serif" }}>WhereSoftTechnolgies</h1>}

                        </div>
                        {!showPayButton &&

                            <button onClick={handlePrint} className="btn btn-success" style={{ marginTop: "20px", marginRight: isMobile ? "10px" : "" }}>Export / Print</button>

                        }
                    </div>
                    <p style={{ fontSize: "20px", paddingBottom: "30px" }}><strong>Address:</strong> pragathinagar</p>

                    <div style={{ fontSize: "20px", paddingBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <p><strong>Name:</strong> {selectedOption}</p>
                            <p><strong>Address:</strong> {address}</p>
                            <p><strong>Contact No:</strong> {contactNo}</p>
                        </div>
                        <p style={{ paddingTop: "20px" }}><strong>Date:</strong> {date}</p>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Product Name</th>
                                <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Price</th>
                                <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Quantity</th>
                                <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{item.product_name}</td>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{item.price}</td>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{item.quantity}</td>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{item.total_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <p style={{ float: "right", fontSize: "24px" }}><strong>Grand Total:</strong> {grandTotal}</p>


                    {showPayButton && <div className='d-flex justify-content-around pt-5'>
                        <button type="button" class="btn btn-info btn-lg" onClick={onBack}>Back</button>
                        {isplayclick === false && <button type="button" class="btn btn-primary btn-lg" onClick={onPay}>Pay</button>}
                        {isplayclick === true &&
                            <div className='d-flex justify-content-between'>
                                <button type="button" class="btn btn-info btn-lg mx-2" onClick={oncash}>Pay cash</button>
                                <button type="button" class="btn btn-info btn-lg" onClick={onUpi}>upi pay</button>
                            </div>
                        }
                    </div>}

                </div>
            </div>
            }
            {upishow &&
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <QRCode style={{ height: isMobile ? "200px" : "500px", width: isMobile ? "200px" : "500px", marginTop: "100px" }} value={"shiva"} />
                    <div>
                        <div className='d-flex justify-content-around'>
                            <button type="button" class="btn btn-info btn-lg mt-5 mx-5" onClick={onBack}>Back</button>
                            <button type="button" class="btn btn-primary btn-lg mt-5 mx-5" onClick={paymentCompleted}>paymentCompleted</button>
                        </div>
                    </div>
                </div>
            }

            {
                cashshow &&
                <div className="p-5" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(to bottom, white, gray)", height: "100%" }}>
                    {/* <h1 class="mt-5 mb-5" style={{fontFamily:"Roboto"}}>Cash Table</h1> */}
                    <h3 class="mb-1">Total Amount should pay:{grandTotal}</h3>
                    <table className="table table-bordered" style={{ width: "100%" }}>
                        <thead>
                            <tr >
                                <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Denomination</th>
                                <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Input</th>
                                <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inputs.map((input, i) => (
                                <tr key={i}>
                                    <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{input.denomination}</td>
                                    <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', width: "500px", textAlign: "center" }}>
                                        <input
                                            type="number"
                                            value={input.value}
                                            class="form-control"
                                            onChange={(e) => handleInputChange(i, e.target.value)}
                                            style={{ border: "1px solid white" }}
                                        />
                                    </td>
                                    <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{calculateAmount(input.denomination, input.value)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{ fontWeight: "bold", textAlign: "right" }}>Grand Total:{TotalAmount}</td>

                            </tr>
                        </tfoot>
                    </table>


                    {remainingBalance !== 0 && <button type="button" class="btn btn-info" onClick={onBack}>Back</button>}

                    <p style={{ fontWeight: "bold", color: "white" }}>Remaining Balance to Pay: {remainingBalance >= 0 ? remainingBalance : 0}</p>
                    {remainingBalance < 0 && <p style={{ color: 'red' }}>Amount paid exceeds the total amount.</p>}

                    {remainingBalance === 0 &&
                        <div class="mb-5" style={{ display: "flex", justifyContent: "space-between" }}>
                            <button type="button" class="btn btn-info mx-5 mt-5" onClick={onBack}>Back</button>


                            <button type="button" class="btn btn-primary mx-5 mt-5" onClick={cashpaymentCompleted}>Cash payment Completed</button>

                        </div>}

                </div>
            }


        </>
    );
};

export default Checkout;
