
import Header from './Header'
import "./Home.css"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import Shopping from './Shopping';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';

import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";

function Home({ id }) {
    const [Data, setData] = useState([])
    const [selectedOption, setSelectedOption] = useState("select");
    const [address, setAddress] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [date, setDateChange] = useState(new Date().toISOString().split('T')[0]);
    const [grandTotal, setGrandTotal] = useState(0);

    const [data, setdata] = useState([])
    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

    const [showProductCart, setShowProductCart] = useState(false);
    const toast = useRef(null);

    const [errorMessage, setErrorMessage] = useState(null);
    const productbuttonClcik = () => {
        setVisible(true)
    }

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        const selectedData = Data.find(d => d.name === selectedValue);
        console.log(selectedData)
        setAddress(selectedData ? selectedData.address : "");
        setContactNo(selectedData ? selectedData.contact_no : "");


        setShowProductCart(true)
    };

    const onHide = (isAction, severityName) => {
        if (isAction) {
            if (severityName === 'warn') {
                toast.current.show({ severity: severityName, summary: 'Warning', detail: isAction });
            } else {
                toast.current.show({ severity: severityName, summary: 'Success', detail: isAction });

            }
        }
        setVisible(false)
        setVisibleEdit(false)
    }

    const itemsAddedToCart = () => {
        setIsLoading(true);
    }

    const handleDelete = (item_id) => {

        setIsLoading(true);
        const userId = id;
        fetch(`https://plum-cuboid-crest.glitch.me/items/${parseInt(item_id)}?user_id=${userId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json();

            })

            .then(() => {

                toast.current.show({ severity: 'success', summary: 'Success', detail: "Item Deleted successfully" });
                setdata((prevItems) => prevItems.filter((item) => item.item_id !== item_id));
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error during item deletion:', error);
            });
    };

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
        if (selectedOption !== "select") {

            fetch(`https://plum-cuboid-crest.glitch.me/items/${userId}/${selectedOption}`)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else if (res.status === 404) {
                        setErrorMessage("No records found");
                        setdata([]); // Clear data if no records found
                        setGrandTotal(0); // Reset grand total if no records found
                        return [];
                    } else {
                        throw new Error("Failed to fetch data");
                    }
                })
                .then((itemsData) => {
                    // Only update data and grand total if there are items
                    if (itemsData && itemsData.length > 0) {
                        let total = 0;
                        itemsData.forEach((d) => {
                            total += d.total_amount;
                        });
                        setdata(itemsData);
                        setGrandTotal(total);
                        setIsLoading(false)
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setErrorMessage("An error occurred while fetching data");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [selectedOption, isLoading, data, id]);


    const handleEdit = (rowData) => {
        setSelectedRowData(rowData);
        setVisibleEdit(true);
    }


    const navigate = useNavigate();

    const proceedToBuy = () => {
        // let allQuantitiesValid = true
        const orderDetails = {
            selectedOption,
            address,
            contactNo,
            grandTotal,
            items: data,
            date
        };

        orderDetails.items.forEach((item) => {
            const deductValues = {
                productName: item.product_name,
                quantity: item.quantity
            };
            const userId = id;

            fetch(`https://plum-cuboid-crest.glitch.me/deductProductQuantity/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deductValues),
            })
                .then((response) => response.json())
                .then(response => {
                    console.log(response.message);

                    if (response.message === undefined) {
                        navigate('/checkout', { state: { orderDetails, id: id } });
                    }
                    else if (response.message.includes("greater than what the store has in stock")) {
                        toast.current.show({ severity: 'warn', summary: 'Warning', detail: response.message });
                        console.log("greater than what the store has in stock")


                    }
                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: err.message });
                });
        });

    }

    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <>
            <Header />
            <Toast ref={toast} />

            <div className="container-fluid p-5" style={{ background: "linear-gradient(to top, black, gray)", minHeight: "100vh", marginTop: isMobile ? "160px" : "50px" }}>
                <h2 style={{ color: "white", textAlign: "start" }} className="heading pb-2 mt-5">ADD PRODUCTS INTO CART</h2>
                <div className=" rounded p-5" style={{ width: "100%", minHeight: "100%", background: "linear-gradient(to bottom, white, gray)" }} >
                    <div className="mb-5 row">
                        <div class="col-3">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Name:</label>
                        </div>
                        <div class="col-7">
                            <select id="id" class="form-control" value={selectedOption}
                                onChange={handleSelectChange}>
                                <option value="select">Select</option>
                                {Data.map((d) => (
                                    <option key={d.customer_id} value={d.name}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-5 row">
                        <div class="col-3">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Address:</label>
                        </div>
                        <div class="col-7">
                            <p>{address}</p>
                            <hr />
                        </div>
                    </div>

                    <div className="mb-5 row">
                        <div class="col-3">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>contact No:</label>
                        </div>
                        <div class="col-7">
                            <p>{contactNo}</p>
                            <hr />
                        </div>
                    </div>
                    <div className="mb-5 row">
                        <div class="col-3">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Date:</label>
                        </div>
                        <div class="col-7">
                            <input type="date" className='form-control' value={date} onChange={(e) => setDateChange(e.target.value)} />
                        </div>
                    </div>


                    {showProductCart &&
                        <div className='addButtons d-flex justify-content-end mt-3 mb-5 mx-3'>
                            <button type="button" onClick={productbuttonClcik} class="btn btn-outline-primary btn-lg mx-3">ADD Items+</button>
                        </div>
                    }
                    {isLoading && (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
                        </div>
                    )}
                    {!isLoading && showProductCart && (
                        <div className='d-flex flex-column'>

                            <div className="mobile-table bg-light rounded mb-5" style={{ width: "100%", overflowX: "auto", height: "100%" }}>
                                <h1 className='h1'>Products in Cart</h1>

                                {errorMessage && data.length === 0 && <p>{errorMessage}</p>}

                                {data.length > 0 && (
                                    <table className="table table-bordered" style={{ minWidth: "300px" }}>
                                        <thead>
                                            <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>productName</th>
                                            <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Prize</th>
                                            <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Quantity</th>
                                            <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Total_Amount</th>
                                            <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Actions</th>
                                        </thead>
                                        <tbody>
                                            {data.map((d, i) => (
                                                <tr key={i}>
                                                    <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{d.product_name}</td>
                                                    <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{d.price}</td>
                                                    <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{d.quantity}</td>
                                                    <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{d.total_amount}</td>
                                                    <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>
                                                        {!isMobile &&
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                onClick={() => handleDelete(d.item_id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        }
                                                        {isMobile &&
                                                            <MdDelete onClick={() => handleDelete(d.item_id)} />}
                                                        {!isMobile &&
                                                            <button
                                                                type="button"
                                                                className="btn btn-warning mx-2"
                                                                onClick={() => handleEdit(d)}
                                                            >
                                                                Update
                                                            </button>
                                                        }
                                                        {isMobile && <GrUpdate onClick={() => handleEdit(d)} />}


                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                <div className="d-flex justify-content-end align-items-end">
                                    <div>
                                        <strong>Grand Total:</strong> {grandTotal}
                                    </div>
                                </div>
                            </div>

                            <div style={{ justifyContent: isMobile ? "center" : "end" }} className='d-flex  mt-3 mb-5'>

                                <button type="button " style={{ float: "right", width: "300px" }} onClick={proceedToBuy} class="btn btn-success btn-lg">
                                    Proceed to Buy
                                </button>
                            </div>

                        </div>
                    )}

                </div>




                <Dialog visible={visible} style={{ width: isMobile ? "400px" : '50vw', height: isMobile ? "600px" : '' }} onHide={onHide} >
                    <Shopping close={onHide} name={selectedOption} date={date} itemsAdded={itemsAddedToCart} id={id} />
                </Dialog>
                <Dialog visible={visibleEdit} style={{ width: isMobile ? "400px" : '50vw', height: isMobile ? "600px" : '' }} onHide={onHide} >
                    <Shopping close={onHide} name={selectedOption} date={date} itemsAdded={itemsAddedToCart} selectedRowData={selectedRowData} id={id} />
                </Dialog>

            </div>
        </>

    )
}

export default Home