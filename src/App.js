import './App.css';
import Card from './Card';
import DarkBG from './dark.jpeg'
import Logo from './xrplogo.png'
import NavBar from './NavBar';
import CoinModal from './CoinModal';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import XrpLogo from "./xrp-xrp-logo.png"

// Other repos
import { Client, xrpToDrops, dropsToXrp } from "xrpl";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import WalletListener from "./Wallet";
import Orders from "./Orders";
import 'react-toastify/dist/ReactToastify.css';
import "./output.css"
import axios from "axios";
import CreateTrustLine from "./createTrustLine";
import establishTrustline from "./trustLine";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 40 // this is needed to tell the amount of px that should be visible.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    partialVisibilityGutter: 30 // this is needed to tell the amount of px that should be visible.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    partialVisibilityGutter: 300 // this is needed to tell the amount of px that should be visible.
  }
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(179, 145, 210)',
    borderRadius: '30px'
  },
};

function App() {


  const [counterpartyWallet, setCounterpartyWallet] = useState("rJDHLH3Ahr5fAYFTRsCq5UtRW2sfN9GeX4");
  const [currency, setCurrency] = useState("MFX");
  const [limit, setLimit] = useState("100");
  const [dashOtherCoins, setDashOtherCoins] = useState();
  const [transactions, setTransActions] = useState([]);
  const [orders, setOrders] = useState([]);
  const getFlatCoinsUrl = "http://0.0.0.0:8000/api/v1/coins/flat/79fce996-76db-4c21-a54b-32b2f7788cff/faucet"
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [client] = useState(new Client("wss://s.altnet.rippletest.net:51233"));
  const [paymentButtonText, setPaymentButtonText] = useState(
    "Wait for the wallet to be funded..."
  );
  const [statusText, setStatusText] = useState("");


  const createASellOffer = () => {
    setOrders((prevOrders) => {
      return [...prevOrders, {wallet:wallet.classicAddress, coin:"CFX", amount:1, filled:false}] 
    })
  }

  useEffect(() => {
    toast.info("connecting to ripple hang on!", {theme:"colored"})
    client.connect().then(() => {
      toast.success("Connected to ripple!", {theme:"colored"})
      toast.info("funding test wallet one moment", {theme:"colored"})
      client.fundWallet().then((fund_result) => {
        console.log(fund_result);
        setBalance(fund_result.balance);
        setWallet(fund_result.wallet);
        console.log(fund_result.wallet)
        setPaymentButtonText("Send a 22 XRP Payment!");
        toast.success(`wallet is funded with ${fund_result.balance} xrp`, {theme:"colored"})
      });
    });
  }, []);

  async function sendPayment(walletAdress, amount) {
    toast.info('Creating a payment instruction', {theme:"colored"});
    const tx = {
      TransactionType: "Payment",
      Account: wallet.address,
      Amount: xrpToDrops(String(1000)),
      Destination: "rpwAr7NjsNdZXtNuXcUZr3v6PDJN47bE7x"
    };
    setTransActions((prevTransactions)=>{
      return [...prevTransactions, {from:wallet.address, to:"rpwAr7NjsNdZXtNuXcUZr3v6PDJN47bE7x", coin:"xrp", amount:22}]
    })
    // Submit the transaction --------------------------------------------
    const submitted_tx = await client.submitAndWait(tx, {
      autofill: true, // Adds in fields that can be automatically set like fee and last_ledger_sequence
      wallet: wallet
    });

    // Check transaction results -----------------------------------------
    console.log(
      "Transaction result:",
      submitted_tx.result.meta.TransactionResult
    );

    toast.success('Payment is sent!', {theme:"colored"});
    // Look up the new account balances by sending a request to the ledger
    const account_info = await client.request({
      command: "account_info",
      account: wallet.address
    });

    // See https://xrpl.org/account_info.html#account_info ---------------
    const balance = account_info.result.account_data.Balance;
    console.log(`New account balance: ${balance} drops`);
    setBalance(dropsToXrp(balance));
  }

  const _createTrustLine = () => {
    establishTrustline(wallet.classicAddress, wallet.seed, counterpartyWallet, currency, limit, toast).catch(console.error);
  }

  const fundAccountWithFlatCoins = () => {
    axios.post(getFlatCoinsUrl, {
      "id": "79fce996-76db-4c21-a54b-32b2f7788cff",
      "reciever_addreess": wallet.classicAddress,
      "amount": 10.0
    })
    .then((response)=>{
      console.log(response)
    })
    .catch((response)=>console.log(response))
  }

  let subtitle;

  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [swapChosen, setSwapChosen] = useState('');


  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {

  }

  function closeModal() {
    setIsOpen(false);
  }


  return (
    <>
    <ToastContainer />
      <img src={DarkBG} style={{zIndex:'-100', width:'100vw', height:'60%', position:'absolute'}}></img>
      <Modal
        style={customStyles}
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <CoinModal boolean={swapChosen}></CoinModal>
      </Modal>

    <Carousel partialVisible={true} responsive={responsive}>
      <div className='RippleAmountParent' style={{color:'white'}}>
      <h1>{balance}</h1>
      <img style={{width:'50px', height:'50px', margin: '20px', color:'white'}} src={XrpLogo}></img>
    </div>
    {dashOtherCoins ? dashOtherCoins : null}
  </Carousel>

    <div className="App"> 
          <Carousel partialVisible={true} responsive={responsive}>
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
    {
      wallet ? <WalletListener setBalance={setBalance} wallet={wallet} setDashOtherCoins={setDashOtherCoins}  /> : null
    }
    <Card walletAdress={wallet ? wallet.classicAddress : "wallet is being created"}></Card> 
    <div className='TokenRows'>

    <div onClick={createASellOffer} className='Block1'>
    <h2>Swap</h2>
    </div>


    <div onClick={sendPayment} className='Block1'>
    <h2>Sell</h2>
    </div>

    </div>
    </div>
    <div className='container'>

      {/* <div style={{display:"flex", flexWrap:"wrap", columnGap:"10px"}}>
      {
        balance > 0  ? <button className="btn btn-primary" onClick={sendPayment}>{paymentButtonText}</button> : "setting up a demo wallet one moment"
      }
      {
        wallet ?
        <>
          <button className="btn btn-primary" onClick={createASellOffer}>sell offer of 22 xrp</button>
          <button className="btn btn-primary" onClick={fundAccountWithFlatCoins}>fund wallet with flat coin</button>
        </>
        :
        null
      }
      </div> */}
      <br />
      <Orders transactions={transactions} setTransActions={setTransActions} orders={orders} setOrders={setOrders} />
      <h1 style={{fontWeight:"1000", fontSize:"24px", marginBottom:"10px"}}>Trustline Creator</h1>
      <CreateTrustLine setCounterpartyWallet={setCounterpartyWallet} setCurrency={setCurrency} setLimit={setLimit} createTrustLine={_createTrustLine} />
      <p>rJDHLH3Ahr5fAYFTRsCq5UtRW2sfN9GeX4</p>
    </div>
    <br />
    </>
  );
}

export default App;
