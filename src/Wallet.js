import React, { useEffect, useState } from 'react';
import { Client } from 'xrpl';
import Logo from './xrplogo.png'

const WalletListener = ({ setBalance, wallet, setDashOtherCoins }) => {
    const [lBalance, setLBalance] = useState();
  const [walletSeed, setWalletSeed] = useState();
  const [status, setStatus] = useState('Disconnected');
  const [walletAddress, setWalletAddress] = useState();
  const [otherCoins, setOtherCoins] = useState();
  const convertXrpString = (stringValue) => {
  const numberValue = parseInt(stringValue);
  const decimals = 6;
  const result = numberValue / Math.pow(10, decimals);
  return result;
  }

  const getAccountCurrencies = async (accountAddress, client) => {
    console.log(accountAddress)
    try {
      const accountCurrenciesRequest = {
        command: 'account_lines',
        account: accountAddress,
        ledger_index: 'validated'
      };
      console.log(accountCurrenciesRequest)
      const response = await client.request(accountCurrenciesRequest);
      console.log("AL", response)
      let accountLines = response.result.lines
      let aLines = []
      let dashCoins = [];
      accountLines.forEach((line) => {
        aLines.push(
          <tr>
            <td>{line.balance}</td>
            <td>{line.currency}</td>
          </tr>
        )
        dashCoins.push(
          <div className='RippleAmountParent'  style={{color:'white'}}>
            <h1>{line.balance} {line.currency}</h1>
            <img style={{width:'50px', height:'50px', margin: '20px', }} src={Logo}></img>
          </div>
        )
      })
      console.log(dashCoins)
      setDashOtherCoins(dashCoins)
      setOtherCoins(aLines)
    } catch (error) {
      console.error('Error:', error);
      return {
        receiveCurrencies: [],
        sendCurrencies: []
      };
    }
  };
  useEffect(()=>{
    if (wallet){
        console.log("setting wallet")
        console.log(wallet)
        setWalletAddress(wallet.classicAddress)
        setWalletSeed(wallet.seed)
    }
  }, [wallet])

  useEffect(() => {
    if (walletAddress){
        const client = new Client('wss://s.altnet.rippletest.net:51233'); // Use Ripple Testnet

        const connectClient = async () => {
        try {
            setStatus('Connecting...');
            await client.connect();
            setStatus('Connected');
            fetchBalance(); // Fetch initial balance
        } catch (error) {
            console.error('Error connecting to XRPL:', error);
            setStatus('Disconnected');
        }
        };

        const fetchBalance = async () => {
        try {
            const response = await client.request({
            command: 'account_info',
            account: walletAddress,
            ledger_index: 'validated',
            });
            console.log(response)
            let currencies = getAccountCurrencies(walletAddress, client)
            let _balance = convertXrpString(response.result.account_data.Balance)
            setBalance(_balance);
            setLBalance(_balance)
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
        };

        connectClient();

        // Set up interval to fetch balance every second
        const intervalId = setInterval(fetchBalance, 1000);

        // Clean up on component unmount
        return () => {
        clearInterval(intervalId);
        client.disconnect();
        };
    }
  }, [walletAddress]);

  return (
    <div>
      {/* <table className='table'>
        <thead>
          <tr>
            <th>currency</th>
            <th>balance</th>
          </tr>
        </thead>
        <tbody>
          {otherCoins ? otherCoins : null}
        </tbody>
      </table>
      <h1>Wallet Listener</h1>
      <p>Status: {status}</p>
      <p>Wallet Address: {walletAddress}</p>
      <p>Seed: {walletSeed}</p>
      <p>Balance: {lBalance ? `${lBalance} xrps` : 'Loading...'}</p> */}
    </div>
  );
};

export default WalletListener;