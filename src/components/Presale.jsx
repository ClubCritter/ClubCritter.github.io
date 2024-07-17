import React, { useEffect, useState } from 'react';
import WalletModal from '../wallet/providers/WalletModal';
import useWalletStore, { getAccount } from '../wallet/providers/walletStore';
import KtgTest from './KtgTest';
import useUiStore from '../store/uiStore';
import { pactCalls, pactCallsSig } from '../pactcalls/kadena';
import config from '../wallet/chainconfig';
import { toast } from 'react-toastify';

const NS = "n_7117098ca324c7b53025fc2cf2822db21730fdb0";
const MODULE_NAME = "kabirisbeautiful-sales"


const Presale = () => {
  const { disconnectProvider, quickSign } = useWalletStore();
  const { showKtgTest, setShowKtgTest } = useUiStore();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [phase0startTime, setPhase0StartTime] = useState(null);
  const [phase1startTime, setPhase1StartTime] = useState(null);
  const [salesEndTime, setSalesEndTime] = useState(null);
  const [isWhitelisted, setIsWhitelised] = useState(Boolean);
  const [tokenPrice, setTokenPrice] = useState(null)

  const chain = config.chainId;
  const account = getAccount()
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
    try {const account = await getAccount();
    const code =`(use ${NS}.${MODULE_NAME}) PHASE-0-START`
    const res = await pactCalls(code, chain, account?.slice(2, 66));
    setPhase0StartTime(new Date(res.result.data.time));
    } catch(err) {
      console.log(err)
    }
  }

  const getPhase1StartTime = async () => {
    const account = await getAccount();
    const code = `(use ${NS}.${MODULE_NAME}) PHASE-1-START`
    const res = await pactCalls(code, chain, account?.slice(2, 66));
    setPhase1StartTime(new Date(res.result.data.time));
  }

  const getSaleEndTime = async () => {
    const account = await getAccount();
    const code = `(use ${NS}.${MODULE_NAME}) END-OF-PRESALES`
    const res = await pactCalls(code, chain, account?.slice(2, 66));
    setSalesEndTime(new Date(res.result.data.time));
  }
  const getWlStatus = async () => {
    const account = await getAccount();
    const code = `(${NS}.${MODULE_NAME}.has-reservation "${account}")`
    const res = await pactCalls(code, chain, account?.slice(2, 66));
    console.log(res)
    setIsWhitelised(res.result.data)
  }
  // const applyWl = async () => {
  //   const account = await getAccount();
  //   const code = `(use ${NS}.${MODULE_NAME})
  //                 (reserve-batch "${account}")`
  //   const res = await pactCallsSig(code, chain, account?.slice(2, 66), quickSign)
  //   console.log(res)
  // }
  const getTokenPrice = async() => {
      const account = await getAccount();
      const code = `(${NS}.${MODULE_NAME}.get-price)`
      const res = await pactCalls(code, chain, account?.slice(2, 66))
      console.log(res)
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

  const handleApplyWl = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdhJ5reBS0woan_4xMQAid1xcUF5yrhwNENJIHzOSQvOJnW-w/viewform', '_blank');
  }

  useEffect(() => {
    getPhase0StartTime();
    getPhase1StartTime();
    getSaleEndTime();
    getWlStatus();
    getTokenPrice()
  }, [account]);
  useEffect(() => {
    let intervalId;
    const now = new Date().getTime();

    if (phase0startTime && now < phase0startTime?.getTime()) {
      intervalId = setInterval(async() => {
        setCountdown(calculateCountdown(phase0startTime?.getTime()));
      }, 1000);
    } else if (phase1startTime && now >= phase0startTime?.getTime() && now < phase1startTime?.getTime()) {
      intervalId = setInterval(() => {
        setCountdown(calculateCountdown(phase1startTime.getTime()));
      }, 1000);
    } else if (salesEndTime && now >= phase1startTime?.getTime() && now < salesEndTime?.getTime()) {
      intervalId = setInterval(() => {
        setCountdown(calculateCountdown(salesEndTime.getTime()));
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [phase0startTime, phase1startTime, salesEndTime]);

  const now = new Date();
  const isPreWl = now < phase0startTime;
  const isPhase0 = now >= phase0startTime && now < phase1startTime;
  const isPhase1 = now >= phase1startTime && now < salesEndTime;

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
                    {
                     isPhase0 ? (
                     <>
                      {isWhitelisted ?
                       (
                       <>
                        <h3>Buy Presale Tokens</h3>
                         <label>KDA Amount</label>
                         <input type = "text" />
                         <p>You Get :{tokenAmount}</p>
                       </>
                       ) : 
                         (
                         <button className='btn btn-primary tm-intro-btn tm-page-link mb-4 col-12'
                           onClick={handleApplyWl}>Apply For WL</button>)
                        }
                      
                    </>
                    ) : isPhase1 ?
                    (
                    <>
                       <button className='btn btn-primary tm-intro-btn tm-page-link mb-4 col-12'>Buy Tokens</button>
                    </>
                    ) : null
                  }
                  </div>
                )}
                <div className='countdown-container'>
                  <p>{
                    isPreWl ?
                      "Whitelist Starts in" :
                      isPhase0 ?
                        "Public Sale Starts In" :
                        isPhase1 ?
                          "Public Sale Ends in"
                          : "Sale Ended"}</p>
                  <div className="countdown">
                    <p>{countdown.days}d : {countdown.hours}h : {countdown.minutes}m : {countdown.seconds}s </p>
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
  );
}

export default Presale;
