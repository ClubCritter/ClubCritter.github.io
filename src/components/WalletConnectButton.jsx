import useWalletStore from "../wallet/walletStore";
import { useWalletConnect, useWalletConnection } from "../wallet/wcStore";
import walletConnectStore from "../wallet/providers/connectWalletModalSlice";
import { useSpireKey } from "../wallet/spirekey/spireKeyProvider";

const WalletConnectButton = () => {
  const { connectWallet, disconnectWallet, isConnected, provider } = useWalletStore();
  const { handleConnect, handleDisconnect } = useWalletConnect();
  const { connectWithWalletConnect } = useWalletConnection();
  const spireKey = useSpireKey();
  const { setshowConnectWalletModal, sethideConnectWalletModal } = walletConnectStore();

  const handleClick = () => {
    // console.log("inside handleClick");
    if (isConnected) {
      if (provider === "SPIREKEY") {
        // console.log("are we in here for Spirekey?");
        spireKey.logout();
        disconnectWallet();
      } else {
        // console.log("are we in here for other providers?");
        disconnectWallet(); 
      }
      sethideConnectWalletModal();
    } else {
      // console.log("are we in here for not connected?");
      setshowConnectWalletModal();
      // connectWallet("WC", connectWithWalletConnect);
    }
  };

  return (
    <button onClick={handleClick}>
      {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
    </button>
  );
};

export default WalletConnectButton;