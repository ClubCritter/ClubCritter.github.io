import useWalletStore from "../wallet/walletStore";
import { useWalletConnect, useWalletConnection } from "../wallet/wcStore";
import walletConnectStore from "../wallet/providers/connectWalletModalSlice";
import { useSpireKey } from "../wallet/spirekey/spireKeyProvider";

const WalletConnectButton = () => {
  const { disconnectWallet, isConnected, provider } = useWalletStore();
  const { handleConnect, handleDisconnect } = useWalletConnect();
  const { connectWithWalletConnect } = useWalletConnection();
  const spireKey = useSpireKey();

  // Use Zustand's hook to access state and actions
  
  const setshowConnectWalletModal = walletConnectStore((state) => state.setshowConnectWalletModal);
  const sethideConnectWalletModal = walletConnectStore((state) => state.sethideConnectWalletModal);
 
  const handleClick = () => {
    if (isConnected) {
      if (provider === "SPIREKEY") {
        spireKey.logout();
        disconnectWallet();
      } else {
        disconnectWallet();
      }
      sethideConnectWalletModal();
    } else {
      setshowConnectWalletModal();
    }
  };

  return (
    <button className='btn btn-primary tm-intro-btn tm-page-link mb-4 col-12'
       onClick={handleClick}>
      {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
    </button>
  );
};

export default WalletConnectButton;
