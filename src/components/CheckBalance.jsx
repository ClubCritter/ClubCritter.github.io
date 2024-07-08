import React, { useEffect } from 'react'
import { chains } from '../pactcalls/tokens';
import SelectToken from './SelectToken';
import SelectChain from './SelectChain';
import useTokenStore from '../store/tokenStore';

const CheckBalance = ({wallet , getBalance}) => {
  const {token, chainId} = useTokenStore()
  useEffect(() => {
    getBalance(token.contract, chainId)
  }, [token, chainId])

  return (
    <div className='check-balance'>
            <div className='check-balance-wrap'> 
                 <div className='form-input'>
                    <label>Select Token</label>
                    <SelectToken />
                </div>
                <div className='form-input'>
                   <label>Chain</label>
                   <SelectChain />
                </div>
            </div>
            <h2>{wallet.balance?.decimal ? Number(wallet.balance?.decimal).toFixed(8) : wallet.balance ? wallet.balance : "0"} {token.name}</h2>
            <p>Chain {chainId}</p>
          </div>
  )
}

export default CheckBalance