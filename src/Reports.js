import Header from './Header'
import { useState, useEffect } from "react"
import { ProgressSpinner } from 'primereact/progressspinner';
import "./index.css"
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';

const Reports = ({ id }) => {

    const [value, setBy] = useState("Date")
    const [selectedOption, setSelectedOption] = useState("select");
    const [Data, setData] = useState([])
    const [date, setDateChange] = useState("")
    const [cashDate, setcashDateChange] = useState("")

    const [data, setdata] = useState([])
    const [grandTotal, setGrandTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [productName, setproductName] = useState("Select");
    const [payment, setPayment] = useState("Selectt");

    const [productData, setProductData] = useState([])
    const [paymentTypeData, setpaymentTypeData] = useState([])
    const [cashReportData, setCashReportData] = useState([])
    const [cashReportDataClicked, setCashReportDataClicked] = useState(false)

    const [paymentClicked, setpaymentClicked] = useState(false)
    const [datebuttonClicked, setDateButtonClicked] = useState(true)

    const [namebuttonClicked, setNameButtonClicked] = useState(false)
    const [productbuttonClicked, setProductButtonClicked] = useState(false)
    const [paybuttonClicked, setPayButtonClicked] = useState(false)
    const [cashbuttonClicked, setCashButtonClicked] = useState(false)

    const [searchTerm, setSearchTerm] = useState("");


    console.log(cashReportData)

    const byDate = () => {
        setSelectedOption("select")
        setproductName("Select")
        setIsLoading(false)
        setBy("Date")
        setPayment("Selectt")
        setpaymentClicked(false)
        setCashReportDataClicked(false)
        setDateButtonClicked(true)
        setNameButtonClicked(false);
        setProductButtonClicked(false);
        setPayButtonClicked(false);
        setCashButtonClicked(false);
    }
    const byName = () => {
        setDateChange("")
        setproductName("Select")
        // setIsLoading(true)
        setIsLoading(false)
        setBy("name")
        setPayment("Selectt")
        setpaymentClicked(false)
        setCashReportDataClicked(false)
        setDateButtonClicked(false);
        setNameButtonClicked(true);
        setProductButtonClicked(false);
        setPayButtonClicked(false);
        setCashButtonClicked(false);

    }

    const byProductName = () => {
        setDateChange("")
        setSelectedOption("select")
        // setIsLoading(true)
        setIsLoading(false)
        setBy("productName")
        setPayment("Selectt")
        setpaymentClicked(false)
        setCashReportDataClicked(false)
        setDateButtonClicked(false);
        setNameButtonClicked(false);
        setProductButtonClicked(true);
        setPayButtonClicked(false);
        setCashButtonClicked(false);


    }

    const byPayementType = () => {
        setDateChange("")
        setSelectedOption("select")
        setproductName("Select")
        // setIsLoading(true)
        setIsLoading(false)
        setBy("payment")

        setpaymentClicked(true)
        setCashReportDataClicked(false)
        setDateButtonClicked(false);
        setNameButtonClicked(false);
        setProductButtonClicked(false);
        setPayButtonClicked(true);
        setCashButtonClicked(false);



    }

    const byCashReport = () => {
        setDateChange("")
        setSelectedOption("select")
        setproductName("Select")
        // setIsLoading(true)
        setIsLoading(false)
        setBy("cashReport")
        setPayment("Selectt")
        setpaymentClicked(false)
        setCashReportDataClicked(true)
        setCashButtonClicked(true)
        setDateButtonClicked(false);
        setNameButtonClicked(false);
        setProductButtonClicked(false);
        setPayButtonClicked(false);
        setCashButtonClicked(true);

    }

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);

    };

    const productHandleSelectChange = (event) => {

        setproductName(event.target.value);


    };

    const handlePaymentChange = (event) => {
        setPayment(event.target.value)
    }

    useEffect(() => {
        const userId = id;
        fetch(`https://plum-cuboid-crest.glitch.me/customer/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setData(data);
                } else {
                    setData([]);
                }
            })
            .catch(err => console.log(err));
    }, [id]);


    useEffect(() => {
        const userId = id;
        fetch(`https://plum-cuboid-crest.glitch.me/product/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProductData(data);
                } else {
                    setProductData([]);
                }
            })
            .catch(err => console.log(err));
    }, [id]);


    useEffect(() => {
        // console.log(date)
        console.log(value)
        setIsLoading(true)
        if (date !== "" && value === "Date") {
            const userId = id;
            fetch(`https://plum-cuboid-crest.glitch.me/salesByDate/${date}?user_id=${userId}`)
                .then((res) => res.json())
                .then((itemsData) => setdata(itemsData))
                .catch((err) => console.log(err));
            setIsLoading(false);

            let total = 0;
            data.forEach((d) => {
                total += d.total_amount;
            });
            setGrandTotal(total);
        } else if (selectedOption !== "select" && value === "name") {
            const userId = id;
            fetch(`https://plum-cuboid-crest.glitch.me/salesByName/${selectedOption}?user_id=${userId}`)
                .then((res) => res.json())
                .then((itemsData) => setdata(itemsData))

                .catch((err) => console.log(err));
            setIsLoading(false);

            let total = 0;
            data.forEach((d) => {
                total += d.total_amount;
            });
            setGrandTotal(total);
        } else if (productName !== "Select" && value === "productName") {
            const userId = id;
            fetch(`https://plum-cuboid-crest.glitch.me/salesByProductName/${productName}?user_id=${userId}`)
                .then((res) => res.json())
                .then((itemsData) => setdata(itemsData))

                .catch((err) => console.log(err));
            setIsLoading(false);

            let total = 0;
            data.forEach((d) => {
                total += d.total_amount;
            });
            setGrandTotal(total);
        } else if (payment !== "Selectt" && value === "payment") {
            const userId = id;
            console.log(payment)
            fetch(`https://plum-cuboid-crest.glitch.me/reportBypayment/${payment}?user_id=${userId}`)
                .then((res) => res.json())
                .then((itemsData) => setpaymentTypeData(itemsData))
                .catch((err) => console.log(err));
            setIsLoading(false);
        } else if (cashDate !== "" && value === "cashReport") {
            const userId = id;

            fetch(`https://plum-cuboid-crest.glitch.me/cashReport/${cashDate}?user_id=${userId}`)
                .then((res) => res.json())
                .then((itemsData) => setCashReportData(itemsData))
                .catch((err) => console.log(err));
            setIsLoading(false);

        }
        // setIsLoading(false);


    }, [value, id, selectedOption, paymentTypeData, cashDate, payment, data, date, productData, productName])


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <>
            <div>
                <Header />


                <div className=" rounded" style={{ width: "100vw", minHeight: "100vh", background: "linear-gradient(to bottom, white, gray)", marginTop: isMobile ? "160px" : "50px" }} >
                    <div style={{ display: "flex", marginTop: "12vh", width: "100vw" }}>
                        <button onClick={byDate} style={{ width: "50%", border: "none", backgroundColor: datebuttonClicked ? "gray" : "whitesmoke", padding: "10px", color: datebuttonClicked ? "white" : "", fontWeight: "bold", borderRight: "1px solid gray" }}>{!isMobile ? "Report" : ""} By Date</button>
                        <button onClick={byName} style={{ width: "50%", border: "none", backgroundColor: namebuttonClicked ? "gray" : "whitesmoke", padding: "10px", color: namebuttonClicked ? "white" : "", fontWeight: "bold", borderRight: "1px solid gray" }}>{!isMobile ? "Report" : ""} By Name</button>
                        <button onClick={byProductName} style={{ width: "50%", border: "none", backgroundColor: productbuttonClicked ? "gray" : "whitesmoke", padding: "10px", color: productbuttonClicked ? "white" : "", fontWeight: "bold", borderRight: "1px solid gray" }}>{!isMobile ? "Report" : ""}By productName</button>
                        <button onClick={byPayementType} style={{ width: "50%", border: "none", backgroundColor: paybuttonClicked ? "gray" : "whitesmoke", color: paybuttonClicked ? "white" : "", padding: "10px", fontWeight: "bold", borderRight: "1px solid gray" }}>{!isMobile ? "Report" : ""} By paymentType</button>
                        <button onClick={byCashReport} style={{ width: "50%", border: "none", backgroundColor: cashbuttonClicked ? "gray" : "whitesmoke", color: cashbuttonClicked ? "white" : "", padding: "10px", fontWeight: "bold" }}>Cash {!isMobile ? "Report" : ""} By Date</button>

                    </div>



                    {value === "Date" &&
                        <div className="mb-5 row mt-5 mx-5">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Select Date:</label>
                            </div>
                            <div class="col-7">
                                <input type="date" className='form-control' value={date} onChange={(e) => setDateChange(e.target.value)} />
                            </div>
                        </div>
                    }

                    {value === "name" &&
                        <div className="mb-5 row mt-5 mx-5">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Select Name:</label>
                            </div>
                            <div class="col-7">
                                <select id="id" class="form-control" value={selectedOption}
                                    onChange={handleSelectChange}>
                                    <option value="select">Select Name</option>
                                    {Data.map((d) => (
                                        <option key={d.customer_id} value={d.name}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    }


                    {value === "productName" &&
                        <div className="mb-5 row mt-5 mx-5">
                            <div class="col-3">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>select product Name:</label>
                            </div>
                            <div class="col-7">
                                <select id="id" class=" form-control" value={productName}
                                    onChange={productHandleSelectChange}>
                                    <option value="select">Select ProductName</option>
                                    {productData.map((d) => (
                                        <option key={d.product_id} value={d.product_name}>
                                            {d.product_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    }
                    {value === "payment" &&
                        <div className="mb-5 row mt-5 mx-5">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Select paymentType:</label>
                            </div>
                            <div class="col-7">
                                <select id="id" class="form-control" value={payment}
                                    onChange={handlePaymentChange}>
                                    <option value="select">Select paymentType</option>
                                    <option value="upi_pay">upi_pay</option>
                                    <option value="cash_pay">cash_pay</option>

                                </select>
                            </div>
                        </div>
                    }

                    {value === "cashReport" &&
                        <div className="mb-5 row mt-5 mx-5">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Select Date:</label>
                            </div>
                            <div class="col-7">
                                <input type="date" className='form-control' value={cashDate} onChange={(e) => setcashDateChange(e.target.value)} />
                            </div>
                        </div>
                    }

                    {isLoading &&

                        <div className="d-flex flex-column justify-content-center align-items-center mt-5 " style={{ height: '150px' }}>
                            <img
                                className="blinking"
                                src="https://res.cloudinary.com/dxgbxchqm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1716964033/large_xjsnwr.png"
                                alt="website logo"
                                style={{ width: "400px", marginTop: "300px" }}
                            />
                            <h1 className="blinking" style={{ color: "white", fontSize: "50px" }} >Select The Report..... </h1>

                        </div>
                    }



                    {cashReportDataClicked === true && paymentClicked === false && cashDate !== "" && (

                        <div class="mx-5" style={{ width: isMobile ? '80%' : "", overflowX: 'auto', marginLeft: isMobile ? "10%" : "" }}>
                            <table className="table table-bordered" style={{ width: '100%' }}>
                                <thead>
                                    <th>Name</th>
                                    <th>2000 Notes</th>
                                    <th>500 Notes</th>
                                    <th>200 Notes</th>
                                    <th>100 Notes</th>
                                    <th>50 Notes</th>
                                    <th>20 Notes</th>
                                    <th>10 Notes</th>
                                    <th>5 Rupees</th>
                                    <th>2 Rupees</th>
                                    <th>1 Rupees</th>
                                    <th>Grand Total</th>



                                </thead>
                                <tbody>
                                    {cashReportData.map((d, i) => (
                                        <tr key={i}>

                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.name}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.twothousandnotes}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.fivehundrednotes}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.twohundrednotes}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.hundrednotes}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.fiftynotes}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.twentynotes}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.tennotes}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.fiverupees}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.tworupees}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.onerupees}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.grand_total}</td>


                                        </tr>
                                    ))}
                                    <tr>
                                        <td style={{ backgroundColor: "gray" }}>Total</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.twothousandnotes, 0)}</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.fivehundrednotes, 0)}</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.twohundrednotes, 0)}</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.hundrednotes, 0)}</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.fiftynotes, 0)}</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.twentynotes, 0)}</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.tennotes, 0)}</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.fiverupees, 0)}</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.tworupees, 0)}</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.onerupees, 0)}</td>
                                        <td style={{ backgroundColor: "gray" }}>{cashReportData.reduce((acc, d) => acc + d.grand_total, 0)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {paymentClicked === true && cashReportDataClicked === false && payment !== 'Selectt' && (
                        <div style={{ width: "80%", overflowX: "auto", marginLeft: "10%" }}>
                            <input class="form-control" type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} style={{ marginRight: "10px", padding: "5px", width: "300px" }} />
                            <table className="table table-bordered" style={{ minWidth: "300px" }}>
                                <thead>
                                    <th>Bill No</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                </thead>
                                <tbody>

                                    {paymentTypeData.filter((d) => searchTerm === "" || d.name.toLowerCase().includes(searchTerm.toLowerCase()) || new Date(d.date).toLocaleDateString().includes(searchTerm)).map((d, i) => (
                                        <tr key={i}>


                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.id}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.name}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{new Date(d.date).toLocaleDateString()}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.amount}</td>

                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="3"></td>
                                        <td style={{ color: "navy", fontWeight: "bold" }}>{paymentTypeData.reduce((acc, d) => acc + d.amount, 0)}</td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(paymentClicked === false && cashReportDataClicked === false && (date || selectedOption !== 'select' || productName !== 'Select')) && (

                        <div style={{ width: "80%", overflowX: "auto", marginLeft: "10%" }}>
                            <h1 className='h1' style={{ fontFamily: "sans-serif" }}>{value === "Date" && " Item Details By Date"}</h1>
                            <h1 className='h1' style={{ fontFamily: "sans-serif" }}>{value === "name" && " Item Details By Name"}</h1>
                            <h1 className='h1' style={{ fontFamily: "sans-serif" }}>{value === "productName" && "  Details By productName"}</h1>

                            <input class="form-control mb-5" type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} style={{ marginRight: "10px", padding: "5px", width: "300px" }} />
                            <table className="table table-bordered" style={{ minWidth: "300px" }}>
                                <thead>
                                    {/* <th>ID</th> */}
                                    {(value === "productName" || value === "name") && <th>Date</th>}
                                    {(value === "productName" || value === "Date") && <th>Name</th>}
                                    {(value === "name" || value === "Date") && <th>productName</th>}

                                    <th>Prize</th>
                                    <th>Quantity</th>
                                    <th>Total_Amount</th>


                                </thead>
                                <tbody>


                                    {data.filter((d) => searchTerm === "" || d.name.toLowerCase().includes(searchTerm.toLowerCase()) || new Date(d.date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) || d.product_name.toLowerCase().includes(searchTerm.toLowerCase())).map((d, i) => (

                                        <tr key={i}>

                                            {(value === "productName" || value === "name") && <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{new Date(d.date).toLocaleDateString()}</td>}
                                            {(value === "productName" || value === "Date") && <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.name}</td>}
                                            {(value === "name" || value === "Date") && <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.product_name}</td>}
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.price}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.quantity}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.total_amount}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-end align-items-end">
                                <div style={{ color: "white", fontSize: "18px" }}>
                                    <strong>Grand Total:</strong> {grandTotal}
                                </div>
                            </div>
                        </div>

                    )}



                </div>
            </div>

        </>


    )
}

export default Reports
