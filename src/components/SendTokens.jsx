import React from 'react'
import SelectToken from './SelectToken'
import SelectChain from './SelectChain'

const SendTokens = () => {
  return (
    <div className='send-tokens'>
      <div className='check-balance-input-wrap'>
      <div className='check-balance-input col-3'>
         <label>Select Token</label>
         <SelectToken />
      </div>
      <div className='check-balance-input col-3'>
         <label>Select Chain</label>
         <SelectChain />
      </div>
      <div className='check-balance-input col-9'>
         <label>Receiver Address</label>
         <input type="text" />
      </div>
      <div className='check-balance-input col-9'>
         <label>Amount</label>
         <input type="text" />
      </div>
      </div>
      
      
      <button className='btn btn-secondary'>Send</button>
    </div>
  )
}

export default SendTokens