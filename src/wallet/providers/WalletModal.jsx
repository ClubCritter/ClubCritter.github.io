import React, { useEffect, useState } from 'react'
import config from '../chainconfig';
import useWalletStore from './eckoWalletStore';
import useSpireKeyStore from './spireKey';

const WalletModal = ({ setShowModal }) => {
  const { connectSpireKey } = useSpireKeyStore()
  const { connect } = useWalletStore()
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.addEventListener('click', handleOutsideClick);
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isMounted]);
  
  const handleOutsideClick = (event) => {
    if (!event.target.closest('.wallet-modal')) {
      setShowModal(false);
    }
  };
  const handleEckoWalletClick = async() => {
    try {
      await connect();
      setShowModal(false);
    }catch(err){
        console.log(err)
    }
  }
  const handleSpireKeyClick = async() => {
    try {
      await connectSpireKey();
      setShowModal(false);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='wallet-modal-container tm-bg-dark-n'>
        <div className='wallet-modal'>
            <button onClick={handleEckoWalletClick} className='btn btn-primary provider-button'> Ecko Wallet </button>
            <button onClick={handleSpireKeyClick} className='btn btn-primary provider-button'> SpireKey </button>
        </div>
    </div>
  )
}

export default WalletModal