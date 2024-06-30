
import React, { useState, useCallback } from 'react';
import { fetchBalance, transferCoin, airdropCoins } from '../pactcalls/kadena';
import useWalletStore, { getAccount } from '../wallet/providers/walletStore';
import { tokens, chains } from '../pactcalls/tokens';
import CheckBalance from './CheckBalance';
import SendTokens from './SendTokens';


const KtgTest = ({handleKtgTest}) => {
  const { quickSign } = useWalletStore()
  const [chainId, setChainId] = useState('0')
  const [wallet, setWallet] = useState({
    account: getAccount(),
    balance: '',
    chain: chainId,
  });
  const [token, setToken] = useState({
    name: 'KDA',
    contract: 'coin'
  })
  const [ac, setAc] = useState('');
  const [amt, setAmt] = useState(0);
  const [reqKey, setReqKey] = useState('');
  const [result, setResult] = useState('');
  const [receivers, setReceivers] = useState([]);
  const [showOption, setShowOption] = useState(null);
  
  
  const pubKey = wallet.account.slice(2, 66);
  
  const options = [
    {
      optionName: 'Check Balance',
      action: 'checkBalance',
    },
    {
      optionName: 'Send Tokens',
      action: 'sendTokens',
    },
    {
      optionName: 'Send Airdrop',
      action: 'sendAirdrop',
    },
  ];

  const handleOptionClick = (action) => {
    setShowOption(action);
  };

  const renderOption = () => {
    switch (showOption) {
      case 'checkBalance':
        return <CheckBalance wallet={wallet} token={token} setToken={setToken} chainId={chainId} setChainId={setChainId} getBalance={getBalance}/>;
      case 'sendTokens':
        return <SendTokens />;
      case 'sendAirdrop':
        return <SendAirdrop />;
      default:
        return null;
    }
  };


  const getBalance = useCallback(async (token) => {
    try {
      const code = `(${token}.get-balance "${wallet.account}")`;
      const balance = await fetchBalance(code, chainId);
      setWallet({
        ...wallet,
        balance: balance,
      });
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [wallet]);

  const sendCoin = useCallback(async (ac, amt) => {
    try {
      const code = `(coin.transfer "${wallet.account}" "${ac}" ${amt})`;
      const result = await transferCoin(code, wallet.chain, quickSign, pubKey, wallet.account, ac, Number(amt));
      console.log(result);
      const key = result.transactionDescriptor.requestKey;
      const status = result.preflightResult.result.status;
      getBalance();
      setReqKey(key);
      setResult(status);
      toast.success("Transfer Success");
      console.log("result :", key);
      setAc('');
      setAmt(0);
    } catch (err) {
      console.error('Error transferring coin:', err);
    }
  }, [wallet, quickSign, pubKey, getBalance]);

  const sendAirdrop = useCallback(async (receivers, amt) => {
    try {
       const code = `
          (coin.transfer-create 
          (read-string "sender")
          "u:ns.success:DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g"
          ns.GUARD_SUCCESS
          (* (length (read-msg "receivers")) (read-decimal "amount")))
  
        (map (lambda (receiver)
          (install-capability (coin.TRANSFER "u:ns.success:DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g" receiver (read-decimal "amount"))))
          (read-msg "receivers"))  
  
        (map (lambda (receiver)
          (coin.transfer "u:ns.success:DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g" receiver (read-decimal "amount")))
          (read-msg "receivers"))
  
        "Airdrop completed successfully"
        `;
      const result = await airdropCoins(code, wallet.chain, quickSign, pubKey, wallet.account, receivers, Number(amt));
      console.log(result);
      const key = result.transactionDescriptor.requestKey;
      const status = result.preflightResult.result.status;
      getBalance();
      setReqKey(key);
      setResult(status);
      toast.success("Airdrop Success");
      console.log("result :", key);
      setReceivers([]);
      setAmt(0);
    } catch (err) {
      console.error('Error sending airdrop:', err);
    }
  }, [wallet, quickSign, pubKey, getBalance]);

  const onAirDopClick = useCallback(() => {
    let receivers = ac.split(',');

    setReceivers(receivers);
    sendAirdrop(receivers, Number(amt));
  }, [ac, amt, sendAirdrop]);


  return (
    <div className="account-name tm-bg-dark ktg-test-wrap">
      <h1>KTG Test</h1>
      <p>Account: {wallet.account}</p>
      {options.map((option, index) => (
        <div key={index} >
          <button className="btn btn-primary col-12" onClick={() => handleOptionClick(option.action)}>
          {option.optionName}
           </button>
           {showOption === option.action && renderOption()}
        </div>
      ))}
      <button className='close-button' 
              onClick={handleKtgTest}>Close</button>
    </div>
  );
};

export default KtgTest;