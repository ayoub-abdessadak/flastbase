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

// A common flow of creating a test account and sending XRP
function App() {
  const [counterpartyWallet, setCounterpartyWallet] = useState();
  const [currency, setCurrency] = useState();
  const [limit, setLimit] = useState();
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
      return [...prevOrders, {wallet:"somewallet", coin:"CNX", amount:100, filled:false}] 
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
    establishTrustline(wallet.classicAddress, wallet.seed, counterpartyWallet, currency, limit).catch(console.error);
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

  return (
    <div className="container">
      <ToastContainer />
      {
        wallet ? <WalletListener setBalance={setBalance} wallet={wallet}  /> : null
      }
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
      <p>
        <i>{statusText}</i>
      </p>
      <br></br>
      <Orders transactions={transactions} setTransActions={setTransActions} orders={orders} setOrders={setOrders} />
      <br></br>
      <hr></hr>
      <br></br>
      <h1 style={{fontWeight:"1000", fontSize:"24px", marginBottom:"10px"}}>Trustline Creator</h1>
      <CreateTrustLine setCounterpartyWallet={setCounterpartyWallet} setCurrency={setCurrency} setLimit={setLimit} createTrustLine={_createTrustLine} />
    </div>
  );
}

// Search xrpl.org for docs on transactions + requests you can do!
export default App;
