import React, { useState, useEffect } from 'react'
import usePresaleStore from '../store/usePresaleStore';
import { addComma } from './Tokenomics';


const BuyModal = ({tokenSymbol, batchCount, amountPerBatch, kdaInput, handleBuy, setShowBuyModal, availableBatches}) => {
  const {setBatchCount} = usePresaleStore()
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

  useEffect(() => {
    setBatchCount(1)
  }, [])

  return (
    <>
       <div className='wallet-modal-container tm-bg-light-n'>
        <div className='buy-modal tm-bg-darker-a'>
            <h2>Buy {tokenSymbol}</h2>
            <h4>in public sale you can buy as many tokens as you want</h4>
            <div className="buy-form">
              <label>You Give {kdaInput} KDA</label>
               <input value= {batchCount} type="number"
                                        min={1}
                                        step={1}
                                        max={availableBatches}
                      onChange={(e) => setBatchCount(e.target.value)} />
               <button onClick={handleBuy} className='btn btn-secondary'>Buy</button>
               <p>you shall get {addComma(amountPerBatch * batchCount)} {tokenSymbol}</p>
            </div>
        </div>
    </div>
    </>
  )
}

export default BuyModal