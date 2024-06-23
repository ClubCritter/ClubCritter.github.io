import React, { useEffect, useState } from 'react'
import useWalletStore from './walletStore';
import useSpireKeyStore from './spireKey';
import { useWalletConnect } from "../providers/walletConnect/walletConnectStore";

const WalletModal = ({ setShowModal }) => {
  const { connectSpireKey } = useSpireKeyStore()
  const { connectProvider } = useWalletStore()
  const [isMounted, setIsMounted] = useState(false);
  const { handleConnect } = useWalletConnect();

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
      await connectProvider();
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
  const handleWalletConnect = async() => {
    try{
      handleConnect();
      setShowModal(false)
     } catch (err){
    console.log(err)
  }
  };

  return (
    <div className='wallet-modal-container tm-bg-dark-n'>
        <div className='wallet-modal'>
            <button onClick={handleEckoWalletClick} className='btn btn-primary provider-button'> Ecko Wallet </button>
            <button onClick={handleSpireKeyClick} className='btn btn-primary provider-button' disabled> SpireKey </button>
            <button onClick={handleWalletConnect} className='btn btn-primary provider-button'> Wallet Connect </button>
        </div>
    </div>
  )
}

export default WalletModal