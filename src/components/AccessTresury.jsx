import React, { useState, useEffect } from 'react'
import { NS, MODULE_NAME } from './Presale';
import { fetchBalance, pactCalls, transferCoin } from '../pactcalls/kadena';
import usePresaleStore from '../store/usePresaleStore';
import { useWalletConnectClient } from '../wallet/providers/ClientContextProvider';
import useWalletStore from '../wallet/walletStore';

const AccessTresury = ({tokenSymbol}) => {
    const { supplyChain } = usePresaleStore();
    const {account, pubKey} = useWalletStore()
    const { client, session } = useWalletConnectClient();
    const [tresuryTokenBalance, setTresuryTokenBalance] = useState(0);
    const [treasuryContractAccount, setTresuryContractAccount] = useState('');
    const [ac, setAc] = useState('')
    const [amt, setAmt] = useState(0)

    const getTesuryContractAccount = async () => {
      const code = `(use ${NS}.${MODULE_NAME}-treasury) TREASURY-ACCOUNT`
      const res = await pactCalls(code, supplyChain)
      setTresuryContractAccount(res.result.data)
    }

    const getTresuryTokenBalance = async() =>{
      const code = `(${NS}.${MODULE_NAME}-treasury.${MODULE_NAME}-balance)`
      const res = await fetchBalance(code, supplyChain)
      setTresuryTokenBalance(res)
  }
    const transferTokens = async() => {
      const token = `${NS}.${MODULE_NAME}`
      const code = `(${token}.transfer-create "${treasuryContractAccount}" "${ac}" (read-keyset "ac-keyset") ${amt})`
      const res = transferCoin(token, code, supplyChain, pubKey, treasuryContractAccount, ac, amt, client, session)
      console.log(res)
    }
    
    useEffect(() => {
      const fetchDetails = async () =>{
        await getTesuryContractAccount();
        await getTresuryTokenBalance();
      }
      fetchDetails()
    }, [])
    

  return (
    <div className='dashboard-container'>
        <h1>${tokenSymbol} Tresury</h1>
        <div className='d-grid'>
            <h2>Balance</h2>
            <h3>{tresuryTokenBalance} ${tokenSymbol}</h3>
            <button onClick={async () => 
              {await getTresuryTokenBalance()}}>Refresh</button>
            
            <div>
              <h4>transfer tokens</h4>
              <div>
                <label htmlFor="account">Account</label>
                <input type='text' onChange={(e) => setAc(e.target.value)}></input>
                <label>amount</label>
                <input type='number' onChange={(e) => setAmt(e.target.value)}></input>
                <button onClick={transferTokens}>send</button>
              </div>
            </div>
        </div>
    </div>
  )
}

export default AccessTresury