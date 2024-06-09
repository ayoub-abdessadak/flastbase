import React from 'react'
import './CoinModal.css'

export default function CoinModal({boolean}) {
  return (
    <>    
    <div className='Modal-Parent'>
    <div>
    <h2>{boolean} Coin</h2>
    <p>Enter amount</p>
    <input></input>
    {boolean == 'Sell' ? <p>Enter address</p> : <></>}
    {boolean == 'Sell' ? <input></input> : <></>}
    <br></br>
    <br></br>
    <button>Confirm</button>
    </div>
    </div>
    </>

  )
}
