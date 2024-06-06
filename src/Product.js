import { useState, useRef } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Header from './Header'
import "./Home.css"
import { Toast } from 'primereact/toast';
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';

function Product({ id }) {
    const [values, setValues] = useState({
        invoice: "",
        company: "",
        product: "",
        price: "",
        sellingPrice: "",
        quantity: "",
        recievedDate: ""
    })
    const navigate = useNavigate();
    const toast = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.invoice) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Inoice Number' });
            return;
        }

        else if (!values.company) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter companyName' });
            return;
        }
        else if (!values.product) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter productName' });
            return;
        }

        else if (!values.price) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter price' });
            return;
        }
        else if (!values.sellingPrice) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter sellingPrice' });
            return;
        }

        else if (!values.quantity) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter quantity' });
            return;
        }
        else if (!values.recievedDate) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter recievedDate' });
            return;
        }
        else {
            const userId = id
            axios.post(`https://plum-cuboid-crest.glitch.me/addproduct/${userId}`, values)
                .then(res => {
                    console.log(res);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'product added successfully' });
                    setTimeout(() => {
                        navigate("/home")
                    }, 1000)
                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add product' });

                });
        }
    };

    const onBack = () => {
        navigate("/home")
    }


    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <>
            <Header />
            <Toast ref={toast} />

            <div className="container-fluid p-5" style={{ background: "linear-gradient(to top, black, gray)", minHeight: "100vh" }}>
                <h2 style={{ color: "white", textAlign: "start",marginTop:isMobile?"160px" :"50px"}} className="pb-2">Add Product</h2>
                <form className=" rounded p-5" style={{ width: "100%", minHeight: "100%", background: "linear-gradient(to bottom, white, gray)" }} onSubmit={handleSubmit}>

                    <div className="mb-5 row">
                        <div class="col-2">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '18px' }}>Invoice Number:</label>
                        </div>
                        <div class="col-2">
                            <input type="text" placeholder="Enter Invoice Number" className="form-control mx-5"
                                onChange={e => setValues({ ...values, invoice: e.target.value })} />
                        </div>
                        <div class="col-2"></div>

                        <div class="col-2">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '18px' }}>Company Name:</label>
                        </div>
                        <div class="col-2">
                            <input type="text" placeholder="Enter company Name" className="form-control mx-5"
                                onChange={e => setValues({ ...values, company: e.target.value })} />
                        </div>

                    </div>

                    <div className="mb-5 row">
                        <div class="col-2">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '18px' }}>Product Name:</label>
                        </div>
                        <div class="col-2">
                            <input type="text" placeholder="Enter product Name" className="form-control mx-5"
                                onChange={e => setValues({ ...values, product: e.target.value })} />
                        </div>

                        <div class="col-2"></div>

                        <div class="col-2">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '18px' }}>price:</label>

                        </div>
                        <div class="col-2">
                            <input type="number" placeholder="Enter price" className="form-control mx-5"
                                onChange={e => setValues({ ...values, price: e.target.value })} />
                        </div>
                    </div>
                  
                    <div className="mb-5 row">
                        <div class="col-2">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '18px' }}>Selling price:</label>

                        </div>
                        <div class="col-2">
                            <input type="number" placeholder="Enter selling price" className="form-control mx-5"
                                onChange={e => setValues({ ...values, sellingPrice: e.target.value })} />
                        </div>
                        <div class="col-2"></div>

                        <div class="col-2">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '18px' }}>Quantity:</label>

                        </div>
                        <div class="col-2">
                            <input type="number" placeholder="Enter quantity" className="form-control mx-5"
                                onChange={e => setValues({ ...values, quantity: e.target.value })} />
                        </div>
                    </div>

       
                    <div className="mb-5 row">
                        <div class="col-2">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Received Date:</label>

                        </div>
                        <div class="col-2">
                            <input type="date" placeholder="Enter Recieved date" className="form-control mx-5"
                                onChange={e => setValues({ ...values, recievedDate: e.target.value })} />
                        </div>
                    </div>
                    <div className="mb-5 mt-5 d-flex justify-content-around ">
                        <button type="button" class="btn btn-info btn-lg" onClick={onBack}>Back</button>
                        <button type="submit" class="btn btn-primary btn-lg">ADD</button>
                    </div>
                </form>
            </div>
        </>
    );



}

export default Product