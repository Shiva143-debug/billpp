// import QRCode from 'qrcode.react';
// import Header from './Header'
// import {  useNavigate ,useLocation} from 'react-router-dom';



// function Upi(props) {

//     const navigate = useNavigate();
//     const location = useLocation();
//     const { data } = location.state || {};


//     const {selectedOption,date,paymentType,grandTotal} = data;


//     const onBack = () => {
    
//         navigate("/checkout");
    
//     }
//     const paymentCompleted=()=>{

//         const exportData={
//             selectedOption,date,paymentType,grandTotal
//         }
//         fetch('http://localhost:8083/payment', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(exportData),
//         })
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data.message);

                
//                 // resetDataAndGrandTotal();
//             })
//             .catch(error => {
//                 console.error('Error to pay:', error);
//             });

//             setupishow(false)
//             setcheckoutshow(true)
//     }


//     return (
//         <>
//         <Header />
//         <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
//             <QRCode style={{height:"500px",width:"500px",marginTop:"100px"}} value={"shiva"} />
//             <button type="button" class="btn btn-info btn-lg mt-5" onClick={onBack}>Back</button>
//             <button type="button" class="btn btn-info btn-lg mt-5" onClick={paymentCompleted}>paymentCompleted</button>
//         </div>
//         </>
//     )
// }
// export default Upi


  // const checkQuantitySql = "SELECT quantity FROM uniquetable1 WHERE product_name = $1 and user_id = $2";

  // pool.query(checkQuantitySql, [productName,user_id], (err, result) => {
  //   if (err) {
  //     console.error("Error inserting data into items table:", err);

  //   }
  //   console.log(result.rows[0].quantity)


  //   if ((result[0].quantity - quantity) >= 0) {

  //     const sql = "INSERT INTO items1 (user_id,name, date, product_name, price, quantity, total_amount) VALUES ($1,$2,$3,$4,$5,$6,$7)";
  //     const values = [user_id,name, date, productName, parseInt(price), parseInt(quantity), ttl];
  //     console.log(values);

  //     pool.query(sql, values, (err, result) => {
  //       if (err) {
  //         console.error("Error inserting data into items table:", err);
  //         return res.json(err);
  //       }
  //       return res.json(result);
  //     });

  //   } else {
  //     console.log({ message: `${Math.abs(result[0].quantity - quantity)} quantity of ${productName} is greater that you entered` })
  //     return res.json({ message: `${Math.abs(result[0].quantity - quantity)} quantity of ${productName} is greater that you entered` });
  //   }

  // });