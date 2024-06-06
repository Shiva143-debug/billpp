import { useState } from "react"
import CustomerTable from "./CustomerTable"
import Header from "./Header"
import ProductTable from "./ProductTable"
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';

const Details = ({ id }) => {

    const [view, SetView] = useState("customer")

    const customer = () => {

        SetView("customer")
    }
    const product = () => {

        SetView("product")
    }

    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <div style={{ background: "linear-gradient(to bottom, white, gray)" }}>
            <Header />
            <h1>Details</h1>

            <div>

                <div style={{ display: "flex", marginTop: isMobile ? "130px" : "50px" }}>
                    <button onClick={customer} style={{ width: "50%", border: "none", padding: "10px", fontWeight: "bold", borderRight: "1px solid gray", backgroundColor: view === "customer" ? "gray" : "whitesmoke", color: view === "customer" ? "white" : "" }}>Customer Details</button>
                    <button onClick={product} style={{ width: "50%", border: "none", padding: "10px", fontWeight: "bold", borderRight: "1px solid gray", backgroundColor: view === "product" ? "gray" : "whitesmoke", color: view === "product" ? "white" : "" }}>Product Details</button>
                </div>


                {view === "customer" &&
                    <div style={{ width: "100%", minHeight: "80vh" }}>
                        <CustomerTable id={id} />

                    </div>
                }

                {view === "product" &&

                    <div style={{ width: "100%", overflowX: "auto", minHeight: "80vh" }}>
                        <ProductTable id={id} />

                    </div>

                }
            </div>
        </div>


    )
}

export default Details