import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import config from '../chainconfig';

const useWalletStore = create(
  persist(
    (set) => ({
      connectionState: null,
      setConnectionState: (data) => set({ connectionState: data }),
      connectProvider: async () => {
        try {
          const accountResult = await window.kadena.request({
            method: "kda_connect",
            networkId: config.networkId,
          });
          set({ connectionState: accountResult });
          console.log('Connected to Ecko Wallet:', accountResult);
        } catch (error) {
          console.error('Error connecting to Ecko Wallet:', error);
        }
      },
      disconnectProvider: async () => {
        try {
          await window.kadena.request({
            method: "kda_disconnect",
            networkId: config.networkId,
          });
          set({ connectionState: null });
        } catch (error) {
          console.error('Error disconnecting from Ecko Wallet:', error);
        }
      },
    sign: async function(signingCommand) {

      // Parse the 'cmd' field to an object
      const cmdParsed = JSON.parse(signingCommand.cmd);
      const caps = cmdParsed.signers[0].clist.map((clist) => clist);
  
      const signingCmd = {
        pactCode: cmdParsed.payload.exec.code, 
        envData: {},
        sender: cmdParsed.meta.sender,     
        chainId: cmdParsed.meta.chainId,
        gasLimit: cmdParsed.meta.gasLimit,
        gasPrice: cmdParsed.meta.gasPrice,
        signingPubKey: cmdParsed.signers[0].pubKey,
        ttl: cmdParsed.meta.ttl,
        caps: caps
    };
      let networkId = config.networkId;
      let req = {
        method: "kda_requestSign",
        networkId: networkId,
        data: {
            networkId: networkId,
            signingCmd: signingCmd
        }
      }
      try {
          var response = await window.kadena.request(req);
          return response;
          
      } catch (error) { 
          console.error("Error in sign function:", error);
          return null; 
      }
  },
    quickSign: async function(signingCommand) {
    
      let networkId = config.networkId;
      const commandObj = JSON.parse(signingCommand.cmd);
      
      // console.log(JSON.stringify(commandObj.payload.exec.data))
      const signers = commandObj.payload.exec.data.ks.keys.map(pubKey => {
        return {
          pubKey: pubKey,
          sig: null, // Initial signature is null
          clist: commandObj.signers[0].clist, 
        };
      });
      console.log(signers)
      const req = {
        method: "kda_requestQuickSign",
        networkId: networkId,
        data: {
          networkId: networkId,
          commandSigDatas: [{
            cmd: JSON.stringify(commandObj),
            sigs: signers,
          }]
        }
      };
      console.log(req)
      try {
        const cmd = await window.kadena.request(req);
        console.log(cmd)
        return cmd;
      } catch (error) { 
        console.error("Error in quickSign function:", error);
      }
    },
    
    quickSignCont: async function(signingCommand) {
      console.log("signingCommand", signingCommand);
      let networkId = config.networkId;
      const commandObj = JSON.parse(signingCommand.cmd);
      const signers = commandObj.payload.cont.data.ks.keys.map(pubKey => {
        return {
          pubKey: pubKey,
          sig: null, // Initial signature is null
          clist: commandObj.signers[0].clist, 
        };
      });
      const req = {
        method: "kda_requestQuickSign",
        networkId: networkId,
        data: {
          networkId: networkId,
          commandSigDatas: [{
            cmd: JSON.stringify(commandObj),
            sigs: signers,
          }]
        }
      };
    
      try {
        const cmd = await window.kadena.request(req);
        return cmd;
      } catch (error) { 
        console.error("Error in quickSign function:", error);
      }
    }
    }),
    {
      name: 'wallet-storage',
      getStorage: () => sessionStorage,
    }
  )
);

export const getAccount = () => {
  const { connectionState } = useWalletStore.getState();
  let account = null;
  if(connectionState?.account?.account){
    account = connectionState.account.account;
  } else if (connectionState?.account){
    account = connectionState.account;
  }
  return account;
}

export default useWalletStore;