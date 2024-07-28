import React, { useEffect, useState } from 'react';
import ConnectWalletModal from '../wallet/providers/ConnectWalletModal';
import useWalletStore from '../wallet/walletStore';
import KtgTest from './KtgTest';
import BuyModal from './BuyModal';
import useUiStore from '../store/uiStore';
import cpyi from '../assets/img/cpy.svg'
import { pactCalls, buyTokensSale } from '../pactcalls/kadena';
import { toast } from 'react-toastify';
import WalletConnectButton from './WalletConnectButton';
import walletConnectStore from '../wallet/providers/connectWalletModalSlice';
import { useWalletConnectClient } from "../wallet/providers/ClientContextProvider"
import './presale.css'



const NS = "n_7117098ca324c7b53025fc2cf2822db21730fdb0"
const MODULE_NAME = "morganfreeman"
const SALES_MODULE_NAME = "morganfreeman-sales"


const Presale = () => {
  const { disconnectWallet } = useWalletStore();
  const { client, session } = useWalletConnectClient();
  const { showKtgTest, setShowKtgTest } = useUiStore();
  const showModal = walletConnectStore.getState().showModal;
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [phase0startTime, setPhase0StartTime] = useState(null);
  const [phase1startTime, setPhase1StartTime] = useState(null);
  const [salesEndTime, setSalesEndTime] = useState(null);
  const [isWhitelisted, setIsWhitelised] = useState(Boolean);
  const [p0Reserved, setp0Reserved] = useState(Number)
  const [amountPerBatch, setAmountPerBatch] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [kdaInput, setKdaInput] = useState(0);
  const [batchCount, setBatchCount] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [salesAccount, setSalesAccount] = useState('');
  const [availableBatches, setAvailableBatches] = useState(Number)
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [reqKey, setReqKey] = useState('');
  const [supplyChain, setSupplyChain] = useState('1')
  const [counters, setCounters] = useState([])

  const chain = supplyChain;
  
  const {account, pubKey} = useWalletStore.getState()
  
  const explorerLink = `https://explorer.chainweb.com/testnet/tx/${reqKey}` 
  const handleKtgTest = () => {
    setShowKtgTest(!showKtgTest);
  }


  const getPhase0StartTime = async () => {
    try {
      const code =`(use ${NS}.${SALES_MODULE_NAME}) PHASE-0-START`
      const res = await pactCalls(code, chain, pubKey);
      setPhase0StartTime(new Date(res.result.data.time));
    } catch(err) {
      console.log(err)
    }
  }
  const getPhase1StartTime = async () => {
    const code = `(use ${NS}.${SALES_MODULE_NAME}) PHASE-1-START`
    const res = await pactCalls(code, chain, pubKey);
    setPhase1StartTime(new Date(res.result.data.time));
  }
  const getSaleEndTime = async () => {
    const code = `(use ${NS}.${SALES_MODULE_NAME}) END-OF-PRESALES`
    const res = await pactCalls(code, chain, pubKey);
    setSalesEndTime(new Date(res.result.data.time));
  }
  const getP0reserved = async() => {
    const code = `(use ${NS}.${SALES_MODULE_NAME}) P0-RESERVED`
    const res = await pactCalls(code, chain, pubKey);
    setp0Reserved(res.result.data)
  }
  const getAmountPerBatch = async () => {
    const code = `(use ${NS}.${SALES_MODULE_NAME}) AMOUNT-PER-BATCH`
    const res = await pactCalls(code, chain, pubKey);
    setAmountPerBatch(res.result.data);
  }
  const getSupplyChain = async() => {
    const code = `(use ${NS}.${MODULE_NAME}) SUPPLY-CHAIN`
    const res = await pactCalls(code, chain, pubKey);
    setSupplyChain(res.result.data);
  }
  const getTokenSymbol = async () => {
    const code = `(use ${NS}.${MODULE_NAME}) DETAILS`
    const res = await pactCalls(code, chain, pubKey);
    // console.log(res.result.data)
    setTokenSymbol(res.result.data.symbol)?.toUpperCase()
  }
  const getSalesAccount = async () => {
    const code = `(use ${NS}.${SALES_MODULE_NAME}) SALES-ACCOUNT`
    const res = await pactCalls(code, chain, pubKey);
    setSalesAccount(res.result.data)
  }
  const getCurrentPrice = async () => {
    const code = `(${NS}.${SALES_MODULE_NAME}.get-price)`
    const res = await pactCalls(code, chain, pubKey);
    setCurrentPrice(res.result.data)
  }
  const getWlStatus = async () => {
    const code = `(${NS}.${SALES_MODULE_NAME}.has-reservation "${account}")`
    const res = await pactCalls(code, chain, pubKey);
    setIsWhitelised(res.result.data)
  }
  const getAvailableBatches = async() => {
    const code = `(${NS}.${SALES_MODULE_NAME}.available-batches "${account}")`
    const res = await pactCalls(code, chain, pubKey);
    setAvailableBatches(res.result.data)
  }
  const getCounters = async() => {
    const code = `(${NS}.${SALES_MODULE_NAME}.get-counters")`
    const res = await pactCalls(code, chain, pubKey);
    console.log(res)
    setCounters(res.result)
  }
  const buy = async () => {
    try {
      const code = `
         (${NS}.${SALES_MODULE_NAME}.buy 
               "${account}" (read-keyset 'ks) ${batchCount})
      `;
      const res = await buyTokensSale(code, chain, salesAccount, kdaInput, client, session);
      
      console.log("Buy response:", res);
  
      const data = res.preflightResult.result.data;
      const reqKey = res.preflightResult.reqKey;
      const result = res.preflightResult.result.status;
      
      return { data, reqKey, result};
    } catch (error) {
      console.error("Error in buy function:", error);
      throw error;
    }
  };
  // const applyWl = async () => {
  //   const account = await getAccount();
  //   const code = `(use ${NS}.${SALES_MODULE_NAME})
  //                 (reserve-batch "${account}")`
  //   const res = await pactCallsSig(code, chain, pubKey, quickSign)
  //   console.log(res)
  // }

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
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSeSmCRVZiWhMgoxdT_qp5C61WGz23AcSmzagZpaf3c2qyb3fg/viewform', '_blank');
  }

  const handleBuy = async () => {
      const { data, reqKey, result } = await buy();
      setReqKey(reqKey)
      if (result === "success") {
        setShowBuyModal(false);
        toast.success(`Success: ${data}`, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        toast.success(`Request Key: ${reqKey}`, {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(`Error: ${result.error?.message}`);
      }
  };

  const handleBuyPublicSale = () => {
      setShowBuyModal(true)
  }
  const copyContractAddress = () => {
    navigator.clipboard.writeText(NS + "." + MODULE_NAME);
    toast.success("Contract address copied to clipboard", {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  
  useEffect(() => {
    getPhase0StartTime();
    getPhase1StartTime();
    getSaleEndTime();
    getWlStatus();
    getP0reserved();
    getAmountPerBatch();
    getCurrentPrice();
    getTokenSymbol();
    getSalesAccount();
    // getSales();
    getAvailableBatches();
    getSupplyChain()
    getCounters()
  }, [account]);
console.log(counters)
  useEffect(() => {
    setKdaInput(currentPrice);
  }, [currentPrice])

  useEffect(() => {
    let intervalId;
    const now = new Date().getTime();

    if (phase0startTime && now < phase0startTime?.getTime()) {
      intervalId = setInterval(async() => {
        setCountdown(calculateCountdown(phase0startTime.getTime()));
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

  useEffect(()=> {
    setKdaInput(batchCount * currentPrice)
  }, [batchCount, currentPrice])

  console.log(p0Reserved)
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
                  // <button className='btn btn-primary tm-intro-btn tm-page-link'
                  //   onClick={handleConnectWallet}
                  // >
                  //   Connect Wallet
                  // </button>
                   <WalletConnectButton />
                ) : (
                  <div className='account-name'>
                    <div>
                      <h3>Hello,</h3>
                      <p> {account} </p>
                    </div>
                    <div>
                      <p>Token Contract Address:</p>
                      <p className="contract-add">{NS}.{MODULE_NAME} 
                        <button style={{background: "transparent", border:"none"}}
                          onClick={copyContractAddress}>
                           <img style={{width: "1.5rem", height: "1.5rem"}} src={cpyi}/>
                        </button>
                      </p>
                    </div>
                    <p>Chain : {supplyChain}</p>
                      <WalletConnectButton />
                    { !isWhitelisted ?
                    <button className='btn btn-primary tm-intro-btn tm-page-link mb-4 col-12'
                    onClick={handleApplyWl}>Apply For WL</button>
                    : null
                  }
                    
                    {
                     isPhase0 ? (
                     <>
                      {
                        isWhitelisted ?
                       (
                       <div className='buy-form'>
                        <h3>Buy Presale Tokens</h3>
                        <p>reserved {availableBatches} batches of {tokenSymbol.toUpperCase()}</p>
                         <label>You Give {kdaInput} KDA</label>
                         <div style={{ position: 'relative' }}>
                          <input
                            value={batchCount}
                            type="number"
                            min='1'
                            step = '1'
                            max={availableBatches}
                            onChange={(e) => setBatchCount(e.target.value)}
                           />
                         </div>
                         <p>You Get :{batchCount} batch of {tokenSymbol.toUpperCase()} ({amountPerBatch} {tokenSymbol.toUpperCase()} per Batch)</p>
                         <h3>Total {batchCount * amountPerBatch} {tokenSymbol.toUpperCase()}</h3>
                         <button className='btn btn-secondary'
                           onClick={handleBuy}>Buy</button>
                           {reqKey !== '' &&
                             <h6>view this transaction on <a href={explorerLink} target='_blank'>Chainweb Explorer</a></h6>
                           }
                          <h5>You shall get total {(p0Reserved - availableBatches) * amountPerBatch} {tokenSymbol.toUpperCase()} tokens after public sale ends</h5>
                          <h5>You total bought {p0Reserved - availableBatches} batches of {tokenSymbol.toUpperCase()}</h5>
                      </div>
                       ) :
                         null
                         }
                    </>
                    ) : isPhase1 ?
                    (
                    <>
                       <button className='btn btn-primary tm-intro-btn tm-page-link mb-4 col-12'
                           onClick={handleBuyPublicSale}>Buy Tokens </button>
                        <h5>You shall get total {accountTokenBought} {tokenSymbol.toUpperCase()} tokens after public sale ends</h5>
                       {showBuyModal && 
                          <BuyModal tokenSymbol={tokenSymbol}   
                            batchCount = {batchCount}
                            kdaInput = {kdaInput}
                            setKdaInput = {setKdaInput}
                            handleBuy = {handleBuy}
                            setShowBuyModal = {setShowBuyModal} 
                            currentPrice={currentPrice}/> 
                        }
                    </>
                    ) : null
                  }
                  </div>
                )}
                <div className='countdown-container'>
                  <p>{
                    isPreWl ?
                      "Whitelist Starts in" :
                      isPhase0 & !isWhitelisted ?
                        "Public Sale Starts In" :
                        isPhase0 & isWhitelisted ?
                        "Presale Ends In" :
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
        <ConnectWalletModal />
      ) : null}
    </>
  );
}

export default Presale;
