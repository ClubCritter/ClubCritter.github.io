import React, { useState, useEffect } from 'react'
import useTokenStore from '../store/tokenStore'
import SelectChain from './SelectChain';
import SelectToken from './SelectToken';
import { toast } from 'react-toastify';
import paste from '../assets/img/paste.svg'

const MultipleTransfer = ({wallet , getBalance, sendMultiTransfer }) => {
    const {token, chainId} = useTokenStore();
    const [receivers, setReceivers] = useState([])
    const [newReceiver, setNewReceiver] = useState({ account: '', amt: 0.0 });
    const [reqKey, setReqKey] = useState('')

    useEffect(() => {getBalance(token.contract, chainId)}, [token, chainId])
    

    const amounts = receivers.map((receiver) => parseFloat(receiver.amt))
    let totalAmount = 0;

    amounts.forEach(
      (amount) => {
        const newAmount = totalAmount + parseFloat(amount)
        totalAmount = newAmount;
      }
    )
    console.log(totalAmount)
    const handleAddReceiver = () => {
      if (newReceiver.account && newReceiver.amt) {
        const existingReceiver = receivers.find((receiver) => receiver.account === newReceiver.account);
        if(!existingReceiver) {
          setReceivers([...receivers, newReceiver])
          setNewReceiver({ account: '', amt: 0.0 })
        } else {
          toast.error('Receiver already exists')
        }
      }
    };

    const  handleSend = async() => {
        try {
          const accounts = receivers.map((receiver) => receiver.account)
          const amounts = receivers.map((receiver) => parseFloat(receiver.amt))
          console.log(accounts)
          const {key, status} = await sendMultiTransfer(token.contract, chainId, accounts, amounts)
          setReqKey(key)
          setReceivers([])
          setNewReceiver({ account: '', amt: 0.0 })
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
       }
    }
        
    const validateAccount = (account) => {
        const slicedAccount = account.slice(2);
        return slicedAccount.length === 64;
      };
    const handlePasteFromClipboard = async () => {
        try {
          const text = await navigator.clipboard.readText();
          console.log(text)
          setNewReceiver({...newReceiver, account: text });
        } catch (error) {
          console.error('Error reading from clipboard:', error);
        }
      };
      
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
      <div>{wallet.balance.decimal ? Number(wallet.balance.decimal).toFixed(8) : wallet.balance ? wallet.balance : "0"} {token.name}</div>
      <div className='multi-input-wrap'>
        <div className='form-input address'>
           <label>Receiver Address</label>
           <input type="text"
                  placeholder='Enter Address'
                  value={newReceiver.account !== '' ?  newReceiver.account : ''}
                  onChange={(e) => setNewReceiver({ ...newReceiver, account: e.target.value })} 
                  onBlur={(e) => {
                    if (!validateAccount(e.target.value)) {
                      toast.error("Invalid account address");
                    }
                  }}
                  />
            <button className="paste-btn" onClick={handlePasteFromClipboard}>
                  <img src={paste} />
            </button> 
        </div>
        <div className='form-input amount'>
         <label>Amount</label>
         <input type="text" 
                value={newReceiver.amt !== 0.00 ? newReceiver.amt : 0.00}
                onChange={(e) => setNewReceiver({ ...newReceiver, amt: e.target.value })}
                />
        </div>
          <button className="btn btn-primary" onClick={handleAddReceiver}>
            +Add
          </button>
      </div>
          <ul>
          {receivers.map((receiver, index) => (
            <li key={index} style={{
                wordBreak: 'break-all'
            }} 
                >
             {index + 1}. {receiver.account} - {receiver.amt}
            </li>
          ))}
        </ul>
      </div>
      {receivers.length > 1 && 
        <>
          <h2>Total amount {totalAmount} {token.name}</h2>
          <p>total receivers: {receivers.length >= 1 && receivers.length }</p>
        </>
        
      }
      <button className='btn btn-secondary' onClick={handleSend}>Send</button>
      {/* {reqKey !== '' && (
         <div className='req-key'>
            <p>Request Key: {reqKey}</p>
         </div>
      )} */}
      {/* {console.log(ac)} */}
      {console.log(receivers)}
    </div>
  )
}

export default MultipleTransfer