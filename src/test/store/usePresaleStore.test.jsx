// src/store/usePresaleStore.test.js
import { act } from 'react-dom/test-utils';
import { pactCalls, fetchBalance } from '../../pactcalls/kadena';
import usePresaleStore from '../../store/usePresaleStore';

describe('usePresaleStore', () => {
  beforeEach(() => {
    usePresaleStore.setState({
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
  });

  it('should update balance after fetchBalance is called', async () => {
    fetchBalance.mockResolvedValueOnce(100);

    await act(async () => {
      await usePresaleStore.getState().fetchBalance('mockAccount', '1');
    });

    expect(fetchBalance).toHaveBeenCalledWith('(coin.get-balance "mockAccount")', '1');
    expect(usePresaleStore.getState().balance).toBe(100);
  });

  it('should update phase0startTime after fetchPhase0StartTime is called', async () => {
    const mockStartTime = new Date().toISOString();
    pactCalls.mockResolvedValueOnce({
      result: { data: { time: mockStartTime } },
    });

    await act(async () => {
      await usePresaleStore.getState().fetchPhase0StartTime('mockNS', 'mockSalesModule', '1', 'mockPubKey');
    });

    expect(pactCalls).toHaveBeenCalledWith('(use mockNS.mockSalesModule) PHASE-0-START', '1', 'mockPubKey');
    expect(usePresaleStore.getState().phase0startTime).toEqual(new Date(mockStartTime));
  });

  it('should update tokenSymbol after fetchTokenSymbol is called', async () => {
    pactCalls.mockResolvedValueOnce({
      result: { data: { symbol: 'MOCK' } },
    });

    await act(async () => {
      await usePresaleStore.getState().fetchTokenSymbol('mockNS', 'mockModule', '1', 'mockPubKey');
    });

    expect(pactCalls).toHaveBeenCalledWith('(use mockNS.mockModule) DETAILS', '1', 'mockPubKey');
    expect(usePresaleStore.getState().tokenSymbol).toBe('MOCK');
  });

  it('should reset the state when resetState is called', () => {
    usePresaleStore.setState({
      balance: 50,
      tokenSymbol: 'TEST',
    });

    usePresaleStore.getState().resetState();

    const state = usePresaleStore.getState();
    expect(state.balance).toBe(0);
    expect(state.tokenSymbol).toBe('');
  });
});
