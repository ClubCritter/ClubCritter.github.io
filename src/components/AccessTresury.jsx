import React, { useState, useEffect } from 'react'
import { NS, MODULE_NAME } from './Presale';
import { pactCallsSig } from '../pactcalls/kadena';
import usePresaleStore from '../store/usePresaleStore';
import { useWalletConnectClient } from '../wallet/providers/ClientContextProvider';

const AccessTresury = ({tokenSymbol}) => {
    const { supplyChain } = usePresaleStore();
    const { client, session } = useWalletConnectClient();
    const [tresuryTokenBalance, setTresuryTokenBalance] = useState(0);
    const [tresuryKdaBalance, setTresuryKdaBalance] = useState(0);

    const getTresuryTokenBalance = async() =>{
        const code = `(${NS}.${MODULE_NAME}-treasury.${MODULE_NAME}-balance)`
        const res = await pactCallsSig(code, supplyChain, client, session )
        setTresuryTokenBalance(res.preflightResult.result.data)
    }
    const getTresuryKdaBalance = async() =>{
        const code = `(${NS}.${MODULE_NAME}-treasury.kda-balance)`
        const res = await pactCallsSig(code, supplyChain, client, session )
        setTresuryKdaBalance(res.preflightResult.result.data)
    }

  return (
    <div className='dashboard-container'>
        <h1>${tokenSymbol} Tresury</h1>
        <div className='d-grid'>
            <h2>Balance</h2>
            <h3>{tresuryTokenBalance} ${tokenSymbol}</h3>
            <h3>{tresuryKdaBalance} $KDA</h3>
            <button onClick={async () => 
              {await getTresuryTokenBalance();
               await getTresuryKdaBalance();}}>Refresh</button>
        </div>
    </div>
  )
}

export default AccessTresury