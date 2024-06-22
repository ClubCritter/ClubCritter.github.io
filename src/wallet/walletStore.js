import { create } from 'zustand';
import config from '../wallet/chainconfig';

const initialState = window.kadena.request({
    method: 'kda_checkStatus',
    networkId: config.networkId
});

const useWalletStore = create((set) => ({
  connectionState: initialState,
  setConnectionState: (data) => set({ connectionState: data }),
  connect: async () => {
    try {
      const accountResult = await window.kadena.request({
        method: "kda_connect",
        networkId: config.networkId,
      });
      set({ connectionState: accountResult });
      console.log('Connected to Ecko Wallet:', accountResult);
    } catch (error) {
      console.error('Error connecting to Ecko Wallet:', error);
    }
  },
  disconnect: async () => {
    try {
      await window.kadena.request({
        method: "kda_disconnect",
        networkId: config.networkId,
      });
      set({ connectionState: initialState });
    } catch (error) {
      console.error('Error disconnecting from Ecko Wallet:', error);
    }
  },
}));

export default useWalletStore;