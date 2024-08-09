// src/store/usePresaleStore.js
import { create } from 'zustand';
import { pactCalls, fetchBalance } from '../pactcalls/kadena';

const usePresaleStore = create((set) => ({
  balance: 0,
  phase0startTime: null,
  phase1startTime: null,
  salesEndTime: null,
  isWhitelisted: false,
  p0Reserved: 0,
  amountPerBatch: null,
  currentPrice: null,
  kdaInput: 0,
  batchCount: 0,
  tokenSymbol: '',
  salesAccount: '',
  availableBatches: 0,
  supplyChain: '1',
  
  setKdaInput: (input) => set({kdaInput: input}) ,
  setBatchCount: (input) => set({batchCount: input}),
  setAvailableBatches: (input) => set({availableBatches: input}),
  setBalance: (input) => set({balance: input}),
  
  fetchBalance: async (account, chain) => {
    try {
      const code = `(coin.get-balance "${account}")`;
      const balance = await fetchBalance(code, chain);
      set({ balance });
    } catch (err) {
      console.error(err);
    }
  },
  fetchPhase0StartTime: async (NS, SALES_MODULE_NAME, chain, pubKey) => {
    try {
      const code = `(use ${NS}.${SALES_MODULE_NAME}) PHASE-0-START`;
      const res = await pactCalls(code, chain, pubKey);
      set({ phase0startTime: new Date(res.result.data.time) });
    } catch (err) {
      console.error(err);
    }
  },
  fetchPhase1StartTime: async (NS, SALES_MODULE_NAME, chain, pubKey) => {
    try {
      const code = `(use ${NS}.${SALES_MODULE_NAME}) PHASE-1-START`;
      const res = await pactCalls(code, chain, pubKey);
      set({ phase1startTime: new Date(res.result.data.time) });
    } catch (err) {
      console.error(err);
    }
  },
  fetchSalesEndTime: async (NS, SALES_MODULE_NAME, chain, pubKey) => {
    try {
      const code = `(use ${NS}.${SALES_MODULE_NAME}) END-OF-PRESALES`;
      const res = await pactCalls(code, chain, pubKey);
      set({ salesEndTime: new Date(res.result.data.time) });
    } catch (err) {
      console.error(err);
    }
  },
  fetchP0Reserved: async (NS, SALES_MODULE_NAME, chain, pubKey) => {
    try {
      const code = `(use ${NS}.${SALES_MODULE_NAME}) P0-RESERVED`;
      const res = await pactCalls(code, chain, pubKey);
      set({ p0Reserved: res.result.data });
    } catch (err) {
      console.error(err);
    }
  },
  fetchAmountPerBatch: async (NS, SALES_MODULE_NAME, chain, pubKey) => {
    try {
      const code = `(use ${NS}.${SALES_MODULE_NAME}) AMOUNT-PER-BATCH`;
      const res = await pactCalls(code, chain, pubKey);
      set({ amountPerBatch: res.result.data });
    } catch (err) {
      console.error(err);
    }
  },
  fetchSupplyChain: async (NS, MODULE_NAME, chain, pubKey) => {
    try {
      const code = `(use ${NS}.${MODULE_NAME}) SUPPLY-CHAIN`;
      const res = await pactCalls(code, chain, pubKey);
      set({ supplyChain: res.result.data });
    } catch (err) {
      console.error(err);
    }
  },
  fetchTokenSymbol: async (NS, MODULE_NAME, chain, pubKey) => {
    try {
      const code = `(use ${NS}.${MODULE_NAME}) DETAILS`;
      const res = await pactCalls(code, chain, pubKey);
      set({ tokenSymbol: res.result.data.symbol.toUpperCase() });
    } catch (err) {
      console.error(err);
    }
  },
  fetchSalesAccount: async (NS, SALES_MODULE_NAME, chain, pubKey) => {
    try {
      const code = `(use ${NS}.${SALES_MODULE_NAME}) SALES-ACCOUNT`;
      const res = await pactCalls(code, chain, pubKey);
      set({ salesAccount: res.result.data });
    } catch (err) {
      console.error(err);
    }
  },
  fetchCurrentPrice: async (NS, SALES_MODULE_NAME, chain, pubKey) => {
    try {
      const code = `(${NS}.${SALES_MODULE_NAME}.get-price)`;
      const res = await pactCalls(code, chain, pubKey);
      set({ currentPrice: res.result.data });
    } catch (err) {
      console.error(err);
    }
  },
  fetchWlStatus: async (NS, SALES_MODULE_NAME, account, chain, pubKey) => {
    try {
      const code = `(${NS}.${SALES_MODULE_NAME}.has-reservation "${account}")`;
      const res = await pactCalls(code, chain, pubKey);
      set({ isWhitelisted: res.result.data });
    } catch (err) {
      console.error(err);
    }
  },
  fetchAvailableBatches: async (NS, SALES_MODULE_NAME, account, chain, pubKey) => {
    try {
      const code = `(${NS}.${SALES_MODULE_NAME}.available-batches "${account}")`;
      const res = await pactCalls(code, chain, pubKey);
      set({ availableBatches: res.result.data });
    } catch (err) {
      console.error(err);
    }
  },
  resetState: () => {
    set({
      balance: 0,
      phase0startTime: null,
      phase1startTime: null,
      salesEndTime: null,
      isWhitelisted: false,
      p0Reserved: 0,
      amountPerBatch: null,
      currentPrice: null,
      kdaInput: 0,
      batchCount: 0,
      tokenSymbol: '',
      salesAccount: '',
      availableBatches: 0,
      supplyChain: '1',
    });
  },
}));

export default usePresaleStore;
