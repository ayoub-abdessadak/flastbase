import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import Logo from './xrplogo.jpg'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './CarouselComponent.css'; // Make sure to create and import the custom CSS

const CarouselComponent = () => {
    return (
        <div className="carousel-wrapper">
            <Carousel
                showThumbs={false}
                showStatus={false}
                infiniteLoop={true}
                centerMode={true}
                centerSlidePercentage={33.33}
                emulateTouch={true}
                showArrows={true}
            >
                <div className='RippleAmountParent'>
      <h1>2737738.92</h1>
      <img style={{width:'50px', height:'50px', margin: '20px'}} src={Logo}></img>

    </div>
    <div className='RippleAmountParent'>
      <h1>2737738.92</h1>
      <img style={{width:'50px', height:'50px', margin: '20px'}} src={Logo}></img>

    </div>
    <div className='RippleAmountParent'>
      <h1>2737738.92</h1>
      <img style={{width:'50px', height:'50px', margin: '20px'}} src={Logo}></img>

    </div>
    <div className='RippleAmountParent'>
      <h1>2737738.92</h1>
      <img style={{width:'50px', height:'50px', margin: '20px'}} src={Logo}></img>

    </div>
            </Carousel>
        </div>
    );
}

export default CarouselComponent;
