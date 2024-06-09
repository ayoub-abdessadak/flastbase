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
            <input ref={cpw} type="text" onKeyUp={()=>{setCounterpartyWallet(cpw.current.value)}} value={"HLH3Ahr5fAYFTRsCq5UtRW2sfN9GeX4"} className="form-control" placeholder="counterparty wallet" />
            <input ref={currency} type="text" onKeyUp={()=>{setCurrency(currency.current.value)}} value={"MFX"} className="form-control" placeholder="currency" />
            <input ref={limit} type="text" onKeyUp={()=>{setLimit(limit.current.value)}} value={"100"} className="form-control" placeholder="limit" />
            <button className="btn btn-primary" style={{height:"100%", width:"100%"}} onClick={createTrustLine}>trustline</button>
        </div>
    )

}


export default createTrustLine;