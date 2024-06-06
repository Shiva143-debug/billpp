

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const slides = [
    {
      id: 1,
      image: 'https://res.cloudinary.com/dxgbxchqm/image/upload/v1703834789/f1_nnqcn3.jpg',
      heading: 'First Slide Heading',
      text: 'Some text related to the first slide.',
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/dxgbxchqm/image/upload/v1703835507/f3_t4djvg.jpg',
      heading: 'Second Slide Heading',
      text: 'Some text related to the second slide.',
    },
    // Add more slide objects as needed
  ];
  const navigate = useNavigate();
  const onLogin=()=>{
    navigate("/login")
  }


  return (
    <Carousel interval={2000}>
      
      {slides.map((slide) => (
        <Carousel.Item key={slide.id}>
          <div
            className="picture d-block"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100vh', 
            }}
          />
          <Carousel.Caption>
          <button className='btn btn-primary' onClick={onLogin}>Login</button>
            <h3>{slide.heading}</h3>
            <p>{slide.text}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MainPage;
