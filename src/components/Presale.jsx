import React, { useState } from 'react'
import WalletModal from '../wallet/providers/WalletModal';
import useWalletStore from '../wallet/walletStore';

const Presale = () => {
const { connectionState , disconnect, connect } = useWalletStore()
const [showModal, setShowModal] = useState(false);

const account = connectionState?.account?.account;
const handleConnectWallet = () => {
  connect();
}
const handleDisconnectWallet = () => {
  disconnect();
}
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
      <WalletModal />
     ) : null }
    </>
   
  )
}

export default Presale