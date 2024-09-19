import { expect, afterEach, vi } from 'vitest';
import { act } from 'react';
import { cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { render } from '@testing-library/react';
import ClientContextProvider from '../wallet/providers/ClientContextProvider';

// Extend expect with matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Polyfill for window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock localStorage
window.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

// Mock WalletConnect dependencies
vi.mock('@walletconnect/sign-client', () => ({
  __esModule: true,
  default: {
    init: vi.fn().mockResolvedValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
      on: vi.fn(),
      pairing: {
        getAll: vi.fn().mockReturnValue([]) // Mock getAll method
      },
      session: {
        length: 0,
        keys: [],
        get: vi.fn()
      }
    })
  }
}));

vi.mock('@walletconnect/modal', () => ({
  __esModule: true,
  WalletConnectModal: vi.fn().mockImplementation(() => ({
    openModal: vi.fn(),
    closeModal: vi.fn()
  }))
}));

vi.mock('@walletconnect/utils', () => ({
  __esModule: true,
  getSdkError: vi.fn().mockReturnValue({})
}));

// Mock pactCalls
vi.mock('../pactcalls/kadena', () => ({
  pactCalls: vi.fn(),
  buyTokensSale: vi.fn(),
  fetchBalance: vi.fn(),
}));

// Mock walletStore
vi.mock('../wallet/walletStore', () => ({
  __esModule: true,
  default: () => ({
    getState: vi.fn(() => ({
      provider: 'mockProvider',
      account: 'mockAccount',
      pubKey: 'mockPubKey',
      isConnected: true,
      messages: 'mockMessages',
      session: {},
      setSessionData: vi.fn(),
      connectWallet: vi.fn(),
      disconnectWallet: vi.fn(),
      setProvider: vi.fn(),
    })),
    setState: vi.fn(),  // Optionally mock setState if used
  }),
}));

// Mock useWalletConnectClient
vi.mock('../wallet/providers/ClientContextProvider', () => ({
  __esModule: true,
  useWalletConnectClient: vi.fn().mockReturnValue({
    client: {},
    pairings: [],
    isInitializing: false,
    accounts: [],
    session: undefined,
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
  default: vi.fn(), // Add this line if needed
}));

// Mock toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Global test wrapper
global.renderWithRouter = (ui, options) => {
  act(() => {
    return render(
      <ClientContextProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </ClientContextProvider>,
      options
    );
  });
};
