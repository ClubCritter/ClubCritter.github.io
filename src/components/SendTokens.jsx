import React, { useEffect, useState } from 'react'
import SelectToken from './SelectToken'
import SelectChain from './SelectChain'

const SendTokens = ({wallet , token, setToken, chainId, setChainId, getBalance, sendCoin}) => {
   const [ac, setAc] = useState('');
   const [amt, setAmt] = useState(0);


   useEffect(() => {getBalance(token.contract, chainId)}, [token, chainId])
  
  const handleSendToken = (e) => {
      e.preventDefault();
      try{
         const {key, status} = sendCoin(token.contract, chainId, ac, amt);
         console.log("Req Key :", key , "status", status )
      } catch (err) {
         console.log(err);
      }
   }
   return (
    <div className='send-tokens'>
      <div className='input-wrap'>
      <div className='select-wrap'>
         <div className='form-input'>
            <label>Select Token</label>
             <SelectToken setToken={setToken}/>
         </div>
         <div className='form-input'>
            <label>Select Chain</label>
            <SelectChain setChainId = {setChainId} />
         </div>
         <div>{wallet.balance ? wallet.balance : "0" }{token.name}</div>
      </div>
      
      <div className='form-input'>
         <label>Receiver Address</label>
         <input type="text" onChange = {(e) => setAc(e.target.value)} />
      </div>
      <div className='form-input'>
         <label>Amount</label>
         <input type="text" onChange = {(e) => setAmt(e.target.value)} />
      </div>
      </div>
      <button className='btn btn-secondary' onClick={() => sendCoin(token, chainId, ac, amt)}>Send</button>
      {console.log(ac)}
    </div>
  )
}

export default SendTokens