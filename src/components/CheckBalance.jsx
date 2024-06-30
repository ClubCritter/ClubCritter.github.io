import React, { useEffect } from 'react'
import { chains } from '../pactcalls/tokens';
import SelectToken from './SelectToken';
import SelectChain from './SelectChain';

const CheckBalance = ({wallet , token, setToken, chainId, setChainId, getBalance}) => {

  useEffect(() => {
    getBalance(token.contract)
  }, [token, chainId])

  return (
    <div className='check-balance'>
            <div className='check-balance-wrap'> 
              <div className='check-balance-input-wrap'>
                 <div className='check-balance-input'>
                    <label>Select Token</label>
                    <SelectToken setToken={setToken} />
                </div>
                <div className='check-balance-input'>
                   <label>Chain</label>
                   <SelectChain setChainId={setChainId} />
                </div>
             </div>
            
            <button className='btn btn-secondary' onClick={() => getBalance(token.contract)}>Check Balance</button>
            </div>
            <h2>{wallet.balance ? wallet.balance : "0"} {token.name}</h2>
            <p>Chain {chainId}</p>
          </div>
  )
}

export default CheckBalance