import React, { useEffect, useState } from 'react'
import WalletModal from '../wallet/providers/WalletModal';
import useWalletStore, { getAccount } from '../wallet/providers/walletStore';
import KtgTest from './KtgTest';
import useUiStore from '../store/uiStore';
import { pactCalls } from '../pactcalls/kadena';
import config from '../wallet/chainconfig';

const Presale = () => {
  const { disconnectProvider } = useWalletStore();
  const { showKtgTest, setShowKtgTest } = useUiStore();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState({
    phase0start: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    phase0end: { days: 0, hours: 0, minutes: 0, seconds: 0 }
  });
  const [phase0startTime, setPhase0StartTime] = useState(null);

  const account = getAccount();
  const chain = config.chainId;

  const handleConnectWallet = () => {
    setShowModal(true);
  }

  const handleKtgTest = () => {
    setShowKtgTest(!showKtgTest);
  }

  const handleDisconnectWallet = () => {
    disconnectProvider();
  }

  const getPhase0StartTime = async () => {
    const code = `(use n_f841e63968ab2acf9be57858cd1f64336e2a9310.goat-sales) PHASE-0-START`
    const res = await pactCalls(code, chain, account.slice(2, 66))
    setPhase0StartTime(new Date(res.result.data.time));
  }

  const calculateCountdown = (endTime) => {
    const now = new Date().getTime();
    const remainingTime = endTime - now;
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    getPhase0StartTime();
  }, []);

  useEffect(() => {
    if (phase0startTime) {
      const intervalId = setInterval(() => {
        setCountdown({
          ...countdown,
          phase0start: calculateCountdown(phase0startTime.getTime()),
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [phase0startTime]);

  return (
    <>
      <div className='presale-container'>
        <div className="mx-auto page-width-2">
          {showKtgTest ? (
            <KtgTest handleKtgTest={handleKtgTest} />
          ) : (
            <div className="row">
              <div className="tm-contact-left tm-bg-dark">
                {!account ? (
                  <button className='btn btn-primary tm-intro-btn tm-page-link'
                    onClick={handleConnectWallet}
                  >
                    Connect Wallet
                  </button>

                ) : (
                  <div className='account-name'>
                    <h3>Hello,</h3>
                    <p> {account} </p>
                    <button className='btn btn-primary tm-intro-btn tm-page-link mb-4 col-12'
                      onClick={handleDisconnectWallet}
                    >
                      Disconnect
                    </button>
                  </div>
                )}
                <div className='countdown-container'>
                  <p>Whitelist Starts in</p>
                  <div className="countdown">
                    <p>{countdown.phase0start.days}d : {countdown.phase0start.hours}h : {countdown.phase0start.minutes}m : {countdown.phase0start.seconds}s </p>
                  </div>
                </div>
              </div>
              {/* <div className="col-lg-6 tm-contact-right tm-bg-dark-r py-5">
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
              </div> */}
            </div>
          )}
        </div>
      </div>
      {showModal ? (
        <WalletModal setShowModal={setShowModal} />
      ) : null}
    </>
  )
}

export default Presale;
