import { useState, useEffect } from "react"

function CustomerTable({ id }) {


    const [Data, setData] = useState([])
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const userId = id;
        fetch(`https://plum-cuboid-crest.glitch.me/customer/${userId}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 404) {
                    setErrorMessage("No records found");
                    return [];
                } else {
                    throw new Error("Failed to fetch data");
                }
            })
            .then(data => setData(data))
            .catch(error => {
                console.error("Error fetching data:", error);
                setErrorMessage("An error occurred while fetching data");
            });
    }, [id]);

    return (

        <div >
            <h1>Customer Table</h1>
            {errorMessage && <p>{errorMessage}</p>}


            {Data.length > 0 && (
                <table className="table table-bordered" style={{ minWidth: "300px" }}>
                    <thead>
                        <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Name</th>
                        <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>Address</th>
                        <th style={{ backgroundColor: "gray", color: "white", textAlign: "center" }}>contactNo</th>
                    </thead>
                    <tbody>
                        {Data.map((d, i) => (
                            <tr key={i}>
                                <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{d.name}</td>
                                <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{d.address}</td>
                                <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6', textAlign: "center" }}>{d.contact_no}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>


    );

}

export default CustomerTable