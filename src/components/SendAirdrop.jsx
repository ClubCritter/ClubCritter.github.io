import React, { useEffect, useState } from 'react'
import SelectToken from './SelectToken'
import SelectChain from './SelectChain'
import { toast } from 'react-toastify'


const SendAirdrop = ({wallet , token, setToken, chainId, setChainId, getBalance, sendAirdrop}) => {
    const [receivers, setReceivers] = useState([]);
    const [amt, setAmt] = useState(null)

    useEffect(() => {getBalance(token.contract, chainId)}, [token, chainId])

    const handleAirdrop = async() => {
        try{
            const { key, status } = await sendAirdrop(token.contract, chainId, receivers, amt)
            setReceivers([])
            setAmt(null)
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
            })
        } catch (err){
            console.log(err)
        }

    }
    const handelReceiversChange = (e) => {
         const input = e.target.value
         const newReceivers = input.split(",")
         setReceivers(newReceivers)
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
         <label>Receiver Addresses(comma seperated)</label>
         <textarea type="textbox" className='receiver-textbox' value={receivers} onChange = {handelReceiversChange} />
      </div>
      <div className='form-input'>
         <label>Amount for each receipient</label>
         <input type="text" value={amt} onChange = {(e) => setAmt(e.target.value)} />
      </div>
      </div>
      {amt && 
        <h2>Total amount {receivers.length * amt} {token.name}</h2>
      }
      {receivers.length > 1 && 
        <p>total receivers: {receivers.length >= 1 && receivers.length }</p>
      }
      <button className='btn btn-secondary' onClick={handleAirdrop}>Send Airdrop</button>
      {console.log(receivers)}
    </div>
  )
}

export default SendAirdrop