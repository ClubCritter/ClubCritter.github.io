import { useWalletConnectClient } from "./ClientContextProvider";
import { create } from "zustand";

const useWalletConnectStore = create((set) => ({
  selectedAccount: null,
  signingType: "sign",
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  setSigningType: (type) => set({ signingType: type }),
}));

export const useWalletConnect = () => {
  const { selectedAccount, signingType, setSelectedAccount, setSigningType } =
    useWalletConnectStore();
  const { session, connect, disconnect, isInitializing } =
    useWalletConnectClient();
  console.log({session, connect, disconnect, isInitializing})

  const handleConnect = async () => {
        await connect();
    };
    
  const handleDisconnect = async () => {
        await disconnect();
      }

  return {
    session,
    selectedAccount,
    signingType,
    isInitializing,
    setSelectedAccount,
    setSigningType,
    handleConnect,
    handleDisconnect,
  };
};

export const useWalletConnection = (connect, disconnect) => {
  // Function to establish a connection with WalletConnect
  const connectWithWalletConnect = async () => {
    connect();
  };

  // Now, connectWithWalletConnect can be called within our components
  return { connectWithWalletConnect };
};