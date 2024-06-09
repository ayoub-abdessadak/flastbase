import { useRef } from "react";
const createTrustLine = ({
    setCounterpartyWallet,
    setCurrency,
    setLimit,
    createTrustLine
}) => {
    const cpw = useRef();
    const currency = useRef();
    const limit = useRef();
    return (
        <div style={{display:"flex", columnGap:"5px"}}>
            <input ref={cpw} type="text" onKeyUp={()=>{setCounterpartyWallet(cpw.current.value)}} className="form-control" placeholder="counterparty wallet" />
            <input ref={currency} type="text" onKeyUp={()=>{setCurrency(currency.current.value)}} className="form-control" placeholder="currency" />
            <input ref={limit} type="text" onKeyUp={()=>{setLimit(limit.current.value)}} className="form-control" placeholder="limit" />
            <button className="btn btn-primary" onClick={createTrustLine}>trustline</button>
        </div>
    )

}


export default createTrustLine;