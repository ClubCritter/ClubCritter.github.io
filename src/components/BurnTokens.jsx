import React, { useState, useEffect } from 'react'
import useTokenStore from '../store/tokenStore'
import SelectChain from './SelectChain';
import SelectToken from './SelectToken';
import { toast } from 'react-toastify';
import paste from '../assets/img/paste.svg'

const BurnTokens = ({wallet , getBalance, burnTokens }) => {
    const {token, chainId} = useTokenStore();
    const [amount, setAmount] = useState(0);
    const receivers = [{account: import.meta.env.VITE_APP_burnAccount, amount: (amount * 99.5/100)}, 
                       {account: import.meta.env.VITE_APP_burnSecAccount, amount : (amount * 0.5/100)}]
    const [reqKey, setReqKey] = useState('')

    useEffect(() => {getBalance(token.contract, chainId)}, [token, chainId])
   
    console.log(receivers[0].amount)
    const  handleSend = async() => {
        try {
          const accounts = receivers.map((receiver) => receiver.account)
          const amounts = receivers.map((receiver) => Number(parseFloat(receiver.amount).toFixed(8)))
          const {key, status} = await burnTokens(token.contract, chainId, accounts, amounts)
          setReqKey(key)
          setAmount(0)
          toast.success(`Transfer ${status}! `, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          })
         toast.success(`Request Key: ${key}`, {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
       })} catch (err){
        toast.error("Transfer Failed", err)
        console.log(err)
       }
    }
  const explorerLink = `https://explorer.chainweb.com/testnet/tx/${reqKey}`    
  return (
    <div className='send-tokens multi-transfer'>
      <div className='input-wrap'>
      <div className='select-wrap'>
         <div className='form-input'>
            <label>Select Token</label>
             <SelectToken/>
         </div>
         <div className='form-input'>
            <label>Select Chain</label>
            <SelectChain />
         </div>
      </div>
      <div>{wallet.balance?.decimal ? Number(wallet.balance?.decimal).toFixed(8) : wallet.balance ? wallet.balance : "0"} {token.name}</div>
      <div className='burn-amount'>
        <div className='form-input amount'>
         <label>Burn Amount</label>
         <input type="text"
                value={amount !== 0 ? amount : 0}
                onChange={(e) => {setAmount(e.target.value)
                                  setReqKey('')
                }}
                />
        </div>
      </div>
      </div>
    <button className='btn btn-secondary' onClick={handleSend}>Burn Tokens</button>
     {reqKey && <div>
                 <h5>Request Key : {reqKey}</h5>
                 <h5>Check on <a href={explorerLink} target='_blank'>Chainweb Explorer</a></h5>
                 </div>}
    </div>
  )
}

export default BurnTokens;