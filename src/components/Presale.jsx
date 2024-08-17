// src/components/Presale.jsx
import React, { useEffect, useState } from 'react';
import { buyTokensSale, pactCalls, pactCallsSig } from '../pactcalls/kadena';
import ConnectWalletModal from '../wallet/providers/ConnectWalletModal';
import useWalletStore from '../wallet/walletStore';
import KtgTest from './KtgTest';
import BuyModal from './BuyModal';
import useUiStore from '../store/uiStore';
import cpyi from '../assets/img/cpy.svg';
import { toast } from 'react-toastify';
import WalletConnectButton from './WalletConnectButton';
import walletConnectStore from '../wallet/providers/connectWalletModalSlice';
import { useWalletConnectClient } from "../wallet/providers/ClientContextProvider";
import usePresaleStore from '../store/usePresaleStore';
import { addComma } from './Tokenomics';
import './presale.css';
import DeployerInfoModal from './DeployerInfoModal';

export const NS = import.meta.env.VITE_APP_NS;
export const MODULE_NAME = import.meta.env.VITE_APP_MODULE_NAME;
export const SALES_MODULE_NAME = import.meta.env.VITE_APP_SALES_MODULE_NAME;

const Presale = () => {
  const { provider, account, pubKey } = useWalletStore();
  const { client, session } = useWalletConnectClient();
  const { showKtgTest, setShowKtgTest } = useUiStore();
  const { showModal } = walletConnectStore();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [reqKey, setReqKey] = useState('');
  const [showWcMessage, setShowWcMessage] = useState(false);
  const [isDeployer, setIsDeployer] = useState(false)
  const [deployerPubKey, setDeployerPubKey] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [showDeployerInfoModal, setShowDeployerInfoModal] = useState(false)

  const {
    balance,
    phase0startTime,
    phase1startTime,
    salesEndTime,
    isWhitelisted,
    p0Reserved,
    amountPerBatch,
    currentPrice,
    kdaInput,
    batchCount,
    tokenSymbol,
    salesAccount,
    availableBatches,
    supplyChain,
    fetchBalance,
    fetchPhase0StartTime,
    fetchPhase1StartTime,
    fetchSalesEndTime,
    fetchP0Reserved,
    fetchAmountPerBatch,
    fetchSupplyChain,
    fetchTokenSymbol,
    fetchSalesAccount,
    fetchCurrentPrice,
    fetchWlStatus,
    fetchAvailableBatches,
    setKdaInput,
    setBatchCount,
    setAvailableBatches,
    setBalance
  } = usePresaleStore();

  const explorerLink = `https://explorer.chainweb.com/testnet/tx/${reqKey}`;

  useEffect(() => {
      fetchBalance(account, supplyChain);
      fetchPhase0StartTime(NS, SALES_MODULE_NAME, supplyChain, pubKey);
      fetchPhase1StartTime(NS, SALES_MODULE_NAME, supplyChain, pubKey);
      fetchSalesEndTime(NS, SALES_MODULE_NAME, supplyChain, pubKey);
      fetchWlStatus(NS, SALES_MODULE_NAME, account, supplyChain, pubKey);
      fetchP0Reserved(NS, SALES_MODULE_NAME, supplyChain, pubKey);
      fetchAmountPerBatch(NS, SALES_MODULE_NAME, supplyChain, pubKey);
      fetchCurrentPrice(NS, SALES_MODULE_NAME, supplyChain, pubKey);
      fetchTokenSymbol(NS, MODULE_NAME, supplyChain, pubKey);
      fetchSalesAccount(NS, SALES_MODULE_NAME, supplyChain, pubKey);
      fetchAvailableBatches(NS, SALES_MODULE_NAME, account, supplyChain, pubKey);
      fetchSupplyChain(NS, MODULE_NAME, supplyChain, pubKey);
  }, [account, supplyChain]);

  useEffect(() => {
    setKdaInput(currentPrice);
  }, [currentPrice, setKdaInput]);

  useEffect(() => {
    const now = new Date().getTime();

    let intervalId;
    if (phase0startTime && now < phase0startTime.getTime()) {
      intervalId = setInterval(() => {
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

  const calculateCountdown = (endTime) => {
    const now = new Date().getTime();
    const remainingTime = endTime - now;
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const handleKtgTest = () => {
    setShowKtgTest(!showKtgTest);
  };

  const handleApplyWl = () => {
    window.open('https://discord.gg/U5EMjSvb4s', '_blank');
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText(`${NS}.${MODULE_NAME}`);
    toast.success("Contract address copied to clipboard", {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleBuy = async () => {

    if (kdaInput > balance) {
      setShowBuyModal(false)
      toast.error(`Insufficient balance on Chain: ${supplyChain}`);
      return
    }

    if (provider[0] === 'WC') {
      setShowWcMessage(true);
      setShowBuyModal(false);
    }

    try {
      const code = `
        (${NS}.${SALES_MODULE_NAME}.buy "${account}" (read-keyset 'ks) ${batchCount})
      `;
      const res = await buyTokensSale(code, supplyChain, salesAccount, kdaInput, client, session);
        
      const {reqKey, result } = res.preflightResult;
      setKdaInput(0)
      setReqKey(reqKey);

      if (result.status === "success") {
        setShowBuyModal(false);
        setAvailableBatches(availableBatches - batchCount);
        setBalance(balance - kdaInput);
        toast.success(`Success: ${result.data}`, { position: 'top-center' });
        toast.success(`Request Key: ${reqKey}`, { position: 'bottom-right' });
      } else {
        toast.error(`Error: ${result.error?.message}`);
      }
    } catch (error) {
      console.error("Error in handleBuy:", error);
    }
  };

  const handleBuyPublicSale = () => {
    if (currentPrice > balance) {
      toast.error(`Insufficient balance on Chain: ${supplyChain}`);
      return
    }
    setShowBuyModal(true);
  };

  const getTokenDeployer = async () => {
    try {
      setIsLoading(true);
      const code = `(describe-keyset "${NS}.gov")`;
      const { preflightResult } = await pactCallsSig(code, supplyChain);
      const deployerPubKey = preflightResult.result.data.keys[0];
      setDeployerPubKey(deployerPubKey);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickDeployer = () => {
    setShowDeployerInfoModal(true);
    if(deployerPubKey === ''){
      getTokenDeployer();
    }
  };

  useEffect(() => {
    if (reqKey !== '') {
      setShowWcMessage(false);
    }
  }, [reqKey]);
  
  useEffect(() => {
    setKdaInput(batchCount * currentPrice)
  }, [batchCount, currentPrice])
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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
                <div>
                  <h2>{tokenSymbol.toUpperCase()} Presale</h2>
                  <p>Token Contract Address:</p>
                  <p className="contract-add">
                    {NS}.{MODULE_NAME}
                    <button style={{ background: "transparent", border: "none" }} onClick={copyContractAddress}>
                      <img style={{ width: "1.5rem", height: "1.5rem" }} src={cpyi} alt="Copy Icon"/>
                    </button>
                  </p>
                </div>
                <div className='presale-info'>
                  <h2>Presale Info</h2>
                  <div className='infos'>
                    <h3><span>1 Batch</span><span>|</span><span> {addComma(amountPerBatch)} ${tokenSymbol.toUpperCase()}</span></h3>
                    {isPhase0 && (
                      <h3><span>Per WL</span><span>|</span><span>{p0Reserved} {p0Reserved > 1 ? "Batches" : "Batch"}</span></h3>
                    )}
                    <h3><span>{isPhase0 ? "WL" : ""} Price</span><span>|</span><span>{currentPrice} KDA</span></h3>
                    {account && isPhase0 && (
                      <h3><span>Reserved</span><span>|</span><span>{availableBatches} {availableBatches > 1 ? "Batches" : "Batch"}</span></h3>
                    )}
                  </div>
                </div>
                {!account ? (
                  <WalletConnectButton />
                ) : (
                  <div className='account-name'>
                    <div>
                      <h3>Hello,</h3>
                      <p>{account}</p>
                    </div>
                    <div className='balance-wrap'>
                      <p className='value'>Chain: {supplyChain}</p>
                      <p className='value'>Balance: {balance?.toFixed(8)} KDA</p>
                    </div>
                    <WalletConnectButton />
                    {!isWhitelisted && isPhase0 && (
                      <button className='btn btn-primary tm-intro-btn tm-page-link mb-4 col-12' onClick={handleApplyWl}>
                        Join Our Discord
                      </button>
                    )}
                    {isPhase0 && isWhitelisted && (
                      <div className='buy-form'>
                        <div className='number-input'>
                          <label>You Give <h3>{kdaInput} KDA</h3></label>
                          <div style={{ position: 'relative' }}>
                            <input
                              value={batchCount}
                              type="number"
                              min='1'
                              step='1'
                              max={availableBatches}
                              onChange={(e) => setBatchCount(e.target.value)}
                            />
                          </div>
                          <label>Batch Count</label>
                        </div>
                        <label>You get <h3>{addComma(batchCount * amountPerBatch)} {tokenSymbol.toUpperCase()}</h3></label>
                        <button className='buy-btn' onClick={handleBuy}>Buy</button>
                        {showWcMessage && <p>Check your Wallet and sign transaction</p>}
                        {reqKey !== '' && (
                          <>
                            <h6>Transaction Hash: {reqKey}</h6>
                            <h6>View this transaction on <a className='link' href={explorerLink} target='_blank' rel="noopener noreferrer">Chainweb Explorer</a></h6>
                            <h5>You shall get total <span className='value'>{addComma((p0Reserved - availableBatches) * amountPerBatch)} {tokenSymbol.toUpperCase()}</span> tokens after public sale ends</h5>
                            <h5>You total bought <span className='value'>{p0Reserved - availableBatches} batches</span> of {tokenSymbol.toUpperCase()}</h5>
                          </>
                        )}
                      </div>
                    )}
                    {isPhase1 && (
                      <>
                        <button className='btn btn-primary tm-intro-btn tm-page-link mb-4 col-12' onClick={handleBuyPublicSale}>Buy Tokens</button>
                        {showBuyModal && (
                          <BuyModal 
                            tokenSymbol={tokenSymbol} 
                            batchCount={batchCount}
                            setBatchCount={setBatchCount}
                            amountPerBatch={amountPerBatch}
                            kdaInput={kdaInput}
                            handleBuy={handleBuy}
                            setShowBuyModal={setShowBuyModal}
                            availableBatches={availableBatches}
                          />
                        )}
                        {showWcMessage && <p>Check your Wallet and sign transaction</p>}
                        {reqKey !== '' && (
                          <>
                            <h6>Transaction Hash: {reqKey}</h6>
                            <h6>View this transaction on <a className='link' href={explorerLink} target='_blank' rel="noopener noreferrer">Chainweb Explorer</a></h6>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
                <h4>{isPreWl ? "Waiting for White Listed Presale to start" : isPhase0 ? "White Listed Presale is Live" : isPhase1 ? "Public Sale is Live" : "Sales Ended"}</h4>
                <div className='countdown-container'>
                  <p>{isPreWl ? "Whitelist Starts in" : isPhase0 && !isWhitelisted ? "Public Sale Starts In" : isPhase0 && isWhitelisted ? "Presale Ends In" : isPhase1 ? "Public Sale Ends in" : "Sale Ended"}</p>
                  <div className="countdown">
                    <p>{countdown.days}d : {countdown.hours}h : {countdown.minutes}m : {countdown.seconds}s</p>
                  </div>
                </div>
                {account &&
                  <h6>token creator? 
                  <button className='btn-small'
                    onClick={handleClickDeployer}
                    > click here
                    </button>
                </h6>
                }
              </div>
            </div>
          )}
        </div>
      </div>
      {showModal ? <ConnectWalletModal /> : null}
      {showDeployerInfoModal && 
        <DeployerInfoModal deployerPubKey = {deployerPubKey}
          pubKey = {pubKey} 
          setShowDeployerInfoModal = { setShowDeployerInfoModal }
          isLoading = {isLoading} />
      }
    </>
  );
};

export default Presale;