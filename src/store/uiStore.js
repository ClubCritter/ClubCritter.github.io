import { fetchBalance, transferCoin, airdropCoins } from '../pactcalls/kadena';
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAccount } from '../wallet/providers/walletStore';
import config from '../wallet/chainconfig';

const account = getAccount()

const useUiStore = create(persist(
    (set, get) => ({
        showKtgTest: false,
        setShowKtgTest: () => set({ showKtgTest: !get().showKtgTest }),
    }),
      {
        name: 'ui-storage',
        getStorage: () => sessionStorage,
      }
))

export default useUiStore