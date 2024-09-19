import React, { useState, useEffect } from 'react'
import useTokenStore from '../store/tokenStore'
import SelectChain from './SelectChain';
import SelectToken from './SelectToken';
import { toast } from 'react-toastify';
import paste from '../assets/img/paste.svg'
import { pactCalls, pactCallsSig } from '../pactcalls/kadena';


const BurnTokens = ({wallet , getBalance, burnTokens, quickSign }) => {
    const {token, chainId} = useTokenStore();
    const [amount, setAmount] = useState(0);
    const burnWallet = "c:KI4cQnLt-DLK31X7mKay1c3DNPr-adIel5op8CkEOYo"
    const [showCreateBurnAddress, setShowCreateBurnAddress] = useState(false)
    const receivers = [{account: burnWallet, amount: (amount * 99.5/100)}, 
                       {account: import.meta.env.VITE_APP_burnSecAccount, amount : (amount * 0.5/100)}]
    const [reqKey, setReqKey] = useState('')

    useEffect(() => {getBalance(token.contract, chainId)}, [token, chainId])

    useEffect(() => {
      const code = `(${token.contract}.details "${burnWallet}")`
      pactCalls(code, chainId, wallet.account.slice(2, 66))
       .then(res => {
          if(res.result.status === "failure") {
            console.log(res)
            setShowCreateBurnAddress(true)
          } else {
            console.log(res)
            setShowCreateBurnAddress(false)
          }
        })
    }, [token, chainId])
   
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

    const handleCreateBurnWallet = async () => {
      const code = `(n_e309f0fa7cf3a13f93a8da5325cdad32790d2070.burn.create-burn-wallet
                     ${token.contract})`
      pactCallsSig(code, chainId, wallet.account.slice(2, 66), quickSign)
           .then((result) => {
            console.log(result)
           }).catch((err) => {
            console.log(err)
           } )
    }
  const explorerLink = `https://explorer.chainweb.com/testnet/tx/${reqKey}`    
  return (
    <div className='send-tokens multi-transfer'>
      <div className='input-wrap'>
        Currently only working on chain 1
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
      {showCreateBurnAddress ? (
           <h3>Burn Wallet not found for this token or Chain</h3>
      ) : (
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
      )}
      </div>
    { showCreateBurnAddress ? <button className='btn btn-secondary' onClick={handleCreateBurnWallet}>Create Burn Wallet</button> 
                            : <button className='btn btn-secondary' onClick={handleSend}>Burn Tokens</button>}
    
     {reqKey && <div>
                 <h5>Request Key : {reqKey}</h5>
                 <h5>Check on <a href={explorerLink} target='_blank'>Chainweb Explorer</a></h5>
                 </div>}
    </div>
  )
}

export default BurnTokens;