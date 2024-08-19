import React, { useEffect, useState } from 'react'
import usePresaleStore from '../store/usePresaleStore';
import { NS, SALES_MODULE_NAME } from './Presale';
import useWalletStore from '../wallet/walletStore';
import { pactCalls, pactCallsSales, pactCallsSig } from '../pactcalls/kadena';
import { toast } from 'react-toastify';
import { useWalletConnectClient } from '../wallet/providers/ClientContextProvider';
import paste from '../assets/img/paste.svg';

const ManageSales = ({ tokenSymbol }) => {
    const { pubKey } = useWalletStore();
    const { client, session } = useWalletConnectClient();
    const { supplyChain, fetchTotalSales, salesEndTime, phase0startTime, phase1startTime, p0Price, setP0Price, setP1Price, p1Price, fetchP0Price, fetchP1Price, amountPerWL } = usePresaleStore();
    const [showPriceChange, setShowPriceChage] = useState(false);
    const [newP0Price, setNewP0Price] = useState(p0Price);
    const [newP1Price, setNewP1Price] = useState(p1Price);
    const [priceResult, setPriceResult] = useState(null);
    const [availableToWhitelist, setAvailableToWhitelist] = useState(0);
    const [totalBatches, setTotalBatches] = useState(0);
    const [counters, setCounters] = useState({
        sold: null,
        reserved: null
    })
    const [reservations, setReservations] = useState([])
    const [whitelistForm, setWhitelistForm] = useState(false);
    const [reservationList, setReservationList] = useState(false);
    const [walletsToWhitelist, setWalletsToWhitelist] = useState([]);
    const [newWallet, setNewWallet] = useState('');

    const now = new Date();
    const isPreWl = now < phase0startTime;
    const isPhase0 = now >= phase0startTime && now < phase1startTime;
    const isPhase1 = now >= phase1startTime && now < salesEndTime;

    const handlePrices = () => {
        setPriceResult(null);
        setShowPriceChage(true);
    }

    const showWhiteListForm = () => {
        setWhitelistForm(true);
        setReservationList(false);
    }
    const showReservationList = () => {
        setReservationList(true);
        setWhitelistForm(false)
    }

    const updatePrices = async () => {
        const code = `(${NS}.${SALES_MODULE_NAME}.set-price "phase-0" ${newP0Price}) (${NS}.${SALES_MODULE_NAME}.set-price "phase-1" ${newP1Price})`;
        const res = await pactCallsSales(code, supplyChain, client, session);
        const { result } = res.preflightResult;
        setP0Price(newP0Price);
        setP1Price(newP1Price);
        setPriceResult(result.data);
        setShowPriceChage(false);
    }
    const WhitelistAddresses = async() => {
      const walletList = walletsToWhitelist.map(
        (wallet) => `(reserve-batch "${wallet}")`
      )
      const code = `(use ${NS}.${SALES_MODULE_NAME})
          ${walletList.join(' ')}`
      const res = await pactCallsSales(code, supplyChain, client, session)
      console.log(res)
      toast.success(res.result.data)
      setAvailableToWhitelist(availableToWhitelist - (walletList.length * amountPerWL))
    }

    const getTotalBatches = async () => {
        const code = `(use ${NS}.${SALES_MODULE_NAME}) TOTAL-BATCHES`;
        const res = await pactCalls(code, supplyChain, pubKey);
        setTotalBatches(res.result.data);
    }

    const getCounters = async () => {
        const code = `(${NS}.${SALES_MODULE_NAME}.get-counters)`;
        const res = await pactCalls(code, supplyChain, pubKey);
        const sold = res.result.data.sold.int;
        const reserved = res.result.data.reserved.int;
        setCounters({sold: sold, reserved: reserved})
        setAvailableToWhitelist(totalBatches - (sold + reserved));
    }
    const getReservations = async () => {
        const code = `(${NS}.${SALES_MODULE_NAME}.get-reservations)`;
        const res = await pactCalls(code, supplyChain, pubKey);
        setReservations(res.result.data)
    }

    useEffect( () => {
        const fetchData = async () => {
          await fetchP0Price(NS, SALES_MODULE_NAME, supplyChain, pubKey);
          await fetchP1Price(NS, SALES_MODULE_NAME, supplyChain, pubKey);
          await getTotalBatches();
          await getCounters();
          await getReservations()
        }
        fetchData();
    }, [p0Price, p1Price, totalBatches, availableToWhitelist]);
    
    const refreshList = async () => {
        await getReservations()
    }
    const validateAddress = (address) => {
        const slicedAddress = address.slice(2);
        return slicedAddress.length === 64; // Assuming the address length is 64 characters
    }

    const handleAddToWhitelist = () => {
      if (validateAddress(newWallet)) {
          if (walletsToWhitelist.includes(newWallet)) {
              toast.error('Wallet address already in whitelist');
          } else {
              setWalletsToWhitelist([...walletsToWhitelist, newWallet]);
              setNewWallet('');
              toast.success('Address added to whitelist');
          }
      } else {
          toast.error('Invalid wallet address');
      }
  }

    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (validateAddress(text)) {
                setNewWallet(text);
            } else {
                toast.error('Invalid address from clipboard');
            }
        } catch (error) {
            console.error('Error reading from clipboard:', error);
        }
    }

    return (
        <div className='dashboard-container'>
            <h4>Token: ${tokenSymbol}</h4>
            <div className='d-flex gap-4'>
                <h6>WhiteList Price: <span style={{color:'var(--secondary-color)'}}>{p0Price} KDA</span></h6>
                <h6>Public Sale Price: <span style={{color:'var(--primary-color)'}}>{p1Price} KDA</span></h6>
            </div>

            {isPreWl && (
                <div>
                    <h3>Current Phase : Pre WL</h3>
                    {!showPriceChange && (
                        <button className='btn-primary my-2' onClick={handlePrices}>Update Prices</button>
                    )}
                    {priceResult && <p>{priceResult}</p>}
                    {showPriceChange && (
                        <>
                            <div className='d-flex gap-2'>
                                <div className='col-6'>
                                    <label>New Whitelist Price (Per Batch)</label>
                                    <input value={newP0Price} type='text' onChange={(e) => setNewP0Price(e.target.value)} />
                                </div>
                                <div className='col-6'>
                                    <label>New Public Sale Price (Per Batch)</label>
                                    <input value={newP1Price} type='text' onChange={(e) => setNewP1Price(e.target.value)} />
                                </div>
                            </div>
                            <button className='btn-primary mt-2' onClick={updatePrices}>Update Prices</button>
                        </>
                    )}
                    <p>You can whitelist Users after phase 0 Starts</p>
                </div>
            )}

            {isPhase0 && (
                <div>
                    <h3>Current Phase : <span style={{color:'var(--secondary-color)'}}>Phase 0</span></h3>
                    <p>Phase 0 is live, you can whitelist users now</p>
                    <div className='info-grid'>
                        <p>Total to Sale: {totalBatches} Batches</p> |
                        <p>Available: {availableToWhitelist} Batches</p>
                    </div>
                    <div className='info-grid'>
                        <p style={{color:'var(--primary-color)'}}>Reserved  : {counters.reserved} Batches </p> |
                        <p style={{color:'var(--secondary-color)'}}>Sold : {counters.sold} Batches</p>
                    </div>
                    <div>
                        {!whitelistForm | !reservationList && (
                            <div className='deployer-options'>
                              <button className='btn-primary my-2' onClick={showWhiteListForm}>Whitelist Wallets</button>
                              <button className='btn-primary my-2' onClick={showReservationList}>Current Sales</button>
                            </div>
                        )}
                        {whitelistForm && (
                            <div >
                                <label>Enter Wallet Address</label>
                                <div className='form-input address'>
                                  <input
                                    type="text"
                                    placeholder='Enter Address'
                                    value={newWallet}
                                    onChange={(e) => setNewWallet(e.target.value)}
                                  />
                                   <button className='paste-btn' onClick={handlePasteFromClipboard}>
                                     <img src={paste} alt="Paste" />
                                   </button>
                                  </div>
                                <button className='btn-primary' onClick={handleAddToWhitelist}>AddWallet</button>
                                <div className='my-4'>
                                  <h4>Addresses To Whitelist</h4>
                                  <ul>
                                    {walletsToWhitelist.map((address, index) => (
                                      <li key={index} style={{wordBreak: 'break-all'}}>{index + 1}. {address}</li>
                                    ))}
                                  </ul>
                                  <button className='btn btn-primary'
                                    onClick={WhitelistAddresses}>WhiteList Addresses</button>
                                </div>
                            </div>
                        )}
                        { reservationList && (
                            <div className='my-4'>
                            <h3 
                              style={{position: 'relative'}}
                                >Reservstion List
                                  <button 
                                    style={{position: 'absolute', 
                                      right: '0', 
                                      fontSize: '12px'}}
                                    onClick={refreshList}
                                      >refresh
                                  </button>
                            </h3>
                            {reservations.map((account, index) => (
                                <div key={index}>
                                   <div  style={{wordBreak: 'break-all'}}>{index +1}. {account.account}</div>
                                   <div className='deployer-options'>
                                    <p style={{color:'var(--primary-color)'}}> Reserved : {account.reserved.int - account.bought.int} Batches</p>
                                    <p style={{color:'var(--secondary-color)'}}>Bought: {account.bought.int} Batches</p>
                                   </div>
                                </div>
                            ))}
                            </div>
                        )
                        }
                    </div>
                </div>
            )}

            {isPhase1 && <h3>Current Phase : Phase 1</h3>}
            {now > salesEndTime && <h3>Current Phase : Sales End</h3>}
        </div>
    );
}

export default ManageSales;
