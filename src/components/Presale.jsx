import React, { useState } from 'react'
import WalletModal from '../wallet/providers/WalletModal';
import useWalletStore, { getAccount } from '../wallet/providers/walletStore';
import KtgTest from './KtgTest';
import useUiStore from '../store/uiStore';

const Presale = () => {
const { disconnectProvider } = useWalletStore()
const { showKtgTest, setShowKtgTest } = useUiStore()
const [showModal, setShowModal] = useState(false);

const account = getAccount();
const handleConnectWallet = () => {
  setShowModal(true);
}
const handleKtgTest = () => {
  setShowKtgTest(!showKtgTest);
}
const handleDisconnectWallet = () => {
  disconnectProvider();
}
  return (
     <>
       <div className='presale-container'>
            <div className="mx-auto page-width-2">
              {showKtgTest ? (
                   <KtgTest handleKtgTest={handleKtgTest} />
                  ) : (
                   <div className="row">
                   <div className="col-lg-6 tm-contact-left tm-bg-dark-l">
                     { !account ? (
                       <button className='btn btn-primary tm-intro-btn tm-page-link'
                       onClick={handleConnectWallet}
                       >
                            Connect Wallet
                       </button>
                       
                     ) :  (
                     <div className='account-name'>
                         <h3>Hello,</h3>
                         <p> {account} </p>
                         <button className='btn btn-primary tm-intro-btn tm-page-link mb-4 col-12'
                            onClick={handleDisconnectWallet}
                            >
                                 Disconnect
                         </button>
                         <button className='btn btn-primary tm-intro-btn tm-page-link mb-4 col-12'
                                 onClick={handleKtgTest}>test KTG</button>
                     </div>
                     ) 
                     
                     }
                     <div className='countdown-container'>
                       <p>Countdown</p>
                       <div className="countdown">
                         yet to start
                       </div>
                     </div>
                   </div>
                   <div className="col-lg-6 tm-contact-right tm-bg-dark-r py-5">    
                     <h2 className="mb-4">Presale</h2>              
                     <p className="mb-4">
                       Coming Soon
                     </p>
                     <div>
                       Keep An eye on this page
                     </div>
                     <div className="tm-mb-45">
                       I mean it!!
                     </div>
                   </div>
                 </div>
             )}
              
           </div>            
      </div>
     {showModal ? (
      <WalletModal setShowModal={setShowModal}/>
     ) : null }
    </>
   
  )
}

export default Presale