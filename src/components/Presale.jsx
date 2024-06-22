import React, { useState } from 'react'
import WalletModal from '../wallet/providers/WalletModal';
import useWalletStore from '../wallet/providers/eckoWalletStore';
import useSpireKeyStore from '../wallet/providers/spireKey';

const Presale = () => {
const { connectionState , disconnect } = useWalletStore()
const { spireKeyConnected, spireKeyAccount, disconnectSpireKey } = useSpireKeyStore()
const [showModal, setShowModal] = useState(false);

const getAccount = () => {
  let account = null;
  spireKeyConnected ? 
      account = spireKeyAccount :
      connectionState?.account ? 
      account = connectionState.account.account : account = null
      return account;
}
const account = getAccount();
const handleConnectWallet = () => {
  setShowModal(true);
}
const handleDisconnectWallet = () => {
  disconnect();
}
console.log(spireKeyAccount)
  return (
     <>
       <div className='presale-container'>
            <div className="mx-auto page-width-2">
              <div className="row">
                <div className="col-lg-6 tm-contact-left tm-bg-dark-l">
                  { !account ? (
                    <button className='btn btn-primary tm-intro-btn tm-page-link'
                    onClick={handleConnectWallet}
                    >
                         Connect Wallet
                    </button>
                    
                  ) :  (
                  <div>
                      <h3>Hello,</h3>
                      <p>{account}</p>
                      <button className='btn btn-primary tm-intro-btn tm-page-link mb-4'
                         onClick={handleDisconnectWallet}
                         >
                              Disconnect
                      </button>
                      <p>Whitelist countdown Shall start soon</p>
                  </div>
                  ) 
                  
                  }
                  <div className='countdown-container'>
                    <p>Countdown</p>
                    <div className="countdown"></div>
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
                  {/* <!-- Map --> */}
                  <div className="map-outer">
                    <div className="gmap-canvas">
                        <iframe width="100%" height="400" id="gmap-canvas"
                            src="https://maps.google.com/maps?q=Av.+L%C3%BAcio+Costa,+Rio+de+Janeiro+-+RJ,+Brazil&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            ></iframe>
                  </div>
            </div>
          </div>
        </div>
      </div>            
     </div>
     {showModal ? (
      <WalletModal setShowModal={setShowModal}/>
     ) : null }
     {console.log(account)}
    </>
   
  )
}

export default Presale