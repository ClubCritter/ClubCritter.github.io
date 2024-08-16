import React, { useState, useEffect } from 'react'
import usePresaleStore from '../store/usePresaleStore';
import { addComma } from './Tokenomics';


const DeployerInfoModal = ({tokenSymbol, deployerPubKey, pubKey, setShowDeployerInfoModal}) => {
  
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
    if (!event.target.closest('.buy-modal')) {
        setShowDeployerInfoModal(false);
    }
  };

  return (
    <>
       <div className='wallet-modal-container tm-bg-light-n'>
        <div className='buy-modal tm-bg-darker-a'>
            { deployerPubKey === '' && 
              <h3>
                Please use your Wallet To Sign and Prove you are deployer 
              </h3>
            }
            
            {   deployerPubKey !== '' &
                pubKey === deployerPubKey ? 
                <h3> You Are the Deployer</h3>
                : 
                <h3>You are not the deployer or You Might have used a different wallet to sign, kindly check the wallet and try again</h3>
            }
        </div>
    </div>
    </>
  )
}

export default DeployerInfoModal