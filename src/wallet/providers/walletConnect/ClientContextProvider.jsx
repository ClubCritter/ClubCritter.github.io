import Client from "@walletconnect/sign-client";
import { Web3Modal } from "@web3modal/standalone";
import { getSdkError } from "@walletconnect/utils";
import React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useWalletStore from "../walletStore";

/**
 * Context
 */
export const ClientContext = createContext({});

/**
 * Web3Modal Config
 */
const web3Modal = new Web3Modal({
  projectId: import.meta.env.VITE_APP_projectId,
  themeMode: "light",
  walletConnectVersion: 2,
});

/**
 * Provider
 */
export function ClientContextProvider({ children }) {
  const [client, setClient] = useState();
  const [pairings, setPairings] = useState([]);
  const [session, setSession] = useState();
  const [accounts, setAccounts] = useState();

  const [isInitializing, setIsInitializing] = useState(false);

  const reset = () => {
    setSession(undefined);
  };

  const onSessionConnected = useCallback(async (_session) => {
    // console.log("onSessionConnected", _session)
    setSession(_session);
    setAccounts(_session?.namespaces?.kadena?.accounts);
  }, []);

  const connect = useCallback(
    async (pairing) => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      // console.log("connect, pairing topic is:", pairing?.topic);
      try {
        const { uri, approval } = await client.connect({
          pairingTopic: pairing?.topic,
          requiredNamespaces: {
            kadena: {
              methods: [
                "kadena_getAccounts_v1",
                "kadena_sign_v1",
                "kadena_quicksign_v1",
              ],
              chains: [
                "kadena:mainnet01",
                "kadena:testnet04",
                "kadena:development",
              ],
              events: [],
            },
          },
        });

        // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
        if (uri) {
          web3Modal.openModal({ uri });
        }

        const session = await approval();
        // console.log("Established session:", session);
        await onSessionConnected(session);

        // Update known pairings after session is connected.
        setPairings(client.pairing.getAll({ active: true }));

        // Parse the account string to get the public key and account.
        const fullAccountString = session.namespaces.kadena.accounts[0]; // Assume that the first account in the list is the one you want to use.
        const pubKey = fullAccountString.split(":").slice(2).join(":");
        // walletConnectStore.setState({ showModal: false });
        const account = `k:${pubKey}`;
        useWalletStore.setState((state) => ({
          connectionState: {
           ...state.connectionState,
            pubKey: pubKey,
            provider: ["WC"],
            session,
            account,
          },
        }));
      } catch (e) {
        console.error(e);
        // ignore rejection
      } finally {
        // close modal in case it was open
        web3Modal.closeModal();
      }
    },
    [client, onSessionConnected]
  );

  const disconnect = useCallback(async () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof session === "undefined") {
      throw new Error("Session is not connected");
    }

    try {
      await client.disconnect({
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    } catch (error) {
      console.error("SignClient.disconnect failed:", error);
    } finally {
      // Reset app state after disconnect.

      useWalletStore.connectionState.setState({
        account: "",
        provider: null,
        pubKey: "",
        session: null,
      });

      useWalletStore.connectionState.setState({
        messages: `Successfully Disconnected from WalletConnect`,
        networkId: null,
      });

      reset();
    }
  }, [client, session]);

  const _subscribeToEvents = useCallback(
    async (_client) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }

      _client.on("session_ping", (args) => {
        // console.log("EVENT", "session_ping", args)
      });

      _client.on("session_event", (args) => {
        // console.log("EVENT", "session_event", args)
      });

      _client.on("session_update", ({ topic, params }) => {
        // console.log("EVENT", "session_update", { topic, params })
        const { namespaces } = params;
        const _session = _client.session.get(topic);
        const updatedSession = { ..._session, namespaces };
        onSessionConnected(updatedSession);
      });

      _client.on("session_delete", () => {
        // console.log("EVENT", "session_delete")
        reset();
      });
    },
    [onSessionConnected]
  );

  const _checkPersistedState = useCallback(
    async (_client) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      // populates existing pairings to state
      setPairings(_client.pairing.getAll({ active: true }));

      if (typeof session !== "undefined") return;
      // populates (the last) existing session to state
      if (_client.session.length) {
        const lastKeyIndex = _client.session.keys.length - 1;
        const _session = _client.session.get(
          _client.session.keys[lastKeyIndex]
        );
        // console.log("RESTORED SESSION:", _session)
        await onSessionConnected(_session);
        return _session;
      }
    },
    [session, onSessionConnected]
  );

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true);

      const _client = await Client.init({
        relayUrl: import.meta.env.VITE_APP_relayUrl,
        projectId: import.meta.env.VITE_APP_projectId,
      });

      // console.log("CREATED CLIENT: ", _client)
      setClient(_client);
      await _subscribeToEvents(_client);
      await _checkPersistedState(_client);
    } catch (err) {
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [_checkPersistedState, _subscribeToEvents]);

  useEffect(() => {
    if (!client) {
      createClient();
    }
  }, [client, createClient]);

  const value = useMemo(
    () => ({
      pairings,
      isInitializing,
      accounts,
      client,
      session,
      connect,
      disconnect,
    }),
    [pairings, isInitializing, accounts, client, session, connect, disconnect]
  );

  return (
    <ClientContext.Provider
      value={{
        ...value,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export const useWalletConnectClient = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error(
      "useWalletConnectClient must be used within a ClientContextProvider"
    );
  }
  console.log("useWalletConnectClient:", context);
  return context;
};