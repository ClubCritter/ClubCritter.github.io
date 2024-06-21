import React from 'react'
import config from '../chainconfig';

const WalletModal = () => {
  
  const connectWithEcko = async () => {
    try {
      const accountResult = await window.kadena.request({
        method: "kda_connect",
        networkId: config.networkId,
      });
      console.log(accountResult)
      console.log('Connected to Ecko Wallet:', accountResult);
    } catch (error) {
      console.error('Error connecting to Ecko Wallet:', error);
    }
  };
   
  return (
    <div className='wallet-modal-container tm-bg-dark-n'>
        <div className='wallet-modal'>
            <button onClick={connectWithEcko} className='btn btn-primary provider-button'> Ecko Wallet </button>
        </div>
    </div>
  )
}

export default WalletModal