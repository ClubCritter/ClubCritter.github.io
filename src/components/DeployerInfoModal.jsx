import React, { useState, useEffect } from 'react'
import usePresaleStore from '../store/usePresaleStore';
import { addComma } from './Tokenomics';
import DeployerPanel from './DeployerPanel';

const DeployerInfoModal = ({tokenSymbol, deployerPubKey, pubKey, setShowDeployerInfoModal, isLoading}) => {
  
  const [deployerPanel, setDeployerPanel] = useState(false)  


  const handleClose = () =>  {
    setShowDeployerInfoModal(false);
  }

  // useEffect(() => {
  //   if (isMounted) {
  //     document.addEventListener('click', handleOutsideClick);
  //     return () => {
  //       document.removeEventListener('click', handleOutsideClick);
  //     };
  //   }
  // }, [isMounted]);
  
  // const handleOutsideClick = (event) => {
  //   if (!event.target.closest('.buy-modal')) {
  //       setShowDeployerInfoModal(false);
  //   }
  // };
  const showDeployerPanel =( ) =>{
    setDeployerPanel(true)
  }

  return (
    <>
       <div className='wallet-modal-container tm-bg-light-n'>
        <div className='deployer-modal tm-bg-darker-a'>
            { deployerPubKey === ''
              && 
              <h3>
                Please use your Wallet To Sign and Prove you are deployer 
              </h3>
            }
            
            {   
                isLoading ?
                  <h3> Loading...</h3> :
                deployerPubKey !== '' &
                pubKey === deployerPubKey ? 
                  <div className='centered-div'>
                    {deployerPanel ?
                      <DeployerPanel setDeployerPanel = {setDeployerPanel}
                        tokenSymbol={tokenSymbol} />
                    :
                    <>
                    <h3> You Are the Deployer of ${tokenSymbol} </h3>
                      <button className='btn btn-secondary'
                        onClick={showDeployerPanel}
                          >Visit Deployer Panel
                      </button>
                      </> 

                      
                  }
                  </div>
                :  pubKey !== deployerPubKey &
                  deployerPubKey !== '' ?
                   <h3>You are not the deployer or You Might have used a different wallet to sign, kindly check the wallet and try again</h3>
                : null
            }
        </div>
        <button onClick={handleClose} 
          className='close-button'>Close</button>
    </div>
    </>
  )
}

export default DeployerInfoModal;