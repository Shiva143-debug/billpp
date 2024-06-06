import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Toast } from 'primereact/toast';
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';


function Shopping(props) {
    const id = props.id;
    const date = props.date;
    const [name, setName] = useState(props.name);
    const [Data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState("select");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState('');
    const toastTopRight = useRef(null);



    useEffect(() => {
        const userId = id;
        fetch(`https://plum-cuboid-crest.glitch.me/product/${userId}`)
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
        if (props.selectedRowData) {
            const { product_name, price, quantity } = props.selectedRowData;
            setSelectedOption(product_name);
            setPrice(price);
            setQuantity(quantity);
        } else {
            setSelectedOption("");
            setPrice("");
            setQuantity("");
        }
    }, [props.selectedRowData]);

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        const selectedData = Data.find(d => d.product_name === selectedValue);
        setPrice(selectedData ? selectedData.selling_price : "");
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleSubmit = (e, ref) => {
        e.preventDefault();

        let values = { name: name, date: date, productName: selectedOption, price: price, quantity: quantity };
        console.log(values);

        const userId = id;

        if (props.selectedRowData) {
            const { item_id } = props.selectedRowData;
            axios.put(`https://plum-cuboid-crest.glitch.me/updateItems/${userId}/${item_id}`, values)
                .then(res => {
                    console.log(res.data.message);


                    if (res.data.message.includes("what the store has in stock")) {
                        console.log(res.data.message)
                        props.close(res.data.message, 'warn');
                    } else if (res.data.message.includes("successfully")) {
                        console.log(res.data.message)
                        props.close(res.data.message, 'success');
                    }


                })

        } else {

            axios.post(`https://plum-cuboid-crest.glitch.me/addItems/${userId}`, values)
                .then(res => {
                    console.log(res.data.message);
                    if (res.data.message.includes("successfully")) {
                        console.log(res.data.message);
                        props.close(res.data.message, 'success');
                    } else if (res.data.message.includes("more quantity of")) {
                        console.log(res.data.message);
                        props.close(res.data.message, 'warn');
                    } else {
                        console.log("Unexpected response:", res.data.message);
                    }
                })
                .catch(error => {
                    console.error("Error adding item:", error);
                });


            popClose();
        }


    };

    const popClose = () => {
        setTimeout(() => {
            props.close();
            props.itemsAdded();
        }, 500);
    };

    const isMobile = useMediaQuery('(max-width:768px)');


    return (
        <div>
            <Toast ref={toastTopRight} position="top-right" />

            <div className={isMobile ? "bg-secondary rounded p-2 mb-2" : "bg-secondary rounded p-5 mx-5"} style={{ width: "90%", height: "100%" }}>
                <h2 style={{ color: "white", textAlign: "start" }} className="pb-2 mx-5">{props.selectedRowData ? "Update Items" : "Add Items"}</h2>
                <form className=" rounded" style={{ width: "90%", height: "100%" }} onSubmit={(e) => handleSubmit(e, toastTopRight)}>

                    <div className="mb-5 row">
                        <div class="col-5">
                            <label htmlFor="" className="px-5 fw-bold" style={{ color: "white", fontSize: '20px' }}>Name:</label>
                        </div>
                        <div class="col-6">
                            <input value={name} class=" form-control" disabled style={{ backgroundColor: "black", color: "white" }} />

                        </div>
                    </div>
                    <div className="mb-5 row">
                        <div class="col-5">
                            <label htmlFor="" className="px-5 fw-bold" style={{ color: "white", fontSize: '20px' }}>product Name:</label>
                        </div>
                        <div class="col-6">
                            <select id="id" class=" form-control" value={selectedOption}
                                onChange={handleSelectChange} disabled={!!props.selectedRowData}>
                                <option value="select">Select</option>

                                {Data.map((d) => (
                                    <option key={d.id} value={d.product_name}>
                                        {d.product_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mb-5 row">
                        <div class="col-5">
                            <label htmlFor="" className="px-5 fw-bold" style={{ color: "white", fontSize: '20px' }}>Price:</label>
                        </div>
                        <div class="col-6">
                            <input value={price} class=" form-control" disabled />

                        </div>
                    </div>

                    <div className="mb-5 row">
                        <div class="col-5">
                            <label htmlFor="" className="px-5 fw-bold" style={{ color: "white", fontSize: '20px' }}>Quantity:</label>
                        </div>
                        <div class="col-6">
                            <input type="number" value={quantity} placeholder='Enter quantity' class=" form-control" onChange={handleQuantityChange} />

                        </div>
                    </div>

                    <div className="d-flex justify-content-end align-items-end">
                        <button type="submit" onClick={popClose} class="btn btn-primary btn-lg mx-3">{props.selectedRowData ? "Update" : "+ Add"} </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Shopping