import { useState, useRef } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Header from './Header'
import { Toast } from 'primereact/toast';
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';

function Customer({ id }) {
    const [values, setValues] = useState({
        id,
        name: "",
        address: "",
        contactNo: ""
    })
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.name) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter name' });
            return;
        }
        else if (!values.address) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Address' });
            return;
        }

        else if (!values.contactNo) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter contact number' });
            return;
        }
        else {

            //   const userId =id
            axios.post("https://plum-cuboid-crest.glitch.me/addCustomer", values)
                .then(res => {
                    console.log(res);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Customer added successfully' });
                    setTimeout(() => {
                        navigate("/home")
                    }, 1000)

                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: "Contact number already exists in the table" });
                    setTimeout(() => {
                        navigate("/home")
                    }, 1000)

                });
        }
    };

    const onBack = () => {
        navigate("/home")
    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10 && /^\d*$/.test(value)) {
            setValues({ ...values, contactNo: value });
        }
    };


    const isMobile = useMediaQuery('(max-width:768px)');
    return (
        <>
            <Header />
            <Toast ref={toast} />

            <div className="container-fluid p-5" style={{ background: "linear-gradient(to top, black, gray)", minHeight: "100vh" }}>
                <h2 style={{ color: "white", textAlign: "start", marginTop: isMobile ? "160px" : "50px" }} className="pb-2">Add Customer</h2>
                <form className="rounded pt-5 pb-2" style={{ width: "100%", minHeight: "100%", background: "linear-gradient(to bottom, white, gray)" }} onSubmit={handleSubmit}>

                    <div className="mb-5 row">
                        <div class="col-5">
                            <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Name:</label>
                        </div>
                        <div class="col-6">
                            <input type="text" placeholder="Enter Name" className="form-control "
                                onChange={e => setValues({ ...values, name: e.target.value })} />
                        </div>
                    </div>
                    <div className="mb-5 row">
                        <div class="col-5">
                            <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Address:</label>
                        </div>
                        <div class="col-6">
                            <input type="text" placeholder="Enter Address" className="form-control"
                                onChange={e => setValues({ ...values, address: e.target.value })} />
                        </div>
                    </div>
                    <div className="mb-5 row">
                        <div class="col-5">
                            <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Contact No:</label>
                        </div>
                        <div class="col-6">

                            <input
                                type="number"
                                placeholder="Enter contact no"
                                maxLength={10}
                                title="Only up to 10 digits are allowed"
                                className="form-control"
                                value={values.contactNo}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className={isMobile ? "mb-5 mt-5 d-flex justify-content-around" : "mb-5 mt-5 mx-5 d-flex justify-content-between"}>
                        <button type="button" onClick={onBack} class="btn btn-info btn-lg">Back</button>
                        <button type="submit" class="btn btn-primary btn-lg">ADD</button>
                    </div>
                </form>

            </div>

        </>
    );

}

export default Customer