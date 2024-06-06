import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';
import Customer from "./Customer"
import Product from "./Product"
import Shopping from "./Shopping"
import Home from "./Home"
import Reports from "./Reports"
import Login from "./Login"
import "bootstrap/dist/css/bootstrap.min.css"
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Checkout from "./Checkout";
import Invoice from "./Invoice";

import { useEffect, useState } from "react";
import Details from "./Details";

function App() {

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId');
  });


  useEffect(() => {
    document.title = "shop";
  }, []);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);


  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setUserId={setUserId} />}></Route>
        <Route path="/home" element={<Home id={userId} />}></Route>
        <Route path="/customer" element={<Customer id={userId} />}></Route>
        <Route path="/product" element={<Product id={userId} />}></Route>
        <Route path="/shopping" element={<Shopping id={userId} />}></Route>
        <Route path="/checkout" element={<Checkout id={userId} />}></Route>
        <Route path="/reports" element={<Reports id={userId} />}></Route>
        <Route path="/invoice" element={<Invoice id={userId} />}></Route>
        <Route path="/details" element={<Details id={userId} />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
