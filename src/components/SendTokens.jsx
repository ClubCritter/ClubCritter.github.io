import React, { useEffect, useState } from 'react'
import SelectToken from './SelectToken'
import SelectChain from './SelectChain'
import { toast } from 'react-toastify'

const SendTokens = ({wallet , token, setToken, chainId, setChainId, getBalance, sendCoin}) => {
   const [ac, setAc] = useState('');
   const [amt, setAmt] = useState(0);
   const [reqKey, setReqKey] = useState('')


   useEffect(() => {getBalance(token.contract, chainId)}, [token, chainId])
  
  const handleSendToken = async(e) => {
      e.preventDefault();
      try{
         const {key} = await sendCoin(token.contract, chainId, ac, amt);
         setAc('');
         setAmt(0);
         setReqKey(key); 
         toast.success(`Transfer successful! Request Key: ${key}`, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
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
             <SelectToken setToken={setToken} token={token}/>
         </div>
         <div className='form-input'>
            <label>Select Chain</label>
            <SelectChain setChainId = {setChainId} />
         </div>
      </div>
      <div>{wallet.balance ? wallet.balance : "0" }{token.name}</div>
      <div className='form-input'>
         <label>Receiver Address</label>
         <input type="text" value={ac} onChange = {(e) => setAc(e.target.value)} />
      </div>
      <div className='form-input'>
         <label>Amount</label>
         <input type="text" value={amt} onChange = {(e) => setAmt(e.target.value)} />
      </div>
      </div>
      <button className='btn btn-secondary' onClick={handleSendToken}>Send</button>
      {reqKey !== '' && (
         <div className='req-key'>
            <p>Request Key: {reqKey}</p>
         </div>
      )}
      {console.log(ac)}
    </div>
  )
}

export default SendTokens