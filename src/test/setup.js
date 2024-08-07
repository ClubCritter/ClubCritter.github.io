import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

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
vi.mock('@walletconnect/sign-client', () => {
    return {
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
    };
  });
  
  vi.mock('@walletconnect/modal', () => {
    return {
      __esModule: true,
      WalletConnectModal: vi.fn().mockImplementation(() => {
        return {
          openModal: vi.fn(),
          closeModal: vi.fn()
        };
      })
    };
  });
  
  vi.mock('@walletconnect/utils', () => {
    return {
      __esModule: true,
      getSdkError: vi.fn().mockReturnValue({})
    };
  });