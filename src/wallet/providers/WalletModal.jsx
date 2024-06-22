import React from 'react'
import config from '../chainconfig';
import useWalletStore from '../walletStore';

const WalletModal = () => {
  const { connect } = useWalletStore()

  return (
    <div className='wallet-modal-container tm-bg-dark-n'>
        <div className='wallet-modal'>
            <button onClick={connect} className='btn btn-primary provider-button'> Ecko Wallet </button>
        </div>
    </div>
  )
}

export default WalletModal