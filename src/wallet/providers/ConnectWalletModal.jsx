// ConnectWalletModal.jsx
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { X_WALLET, WC, KOALA } from "./providers";
import useWalletStore from "../walletStore";
import walletConnectStore from "./connectWalletModalSlice";
import "./wallet.css";
import { useWalletConnect, useWalletConnection } from "../wcStore";
// import Ecko from "../../assets/ecko.svg?react";
// import WalletConnect from "../../assets/walletconnect.svg?react";
// import Koala from "../../assets/koalalogo.svg?react";
// import SpireKey from "../../assets/spirekey.svg?react";
import { useSpireKey } from "../spirekey/spireKeyProvider";
import { toast } from "react-toastify";

const ConnectWalletModal = ({ onWalletConnected }) => {
  const spireKey = useSpireKey();
  const showModal = walletConnectStore((state) => state.showModal);
  const { handleConnect } = useWalletConnect();
  const { connectWithWalletConnect } = useWalletConnection();
  const closeModal = walletConnectStore((state) => state.sethideConnectWalletModal);
  const { connectWallet, provider } = useWalletStore();
  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  const connectXWalletClicked = () => {
    !window.kadena && toast.error("eckoWallet not installed")
    connectWallet(X_WALLET);
    closeModal()
  };
  // const connectKoalaClicked = () => connectWallet(KOALA);
  // const connectSpireKeyClicked = () => {
  //   if (!spireKey?.isLoggedIn) {
  //     spireKey.login();
  //   } else {
  //     console.log("User is already logged in:");
  //   }
  // };

  const handleWalletConnect = async () => {
    handleConnect();
    connectWallet(WC, connectWithWalletConnect);
    closeModal();
    // connectWallet(WC);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  useEffect(() => {
    if (onWalletConnected && provider) {
      onWalletConnected(provider);
    }
  }, [provider, onWalletConnected]);

  if (!showModal) {
    return null;
  }

  return (
    <div className="wallet-modal-container tm-bg-dark-n">
      <div className="wallet-modal" ref={modalRef}>
            <button onClick={connectXWalletClicked} className='btn btn-primary provider-button' > Ecko Wallet </button>
            <button onClick={handleWalletConnect} className='btn btn-primary provider-button' > Wallet Connect </button>
      </div>
    </div>
  );
};

ConnectWalletModal.propTypes = {
  onWalletConnected: PropTypes.func,
};

export default ConnectWalletModal;
