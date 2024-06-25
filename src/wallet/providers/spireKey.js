import { create } from 'zustand';
import config from '../chainconfig';

const initialState = {
  spireKeyAccount: null,
  spireKeyConnected: false,
  spireKeyAuth: null,
};

const useSpireKeyStore = create((set) => ({
  spireKeyAccount: initialState.spireKeyAccount,
  spireKeyConnected: initialState.spireKeyConnected,
  spireKeyAuth: initialState.spireKeyAuth,
  connectSpireKey: async () => {
    try {
      const authRequest = await window.kadena.request({
        method: 'kda_spireKey_authRequest',
        networkId: config.networkId,
      });
      const authResponse = await window.kadena.request({
        method: 'kda_spireKey_authResponse',
        networkId: config.networkId,
        authRequest,
      });
      const spireKeyAccount = await window.kadena.request({
        method: 'kda_spireKey_connect',
        networkId: config.networkId,
        authResponse,
      });
      set({
        spireKeyAccount,
        spireKeyConnected: true,
        spireKeyAuth: authResponse,
      });
      console.log('Connected to SpireKey:', spireKeyAccount);
    } catch (error) {
      console.error('Error connecting to SpireKey:', error);
    }
  },
  disconnectSpireKey: async () => {
    try {
      await window.kadena.request({
        method: 'kda_spireKey_disconnect',
        networkId: config.networkId,
      });
      set({
        spireKeyAccount: null,
        spireKeyConnected: false,
        spireKeyAuth: null,
      });
    } catch (error) {
      console.error('Error disconnecting from SpireKey:', error);
    }
  },
}));

export default useSpireKeyStore;