import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import img1 from '../assets/img/gallery-img-01.png';
import img2 from '../assets/img/gallery-img-02.png';
import img3 from '../assets/img/gallery-img-03.png';
import img4 from '../assets/img/gallery-img-04.png';
import { pactCalls } from "../pactcalls/kadena";
import useWalletStore from "../wallet/walletStore";
import useTreasuryStore from '../store/useTreasuryStore';

const CHAIN = "1";

export const NS = import.meta.env.VITE_APP_NS
export const MODULE_NAME = import.meta.env.VITE_APP_MODULE_NAME

export const addComma = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const Tokenomics = () => {
  const { pubKey } = useWalletStore.getState();
  const {
    treasuryTokenBalance,
    liquidityTokenBalance,
    treasuryKdaBalance,
    treasuryContractAccount,
    treasuryGuard,
    liquidityAccount,
    ac,
    amt,
    setAc,
    setAmt,
    getTreasuryContractAccount,
    getTreasuryGuard,
    getLiquidityAccount,
    getTreasuryTokenBalance,
    getLiquidityTokenBalance,
    getTreasuryKdaBalance,
  } = useTreasuryStore();


  useEffect(() => {
    const fetchDetails = async () => {
      await getTreasuryContractAccount(NS, MODULE_NAME, CHAIN);
      await getTreasuryTokenBalance(NS, MODULE_NAME, CHAIN, treasuryContractAccount);
      await getLiquidityAccount(NS, MODULE_NAME, CHAIN);
      await getLiquidityTokenBalance(NS, MODULE_NAME, CHAIN, liquidityAccount);
    };
    fetchDetails();
  }, [treasuryContractAccount, liquidityAccount, CHAIN]);


  const [totalsupply, setTotalSupply] = useState(0);
  const [logouri, setLogoUri] = useState('');
  const [burned, setBurned] = useState(0);
  const newToken = totalsupply - burned;
  const [token, setToken] = useState({});
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(null);
  const [hoveredSegmentIndex, setHoveredSegmentIndex] = useState(null);
  
  const getBurn = async (token) => {
    try {
        const code = `(n_e309f0fa7cf3a13f93a8da5325cdad32790d2070.burn.get-balance ${NS}.${MODULE_NAME})`;
        const chain = CHAIN;
        const res = await pactCalls(code, chain);
        if(res.result.status === 'failure'){
          console.log(res.result.error);
          return null
        }
        setBurned(res.result.data)
    } catch (error) {
        console.log(`${token.name} account does not exist`);
        return null;
    }
};
  
  useEffect(() => {
    const fetchDetails = async() => {
     await getBurn()
    }
    fetchDetails()
  }, [burned, treasuryTokenBalance, liquidityTokenBalance])


  useEffect(() => {
    const getToken = async () => {
      const code = `(use ${NS}.${MODULE_NAME}) DETAILS`;
      const chain = CHAIN;
      const res = await pactCalls(code, chain, pubKey);
      setToken(res.result.data);
      setTotalSupply(res.result.data.supply?.int);
      setLogoUri(res.result.data.imageUrl);
    };
    getToken();
  }, [pubKey, token]);


  const presaleValue = newToken - (liquidityTokenBalance + treasuryTokenBalance);
  const liquidityValue = liquidityTokenBalance;
  const treasuryValue = treasuryTokenBalance;

  const totalTokens = liquidityValue + treasuryValue + presaleValue;
  console.log(liquidityTokenBalance)
  const pieChartData = [
    { title: 'Presale', value: (presaleValue / totalTokens) * 100, color: '#8BC34A' },
    { title: 'Liquidity', value: (liquidityValue / totalTokens) * 100, color: '#6C5CE7' },
    { title: 'Treasury', value: (treasuryValue / totalTokens) * 100, color: '#FF69B4' },
  ];

  const getLabelStyle = () => {
    if (window.innerWidth < 600) {
      return { fontSize: '5px', fill: '#fcfcfc' };
    }
    return { fontSize: '7px', fill: '#fff' };
  };

  const pieChartOptions = {
    radius: 30,
    lineWidth: 50,
    segmentsStyle: {
      transition: 'stroke .3s',
      cursor: 'pointer',
    },
    segmentsShift: (index) => {
      if (selectedSegmentIndex === index) return 9;
      if (hoveredSegmentIndex === index) return 2;
      return 0.5;
    },
    animate: true,
    label: ({ dataEntry }) => `${dataEntry.title} (${Math.round(dataEntry.percentage)}%)`,
    labelPosition: window.innerWidth < 600 ? 100 : 110,
    labelStyle: getLabelStyle(),
  };

  return (
    <div data-page-no="2" className="tokenomics-container">
      <div className="mx-auto position-relative gallery-container">
        <div className="token-details tm-bg-dark tm-border-top tm-border-bottom p-4">
          {logouri && (
            <img
              src={logouri}
              alt="Token Logo"
              style={{
                objectFit: 'cover' // or 'contain' if you prefer to maintain aspect ratio
              }}
            />
          )}
          <h2 className="text-center mb-4" style={{ color: '#ffffff' }}>
            Total supply: {addComma(newToken)} ${token?.symbol}
          </h2>
          <h3 className="text-center mb-2" style={{ color: '#cccccc' }}>
            Initial total Supply: {addComma(totalsupply)}
          </h3>
          <h3 className="text-center" style={{ color: '#cccccc' }}>
            Burned so far: {addComma(burned)}
          </h3>
          <div className="line"></div>
        </div>
        <div className=" my-2 mx-auto tokenomics-grid-container tm-border-top tm-border-bottom tm-bg-dark" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PieChart
              data={pieChartData}
              {...pieChartOptions}
              onClick={(event, index) => {
                if (index === selectedSegmentIndex) {
                  setSelectedSegmentIndex(null);
                } else {
                  setSelectedSegmentIndex(index);
                }
              }}
              onMouseOver={(event, index) => setHoveredSegmentIndex(index)}
              onMouseOut={() => setHoveredSegmentIndex(null)}
              style={{ height: '350px' }}
              aria-label="Tokenomics Pie Chart"
            />
          </div>
      </div>
    </div>
  );
};

export default Tokenomics;
