import { useState, useEffect } from "react"

const Orders = ({
    transactions, setTransActions, orders, setOrders,
}) => {

    const [transactionRows, setTransActionRows] = useState();
    const [orderRows, setOrderRows] = useState();

    useEffect(()=>{
        let _trows = [];
        let _orows = [];
        if (transactions){
            transactions.forEach((transaction)=>{
                _trows.push(
                    <tr>
                        <td>{transaction.from}</td>
                        <td>{transaction.to}</td>
                        <td>{transaction.coin}</td>
                        <td>{transaction.amount}</td>
                    </tr>
                )
            })
            setTransActionRows(_trows)
        }
        if (orders){
            orders.forEach((order)=>{
                _orows.push(
                    <tr>
                        <td>{order.wallet}</td>
                        <td>{order.coin}</td>
                        <td>{order.amount}</td>
                        <td>{order.filled}</td>
                    </tr>
                )
            })
            setOrderRows(_orows)
        }
    }, [transactions, orders])

    return (
        <div>

            <div className="row">
                <div className="col-12 col-md-6">
                <h1 style={{fontWeight:"1000", fontSize:"24px", marginBottom:"10px"}}>DEX</h1>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Wallet</th>
                            <th>Coin</th>
                            <th>Amount</th>
                            <th>Filled</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orderRows ? orderRows : null
                        }
                    </tbody>
                </table>
                </div>
                <div className="col-12 col-md-6">
                <h1 style={{fontWeight:"1000", fontSize:"24px", marginBottom:"10px"}}>Transactions</h1>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>coin</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                transactionRows ? transactionRows : null
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
      )

}

export default Orders;