import React, { useState, useEffect } from 'react'
import { NS, MODULE_NAME } from './Presale';
import { fetchBalance, pactCalls, transferCoinTreasury } from '../pactcalls/kadena';
import usePresaleStore from '../store/usePresaleStore';
import { useWalletConnectClient } from '../wallet/providers/ClientContextProvider';
import useWalletStore from '../wallet/walletStore';
import useTreasuryStore from '../store/useTreasuryStore';

const AccessTresury = ({tokenSymbol}) => {
    const { supplyChain, salesEndTime } = usePresaleStore();
    const {account, pubKey} = useWalletStore()
    const { client, session } = useWalletConnectClient();
    
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
  
    const now = new Date();
    const isSalesEnd = now > salesEndTime;
  
    useEffect(() => {
      const fetchDetails = async () => {
        await getTreasuryContractAccount(NS, MODULE_NAME, supplyChain);
        await getTreasuryTokenBalance(NS, MODULE_NAME, supplyChain, treasuryContractAccount);
        await getLiquidityAccount(NS, MODULE_NAME, supplyChain);
        await getLiquidityTokenBalance(NS, MODULE_NAME, supplyChain, liquidityAccount);
        await getTreasuryGuard(NS, MODULE_NAME, supplyChain);
        if (isSalesEnd) {
          await getTreasuryKdaBalance(supplyChain, treasuryContractAccount);
        }
      };
      fetchDetails();
    }, [treasuryContractAccount, liquidityAccount, isSalesEnd, supplyChain]);
    
    
    const transferTokens = async() => {
      const token = `${NS}.${MODULE_NAME}`
      const code = `(${token}.transfer-create "${treasuryContractAccount}" "${ac}" [${treasuryGuard}] ${amt})`
      const res = transferCoinTreasury(token, code, supplyChain, pubKey, treasuryContractAccount, ac, treasuryGuard, amt, client, session)
      console.log(res)
    }

  return (
    <div className='dashboard-container'>
        <h1>${tokenSymbol} Treasury</h1>
        <div className='d-grid'>
          <div className='treasury-balance'>
            <h3>Treasury Balance : </h3>
            <h3>{treasuryTokenBalance} ${tokenSymbol}</h3>
          </div>
          <div className='treasury-balance'>
            <h3>Liquidity Balance : </h3>
            <h3>{liquidityTokenBalance} ${tokenSymbol}</h3>
          </div>
            <div>
              <h4>Transfer tokens</h4>
              <div>
                <label htmlFor="account">Account</label>
                <input type='text' onChange={(e) => setAc(e.target.value)}></input>
                <label>amount</label>
                <input type='number' onChange={(e) => setAmt(parseFloat(e.target.value))}></input>
                <button onClick={transferTokens}>send</button>
              </div>
            </div>
        </div>
    </div>
  )
}

export default AccessTresury