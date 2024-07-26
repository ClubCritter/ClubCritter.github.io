import React, { createContext, useContext, useEffect, useState } from 'react';
import { KadenaSpireKey } from './SpireKey';
import useWalletStore from '../walletStore';

const SpireKeyContext = createContext(null);

export const useSpireKey = () => useContext(SpireKeyContext);

export const SpireKeyProvider = ({ children }) => {
  const [spireKeyInstance] = useState(
    () => new KadenaSpireKey('https://spirekey.kadena.io', window.location.href)
  );
  const { setSessionData } = useWalletStore();

  useEffect(() => {
    if (spireKeyInstance.user !== null) {
      setSessionData({
        provider: 'SPIREKEY',
        account: spireKeyInstance.user.accountName,
        pubKey: spireKeyInstance.user.credentials[0].publicKey,
        isConnected: true,
      });
    }
  }, [setSessionData, spireKeyInstance]);

  useEffect(() => {
    const transactions = spireKeyInstance.transactions;
    if (Object.keys(transactions).length > 0) {
      setTransactionsToShow(transactions);
    }
  }, [spireKeyInstance]);

  return (
    <SpireKeyContext.Provider value={spireKeyInstance}>
      {children}
    </SpireKeyContext.Provider>
  );
};
