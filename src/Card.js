import React from 'react'
import './Card.css'
import CardBG from './smooth.jpg'
import Logo from './Flatbase.png'

export default function Card({walletAdress}) {
  return (
    <div className="Card-Parent">
        <img style={{position:'absolute', top:0, width:'200px', margin:'5px'}} src={Logo}></img>
        <h2 className='CardHolderName'>{walletAdress}</h2>
        <img src={CardBG} className="cover-image" />
    </div>
  )
}
