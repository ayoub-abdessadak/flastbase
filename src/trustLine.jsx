import { Wallet, Client, } from 'xrpl';

async function establishTrustline(wallet, secret, counterparty, currency, limit, toast) {
  console.log(22, wallet, secret, counterparty, currency, limit, toast)
  toast.info("requesting a trustline", {theme:"colored"})
    const net = "wss://s.altnet.rippletest.net:51233";
    const client = new Client(net)
    await client.connect()
    const standby_wallet = Wallet.fromSeed(secret)
    // const operational_wallet = Wallet.fromSeed(secret)
    const trustSet_tx = {
      "TransactionType": "TrustSet",
      "Account": wallet,
      "LimitAmount": {
        "currency": currency,
        "issuer": counterparty,
        "value": limit
      }
    }
    const ts_prepared = await client.autofill(trustSet_tx)
    const ts_signed = standby_wallet.sign(ts_prepared)
    const ts_result = await client.submitAndWait(ts_signed.tx_blob)
    console.log("trustline", ts_result)
    toast.info("trustline probably created", {theme:"colored"})
  } //End of oPcreateTrustline

export default establishTrustline;