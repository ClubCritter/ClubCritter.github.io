
import React, { useState, useCallback } from 'react';
import { fetchBalance, transferCoin, airdropCoins } from '../pactcalls/kadena';
import useWalletStore, { getAccount } from '../wallet/providers/walletStore';
import { tokens, chains } from '../pactcalls/tokens';
import CheckBalance from './CheckBalance';
import SendTokens from './SendTokens';
import SendAirdrop from './SendAirdrop';
import { toast } from 'react-toastify';
import useTokenStore from '../store/tokenStore';


const KtgTest = ({handleKtgTest}) => {
  const { quickSign } = useWalletStore()
  const { chainId } = useTokenStore()
  const [wallet, setWallet] = useState({
    account: getAccount(),
    balance: '',
    chain: chainId,
  });
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
    {
      optionName: 'Multi Transfer',
      action: 'sendMultiTransfer'
    }
  ];

  const handleOptionClick = (action) => {
    setShowOption(action);
  };

  const renderOption = () => {
    switch (showOption) {
      case 'checkBalance':
        return <CheckBalance wallet={wallet} getBalance={getBalance}/>;
      case 'sendTokens':
        return <SendTokens wallet={wallet} getBalance={getBalance} sendCoin={sendCoin}/>;
      case 'sendAirdrop':
        return <SendAirdrop wallet={wallet} getBalance={getBalance} sendAirdrop={sendAirdrop} />;
      case 'sendMultiTransfer':
        return <SendAirdrop wallet={wallet} getBalance={getBalance} sendAirdrop={sendAirdrop} />;
      default:
        return null;
    }
  };


  const getBalance = useCallback(async (token, chain) => {
    try {
      const code = `(${token}.get-balance "${wallet.account}")`;
      const balance = await fetchBalance(code, chain);
      setWallet({
        ...wallet,
        balance: balance,
      });
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [wallet]);

  const sendCoin = useCallback(async (token, chain, ac, amt) => {
    try {
      const code = `(${token}.transfer-create "${wallet.account}" "${ac}" (read-keyset "ac-keyset") ${amt})`;
      const result = await transferCoin(token, code, chain, quickSign, pubKey, wallet.account, ac, Number(amt));
      console.log(result);
      const key = result.transactionDescriptor.requestKey;
      const status = result.preflightResult.result.status;
      return { key, status }
    } catch (err) {
      console.error('Error transferring coin:', err);
    }
  }, [wallet, quickSign, pubKey]);

  const sendAirdrop = useCallback(async (token, chain, receivers, amt) => {
    try {
       const code = `
          (${token}.transfer-create 
          (read-string "sender")
          "u:ns.success:DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g"
          ns.GUARD_SUCCESS
          (* (length (read-msg "receivers")) (read-decimal "amount")))
  
        (map (lambda (receiver)
          (install-capability (${token}.TRANSFER "u:ns.success:DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g" receiver (read-decimal "amount"))))
          (read-msg "receivers"))  
  
        (map (lambda (receiver)
          (${token}.transfer-create "u:ns.success:DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g" receiver (read-keyset receiver) (read-decimal "amount")))
          (read-msg "receivers"))
  
        "Airdrop completed successfully"
        `;
      const result = await airdropCoins(token, code, chain, quickSign, pubKey, wallet.account, receivers, amt);
      console.log(result);
      const key = result.transactionDescriptor.requestKey;
      const status = result.preflightResult.result.status;
      return { key, status }
    } catch (err) {
      console.error('Error sending airdrop:', err);
    }
  }, [wallet, quickSign, pubKey]);



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