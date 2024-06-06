import Header from "./Header";
import React, { useState, useEffect, useRef } from "react";
import { Toast } from 'primereact/toast';
import axios from "axios";
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import "./index.css"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import PageLoader from "./PageLoader";

const Invoice = ({ id }) => {
    const [companyName, setCompanyName] = useState("");
    const [amount, setAmount] = useState("");
    const [invoice, setInvoice] = useState("");
    const [Data, setInvoiceData] = useState([])
    const [productsData, setData] = useState([])
    const [addInvoice, setAddInvoice] = useState(true);
    const [viewInvoice, setViewInvoice] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false)
    const toast = useRef(null);
    const [filePath, setFilePath] = useState('');
    const [showImageComponent, setViewImageComponent] = useState(false)
    const [pdfBase64, setPdfBase64] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            setPdfBase64(base64data);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        if (invoice === "") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter invoice Number' });
            return;
        }

        else if (amount === "") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter amount' });
            return;
        }
        else if (companyName === "") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter companyName' });
            return;
        }

        else if (!pdfBase64) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select  file' });
            return;
        }
        else {
            setLoading(true)
            const values = {

                pdfBase64,
                companyName, amount, invoice
            }

            console.log(values)
            const userId = id

            axios.post(`https://plum-cuboid-crest.glitch.me/addInvoice/${userId}`, values)
                .then(res => {
                    console.log(res);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Invoice added successfully' });
                    setCompanyName("")
                    setAmount("")
                    setInvoice("")
                    setLoading(false)
                    setPdfBase64('')
                    const userId = id
                    fetch(`https://plum-cuboid-crest.glitch.me/getInvoice/${userId}`)
                        .then(res => res.json())
                        .then(data => setInvoiceData(data)

                        )
                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add Invoice' });
                    setLoading(false)
                    setCompanyName("")
                    setAmount("")
                    setPdfBase64('')
                    setInvoice("")
                    setLoading(false)
                });

        }
    };
    useEffect(() => {
        const userId = id
        fetch(`https://plum-cuboid-crest.glitch.me/getInvoice/${userId}`)
            .then(res => res.json())
            .then(data => setInvoiceData(data)

            )

    }, [id])

    useEffect(() => {
        const userId = id
        fetch(`https://plum-cuboid-crest.glitch.me/getProductsFromCompanies/${userId}`)
            .then(res => res.json())
            .then(data => setData(data)

            )

    }, [id])


    const viewPDF = (Url) => {
        const pdfMimeType = 'application/pdf';
        ViewDocument(Url, pdfMimeType);

    }
    const ViewDocument = (doc, mimeType) => {
        const newTab = window.open('', '_blank');
        if (mimeType === 'application/pdf') {
            const pdfContent = `
                <embed src="data:application/pdf;base64,${doc}" type="application/pdf" width="100%" height="100%">
            `;
            newTab.document.body.innerHTML = pdfContent;
        } else {
            newTab.document.body.innerHTML = `
                <div>
                    <h2>Unsupported Document Type</h2>
                    <p>The selected document type is not supported for preview.</p>
                </div>
            `;
        }
    };


    useEffect(() => {
        if (showImageComponent && filePath) {
            const newTab = window.open('', '_blank');
            newTab.document.body.innerHTML = `
                <div>
                    <h2>Image</h2>
                    <img src=${filePath} alt="Image" />
                </div>
            `;
        }
    }, [showImageComponent, filePath]);


    const add = () => {
        setAddInvoice(true)
        setViewInvoice(false)
    }


    const view = () => {
        setViewInvoice(true)
        setAddInvoice(false)
    }
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = productsData.filter((d) => {
        return (
            d.invoice_number ||
            d.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(d.price).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(d.selling_price).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(d.quantity).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(d.total_amount).toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.date.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    let totalQuantity = 0;
    let grandTotal = 0;
    let totalPrice = 0;
    let totalSellingPrice = 0;
    filteredData.forEach((d) => {
        totalPrice += parseInt(d.price);
        totalSellingPrice += parseInt(d.selling_price);
        totalQuantity += parseInt(d.quantity);
        grandTotal += parseFloat(d.total_amount);
    });


    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <div style={{ background: "linear-gradient(to bottom, white, gray)", height: "100%", minHeight: "100vh", marginTop: isMobile ? "170px" : "100px" }}>
            <Header />
            <div style={{ display: "flex", marginBottom: "20px" }}>
                <button onClick={add} style={{ width: "50%", border: "none", padding: "10px", fontWeight: "bold", borderRight: "1px solid gray", backgroundColor: addInvoice ? "gray" : "whitesmoke", color: addInvoice ? "white" : "" }}>ADD INVOICE</button>
                <button onClick={view} style={{ width: "50%", border: "none", padding: "10px", fontWeight: "bold", borderRight: "1px solid gray", backgroundColor: viewInvoice ? "gray" : "whitesmoke", color: viewInvoice ? "white" : "" }}>VIEW INVOICE DETAILS</button>
            </div>



            {addInvoice &&

                <div className="d-flex justify-content-around" >

                    <Toast ref={toast} />
                    <form onSubmit={handleSubmit} style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", borderRadius: "8px" }} class="p-5 mt-5">
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Invoice Number:</label>

                            </div>
                            <div class="col-7">
                                <input type="text" className="form-control mx-5"
                                    value={invoice}
                                    placeholder="Enter Invoice Number"
                                    onChange={(e) => setInvoice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Company Name:</label>

                            </div>
                            <div class="col-7">
                                <input type="text" className="form-control mx-5"
                                    value={companyName}
                                    placeholder="Enter Company Name"
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Amount:</label>

                            </div>
                            <div class="col-7">
                                <input type="number" className="form-control mx-5"
                                    placeholder="Enter Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Choose Invoice File:</label>

                            </div>
                            <div class="col-1"></div>
                            <div class="col-7">
                                <input type="file" class="form-control"
                                    onChange={handleFileChange} accept=".pdf"
                                />

                            </div>
                        </div>


                        <button type="submit" class="btn btn-primary btn-lg">Submit</button>

                    </form>

                    <div class="mt-5">
                        <table className="table table-bordered " style={{ minWidth: "800px", height: "100%" }}>
                            <thead>
                                <th style={{ backgroundColor: "gray", color: "white" }}>Invoice Number</th>
                                <th style={{ backgroundColor: "gray", color: "white" }}>companyName</th>
                                <th style={{ backgroundColor: "gray", color: "white" }}>Amount</th>
                                <th style={{ backgroundColor: "gray", color: "white" }}>Invoive</th>

                            </thead>
                            <tbody>

                                {Data.length === 0 && <p>No invoices found</p>}

                                {Data.length !== 0 &&
                                    Data.map((d, i) => (
                                        <tr key={i}>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.invoice}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.company_name}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.amount}</td>
                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}><button onClick={() => viewPDF(d.file_path)}>View PDF</button></td>


                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                    </div>

                </div>
            }


            {viewInvoice &&
                <div className="mx-5 mt-5" >

                    <div className="mb-5 row">
                        <div class="col-1">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Search:</label>

                        </div>
                        <div class="col-3">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <table className="table table-bordered" style={{ minWidth: "1000px" }}>
                        <thead>
                            <th style={{ backgroundColor: "gray", color: "white" }}>Invoice Number</th>
                            <th style={{ backgroundColor: "gray", color: "white" }}>companyName</th>
                            <th style={{ backgroundColor: "gray", color: "white" }}>productName</th>
                            <th style={{ backgroundColor: "gray", color: "white" }}>price</th>
                            <th style={{ backgroundColor: "gray", color: "white" }}>selling Price</th>
                            <th style={{ backgroundColor: "gray", color: "white" }}>Quantity</th>
                            <th style={{ backgroundColor: "gray", color: "white" }}>Amount(price*quanity)</th>
                            <th style={{ backgroundColor: "gray", color: "white" }}>Purchased Date</th>
                        </thead>
                        <tbody>

                            {filteredData.length === 0 && <p>No records found</p>}

                            {filteredData.length !== 0 &&
                                filteredData.filter((d) => searchTerm === "" || d.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || String(d.invoice_number).includes(searchTerm) || d.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || new Date(d.date).toLocaleDateString().includes(searchTerm)).map((d, i) => (

                                    <tr key={i}>
                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.invoice_number}</td>
                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.company_name}</td>
                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.product_name}</td>
                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.price}</td>
                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.selling_price}</td>
                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.quantity}</td>
                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.total_amount}</td>
                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{new Date(d.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            <tr>
                                <td colSpan="3"></td>
                                <td>Total Price: <b>{totalPrice}</b></td>
                                <td>Total selling price: <b>{totalSellingPrice}</b></td>
                                <td>Total Quantity: <b>{totalQuantity}</b></td>
                                <td>Grand Total: <b>{grandTotal.toFixed(2)}</b></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            }
        </div>
    );
};

export default Invoice;