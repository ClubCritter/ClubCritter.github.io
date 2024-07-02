import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTokenStore = create(persist(
  (set) => ({
    token: {
      name: 'KDA',
      contract: 'coin',
      isCustom: false
    },
    chainId: '0',
    customContract: '',
    setToken: (token) => set({ token }),
    setChainId: (chainId) => set({ chainId }),
    setCustomContract:  (customContract) => set({customContract})
  }),
  {
    name: 'token-storage',
    storage: sessionStorage
  }
));

export default useTokenStore;