import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import img1 from '../assets/img/gallery-img-01.png';
import img2 from '../assets/img/gallery-img-02.png';
import img3 from '../assets/img/gallery-img-03.png';
import img4 from '../assets/img/gallery-img-04.png';
import { pactCalls } from "../pactcalls/kadena";
import { NS, MODULE_NAME } from "./Presale";
import useWalletStore from "../wallet/walletStore";
const chain = 1;

const Tokenomics = () => {
  const { pubKey } = useWalletStore.getState();
  const [totalsupply, setTotalSupply] = useState(0);
  const [logouri, setLogoUri] = useState('');
  const burned = 0;
  const newToken = totalsupply - burned;
  const [token, setToken] = useState({});
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(null);
  const [hoveredSegmentIndex, setHoveredSegmentIndex] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const code = `(use ${NS}.${MODULE_NAME}) DETAILS`;
      const res = await pactCalls(code, chain, pubKey);
      setToken(res.result.data);
      console.log(res.result.data)
      setTotalSupply(res.result.data.supply?.int);
      setLogoUri(res.result.data.imageUrl);
    };
    getToken();
  }, [pubKey, token]);

  const addComma = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const pieChartData = [
    { title: 'Team', value: 15, color: '#2c3e50' },
    { title: 'Treasury', value: 10, color: '#3498db' },
    { title: 'Presale', value: 30, color: '#2e865f' },
    { title: 'Locked Liquidity', value: 45, color: '#6c5ce7' },
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
