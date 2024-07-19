import React, { useState, useEffect } from 'react'

const BuyModal = ({tokenSymbol, tokenAmount, kdaInput, setKdaInput, handleBuy, setShowBuyModal}) => {
  const [isMounted, setIsMounted] = useState(false);
  

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.addEventListener('click', handleOutsideClick);
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isMounted]);
  
  const handleOutsideClick = (event) => {
    if (!event.target.closest('.buy-modal')) {
      setShowBuyModal(false);
    }
  };
  return (
    <>
       <div className='wallet-modal-container tm-bg-dark-n'>
        <div className='buy-modal'>
            <h2>Buy {tokenSymbol}</h2>
            <h4>in public sale you can buy as many tokens as you want</h4>
            <div className="buy-form">
               <input value= {kdaInput} onChange={(e) => setKdaInput(e.target.value)} />
               <button onClick={handleBuy} className='btn btn-secondary'>Buy</button>
               <p>you shall get total {tokenAmount} {tokenSymbol}</p>
            </div>
        </div>
    </div>
    </>
  )
}

export default BuyModal