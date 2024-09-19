import { Pact, readKeyset, createClient } from "@kadena/client";


import useWalletStore from "./walletStore";
import providers from "./providers/providers";
import { toast } from "react-toastify";
import config from "../utils/config";

export const register = async (name, amount, wallets, chain, client, session) => {
  const jsclient = createClient(
    `${config.apiUrl}/chainweb/0.0/${config.networkId}/chain/${chain}/pact`
  );
  const NETWORK_ID = `${config.networkId}`;
  const { account, pubKey } = useWalletStore.getState();
  const gpayer = "u:n_eef68e581f767dd66c4d4c39ed922be944ede505.gas-station.enforce-guard-any:dorjIaX8IGJZtfgZzYRkXV0DE9mEPxPvyuwdmML5eTk";
  const providerName = useWalletStore.getState().provider;
  let provider = providers[providerName];

  if (providerName === null) {
    throw new Error("Provider not found");
  }

  const escrow = await getEscrow(name, account, chain);
  const senderAccount = account;
  const fee = { decimal: `${amount}` };
  const signerKey = pubKey;

  let transaction;

  if (providerName === 'SPIREKEY') {
    transaction = Pact.builder
      .execution(
        Pact.modules[config.contract]["register"](
          name,
          account,
          readKeyset("ks"),
          wallets
        ),
        Pact.modules["coin"]["details"](account)
      )
      .addSigner(
        {
          pubKey: signerKey,
          scheme: 'WebAuthn',
        },
        (signFor) => [
          // signFor('coin.GAS'),
          signFor(`${config.contract}.GAS_PAYER`, account, { int: 1 }, 1),
          signFor(`${config.contract}.ENFORCE-CREATOR`),
          signFor("coin.TRANSFER", account, escrow, fee),
        ]
      )
      .addKeyset("ks", "keys-all", signerKey)
      .setMeta({
        chainId: String(chain),
        gasLimit: 4000,
        gasPrice: 1.0e-6,
        senderAccount: gpayer,
        ttl: 10 * 60, // 10 minutes
      })
      .setNetworkId(NETWORK_ID)
      .createTransaction();
  } else {
    transaction = Pact.builder
      .execution(
        Pact.modules[config.contract]["register"](
          name,
          account,
          readKeyset("ks"),
          wallets
        ),
        Pact.modules["coin"]["details"](account)
      )
      .addSigner(signerKey, (signFor) => [
        signFor("coin.GAS"),
        signFor("coin.TRANSFER", account, escrow, fee),
        signFor(`${config.contract}.ENFORCE-CREATOR`),
      ])
      .addKeyset("ks", "keys-all", signerKey)
      .setMeta({
        chainId: String(chain),
        gasLimit: 4000,
        gasPrice: 1.0e-6,
        sender: senderAccount,
        ttl: 10 * 60, // 10 minutes
      })
      .setNetworkId(NETWORK_ID)
      .createTransaction();
  }

  let signedTx;
  let cmd, sigs, outcomeHash;
  console.log("transaction", transaction);
  console.log("provider", provider);

  try {
    if (providerName === 'SPIREKEY') {
      const serializedTransaction = btoa(JSON.stringify(transaction));
      const returnUrl = window.location.href;
      window.location.href = `${config.spireKeyUrl}/sign?transaction=${encodeURIComponent(serializedTransaction)}&returnUrl=${encodeURIComponent(returnUrl)}`;
      return;
    } else {
      signedTx = await provider.quickSign(transaction, client, session);
    }

    if (provider.name === "wc") {
      cmd = signedTx.cmd;
      sigs = signedTx.sigs;
      outcomeHash = signedTx.hash;
    } else {
      let commandSigData = signedTx.responses[0].commandSigData;
      cmd = commandSigData.cmd;
      sigs = commandSigData.sigs;
      outcomeHash = signedTx.responses[0].outcome.hash;
    }

    const bodyPayload = {
      cmd,
      sigs,
      hash: outcomeHash,
    };

    const preflightResult = await jsclient.preflight(bodyPayload);
    if (preflightResult.result.status === "failure") {
      console.error(preflightResult.result.status);
      toast(preflightResult.result.status);
      toast(preflightResult.result.error.message);
      throw new Error("failure");
    } else {
      const transactionDescriptor = await jsclient.submit(bodyPayload);
      toast("TX Key: " + transactionDescriptor.requestKey);
      const result = await jsclient.listen(transactionDescriptor);
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

// export const register = async (
//   name,
//   amount,
//   wallets,
//   chain,
//   client,
//   session
// ) => {
//   // const jsclient = createClient(`${config.client}`);
//   const jsclient = createClient(
//     `${config.apiUrl}/chainweb/0.0/${config.networkId}/chain/${chain}/pact`
//   );
//   const NETWORK_ID = `${config.networkId}`;
//   const { account, pubKey } = useWalletStore.getState();
//   const providerName = useWalletStore.getState().provider;
//   console.log("providerName", providerName)
//   let provider = providers[providerName];

//   if (providerName === null) {
//     throw new Error("Provider not found");
//   }

//   const escrow = await getEscrow(name, account, chain);

//   const senderAccount = account;
//   const fee = { decimal: `${amount}` };
//   // const signerKey = account.split("k:")[1];
//   const signerKey = pubKey;
//   const transaction = Pact.builder
//     .execution(
//       Pact.modules[config.contract]["register"](
//         name,
//         account,
//         readKeyset("ks"),
//         wallets
//       ),
//       Pact.modules["coin"]["details"](account)
//       )
//       // .execution(Pact.modules["coin"]["details"](account)
//       // )
//     .addSigner(signerKey,  (signFor) => [
//       signFor("coin.GAS"),
//       signFor("coin.TRANSFER", account, escrow, fee),
//       signFor(`${config.contract}.ENFORCE-CREATOR`),
//     ])
//     .addKeyset("ks", "keys-all", signerKey)
//     .setMeta({
//       chainId: String(chain),
//       gasLimit: 4000,
//       gasPrice: 1.0e-6,
//       sender: senderAccount,
//       ttl: 10 * 60, // 10 minutes
//     })
//     .setNetworkId(NETWORK_ID)
//     .createTransaction();

//   let signedTx;
//   let cmd, sigs, outcomeHash;
//     console.log("transaction", transaction);
//   console.log("provider", provider);
//    try {
//     if (providerName === 'SPIREKEY') {
//       // Serialize and encode the transaction data per SpireKey's requirements
//       const serializedTransaction = btoa(JSON.stringify(transaction));
//       const returnUrl = window.location.href; // Maybe it's time to add react-router or ninja trick it into read on return
    
//       // Redirects to SpireKey for signing
//       window.location.href = `${config.spireKeyUrl}/sign?transaction=${encodeURIComponent(serializedTransaction)}&returnUrl=${encodeURIComponent(returnUrl)}`;
//       return; 
//     } else {
//     signedTx = await provider.quickSign(transaction, client, session);
//     // signedTx = await signWithChainweaver(transaction);
//     } if (provider.name === "wc") {
//       // If the provider is 'WC', use the cmd, sigs, and hash directly from signedTx
//       cmd = signedTx.cmd;
//       sigs = signedTx.sigs;
//       outcomeHash = signedTx.hash;
//     } else {
//       // For other providers, extract from commandSigData
//       let commandSigData = signedTx.responses[0].commandSigData;
//       cmd = commandSigData.cmd;
//       sigs = commandSigData.sigs;
//       outcomeHash = signedTx.responses[0].outcome.hash;
//     }

//     const bodyPayload = {
//       cmd,
//       sigs,
//       hash: outcomeHash,
//     };
    
//     // Proceed with dirtyRead and submit using bodyPayload
//     const preflightResult = await jsclient.preflight(bodyPayload);
    
//     if (preflightResult.result.status === "failure") {
//       console.error(preflightResult.result.status);
//       toast(preflightResult.result.status);
//       toast(preflightResult.result.error.message);
//       throw new Error("failure");
//     } else {
//       const transactionDescriptor = await jsclient.submit(bodyPayload);
//       toast("TX Key: " + transactionDescriptor.requestKey);
//       const result = await jsclient.listen(transactionDescriptor);
//       return result;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

export const getEscrow = async (name, account, chain) => {
  const NETWORK_ID = `${config.networkId}`;
  // const guard = account.split("k:")[1];
  const guard = useWalletStore.getState().pubKey;
  console.log("guard", guard);
  // const jsclient = createClient(`${config.client}`);
  const jsclient = createClient(
    `${config.apiUrl}/chainweb/0.0/${NETWORK_ID}/chain/${chain}/pact`
  );

  const unsignedTransaction = Pact.builder
    .execution(
      `(let ((id(${config.contract}.create-name-id "${name}" (read-keyset 'ks) 0)))
    (${config.contract}.escrow id))`
    )
    .setMeta({
      chainId: String(chain),
      senderAccount: account,
      gasLimit: 4500,
    })
    .addKeyset("ks", "keys-all", guard)
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  try {
    const result = await jsclient.dirtyRead(unsignedTransaction);
    if (result.result?.data) {
      return result.result.data;
    } else {
      console.log("No data returned:", result);
    }
  } catch (error) {
    console.error("Error with dirtyRead or data processing:", error);
  }
};

export const submitSignedTransaction = async (signedTransaction, chain) => {
  console.log("inside submitSignedTransaction")
  const jsclient = createClient(
    `${config.apiUrl}/chainweb/0.0/${config.networkId}/chain/${chain}/pact`
  );
  console.log("signedTransaction", signedTransaction);
  try {
    const bodyPayload = {
      cmd: signedTransaction.cmd,
      sigs: signedTransaction.sigs,
      hash: signedTransaction.hash,
    };
    // const transactionDescriptor = await jsclient.submit(bodyPayload);
    // console.log("transactionDescriptor", transactionDescriptor);
    const preflightResult = await jsclient.dirtyRead(bodyPayload);
    console.log("preflightResult", preflightResult)
    if (preflightResult.result.status === "failure") {
      console.error(preflightResult);
      toast(preflightResult.result.status);
      toast(preflightResult.result.error.message);
      throw new Error("Preflight failure");
    } else {
      const transactionDescriptor = await jsclient.submit(bodyPayload);
      toast("TX Key: " + transactionDescriptor.requestKey);
      const result = await jsclient.listen(transactionDescriptor);
      return result;
    }
  } catch (error) {
    console.error(error);
    toast(error.message);
  }
};


export const getDomains = async (account) => {
  let domains = [];
  const NETWORK_ID = config.networkId;
  for (let bchain = 0; bchain < 20; bchain++) {
    const unsignedTransaction = Pact.builder
      .execution(`(${config.contract}.get)`)
      .setMeta({
        chainId: String(bchain),
        senderAccount: account,
        gasLimit: 100000,
      })
      .setNetworkId(NETWORK_ID)
      .createTransaction();

    try {
      const dclient = createClient(
        `${config.apiUrl}/chainweb/0.0/${NETWORK_ID}/chain/${bchain}/pact`
      );
      const result = await dclient.dirtyRead(unsignedTransaction);

      if (result.result?.data) {
        domains = domains.concat(result.result.data);
      } else {
        console.log(`No data returned for chain ${bchain}:`, result);
      }
    } catch (error) {
      console.error(
        `Error with dirtyRead or data processing on chain ${bchain}:`,
        error
      );
    }
  }

  return domains;
};

export const withdrawal = async (
  account,
  id,
  pactId,
  fee,
  chain,
  client,
  session
) => {
  const NETWORK_ID = `${config.networkId}`;
  const jsclient = createClient(
    `${config.apiUrl}/chainweb/0.0/${NETWORK_ID}/chain/${chain}/pact`
  );
  const providerName = useWalletStore.getState().provider;
  let provider = providers[providerName];
  const signerKey = account.split("k:")[1];
  const pactEnvData = {
    id: id,
  };
  const transaction = Pact.builder
    .continuation({
      pactId: pactId,
      data: pactEnvData,
      proof: null,
      rollback: true,
      step: 0,
    })
    .addKeyset("ks", "keys-all", signerKey)
    .addSigner(signerKey, (signFor) => [
      signFor("coin.GAS"),
      signFor(
        `${config.contract}.WITHDRAW`,
        id,
        account,
        { decimal: `${fee}` },
        pactId
      ),
    ])
    .setMeta({
      chainId: String(chain),
      gasLimit: 4000,
      gasPrice: 1.0e-6,
      sender: account,
      ttl: 10 * 60,
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();
  let signedTx;
  let cmd, sigs, outcomeHash;

  try {
    signedTx = await provider.quickSignCont(transaction, client, session);

    if (provider.name === "wc") {
      // If the provider is 'WC', use the cmd, sigs, and hash directly from signedTx
      cmd = signedTx.cmd;
      sigs = signedTx.sigs;
      outcomeHash = signedTx.hash;
    } else {
      // For other providers, we extract from commandSigData
      let commandSigData = signedTx.responses[0].commandSigData;
      cmd = commandSigData.cmd;
      sigs = commandSigData.sigs;
      outcomeHash = signedTx.responses[0].outcome.hash;
    }

    const bodyPayload = {
      cmd,
      sigs,
      hash: outcomeHash,
    };
    const preflightResult = await jsclient.preflight(bodyPayload);

    if (preflightResult.result.status === "failure") {
      console.error(preflightResult.result.status);
      toast(preflightResult.result.status);
      toast(preflightResult.result.error.message);
      throw new Error("failure");
    } else {
      const transactionDescriptor = await jsclient.submit(bodyPayload);
      toast("TX Key: " + transactionDescriptor.requestKey);
      const result = await jsclient.listen(transactionDescriptor);
      // toast("TX Status: " + result.result.status);
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateWallet = async (id, wallets, chain, client, session) => {
  const NETWORK_ID = `${config.networkId}`;
  const jsclient = createClient(
    `${config.apiUrl}/chainweb/0.0/${NETWORK_ID}/chain/${chain}/pact`
  );
  const { account } = useWalletStore.getState();
  const providerName = useWalletStore.getState().provider;
  let provider = providers[providerName];

  const senderAccount = account;
  const signerKey = account.split("k:")[1];
  const transaction = Pact.builder
    .execution(Pact.modules[config.contract]["update-wallets"](id, wallets))
    .addSigner(signerKey, (signFor) => [
      signFor("coin.GAS"),
      signFor(`${config.contract}.WALLET`, id),
    ])
    .setMeta({
      chainId: String(chain),
      gasLimit: 4000,
      gasPrice: 1.0e-6,
      sender: senderAccount,
      ttl: 10 * 60,
    })
    // .setNetworkId(NETWORK_ID)
    .createTransaction();
  //   const signedTx = await signWithChainweaver(transaction);
  let signedTx;
  let cmd, sigs, outcomeHash;

  try {
    signedTx = await provider.sign(transaction, client, session);
    if (provider.name === "wc") {
      // If the provider is 'WC', use the cmd, sigs, and hash directly from signedTx
      cmd = signedTx.cmd;
      sigs = signedTx.sigs;
      outcomeHash = signedTx.hash;
    } else {
      // For other providers, extract from commandSigData
      cmd = signedTx.signedCmd.cmd;
      sigs = signedTx.signedCmd.sigs;
      outcomeHash = signedTx.signedCmd.hash;
    }
  } catch (error) {
    console.error(error);
  }

  const bodyPayload = {
    cmd,
    sigs,
    hash: outcomeHash,
  };
  const preflightResult = await jsclient.dirtyRead(bodyPayload);

  if (preflightResult.result.status === "failure") {
    console.error(preflightResult.result.status);
    toast(preflightResult.result.status);
    toast(preflightResult.result.error.message);
    throw new Error("failure");
  } else {
    const transactionDescriptor = await jsclient.submit(bodyPayload);
    toast("TX Key: " + transactionDescriptor.requestKey);
    const result = await jsclient.listen(transactionDescriptor);
    toast("TX Status: " + result.result.status);
  }
};

export const getBalance = async (chain) => {
  const { account } = useWalletStore.getState();
  const NETWORK_ID = `${config.networkId}`;
  const jsclient = createClient(
    `${config.apiUrl}/chainweb/0.0/${NETWORK_ID}/chain/${chain}/pact`
  );
  const unsignedTransaction = Pact.builder
    .execution(
      `(coin.get-balance "${account}")`
    )
    .setMeta({
      chainId: String(chain),
      senderAccount: account,
      gasLimit: 1500,
      gasPrice: 1.0e-6,
      ttl: 10 * 60,
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();
 console.log("unsignedTransaction", unsignedTransaction)
  try {
    const result = await jsclient.dirtyRead(unsignedTransaction);
    console.log("result for balance", result)
    if (result.result?.data) {
      return result.result.data;
    } else {
      console.log("No data returned:", result);
    }
  } catch (error) {
    console.error("Error with dirtyRead or data processing:", error);
  }

}



export const copyAccount = async (
  initChain,
  toChain
) => {
  // const jsclient = createClient(`${config.client}`);
  const jsclient = createClient(
    `${config.apiUrl}/chainweb/0.0/${config.networkId}/chain/${initChain}/pact`
  );
  const NETWORK_ID = `${config.networkId}`;
  const { account, pubKey } = useWalletStore.getState();
  const providerName = useWalletStore.getState().provider;
  console.log("providerName", providerName)
  let provider = providers[providerName];
    const ac = "w:LoIIIlGGy5N75v7quY7PThxMjg-K5DQzbzQ5EZQqtM0:keys-any";
  if (providerName === null) {
    throw new Error("Provider not found");
  }

    const senderAccount = account;
  // const signerKey = account.split("k:")[1];
  const signerKey = pubKey;
  const transaction = Pact.builder
    .execution(
      Pact.modules[config.spireContract]["copy-account"](
        account,
        String(toChain)       
      )
    )
    .addSigner(
      {
        pubKey: signerKey,
        scheme: 'WebAuthn',
      },  
      (signFor) => [
      signFor(`${config.spireContract}.GAS_PAYER`, account, {int: 1}, 1),
      signFor(`${config.spireContract}.COPY_ACCOUNT`, account),
      // signFor("n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-guard.COPY_ACCOUNT", account),
    ])
    .setMeta({
      chainId: String(initChain),
      gasLimit: 4000,
      gasPrice: 1.0e-6,
      senderAccount: senderAccount,
      ttl: 100 * 600, // 100 minutes
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  let signedTx;
  let cmd, sigs, outcomeHash;
    console.log("transaction", transaction);
  console.log("provider", provider);
   try {
    if (providerName === 'SPIREKEY') {
      // Serialize and encode the transaction data per SpireKey's requirements
      const serializedTransaction = btoa(JSON.stringify(transaction));
      const returnUrl = window.location.href; // Maybe it's time to add react-router or ninja trick it into read on return
    
      // Redirects to SpireKey for signing
      window.location.href = `${config.spireKeyUrl}/sign?transaction=${encodeURIComponent(serializedTransaction)}&returnUrl=${encodeURIComponent(returnUrl)}`;
      return; 
    } else {
    signedTx = await provider.quickSign(transaction);
    // signedTx = await signWithChainweaver(transaction);
    } if (provider.name === "wc") {
      // If the provider is 'WC', use the cmd, sigs, and hash directly from signedTx
      cmd = signedTx.cmd;
      sigs = signedTx.sigs;
      outcomeHash = signedTx.hash;
    } else {
      console.log("command else")
      // For other providers, extract from commandSigData
      let commandSigData = signedTx.responses[0].commandSigData;
      cmd = commandSigData.cmd;
      sigs = commandSigData.sigs;
      outcomeHash = signedTx.responses[0].outcome.hash;
    }

    const bodyPayload = {
      cmd,
      sigs,
      hash: outcomeHash,
    };
    
    // Proceed with dirtyRead and submit using bodyPayload
    const preflightResult = await jsclient.dirtyRead(bodyPayload);
    
    if (preflightResult.result.status === "failure") {
      console.error(preflightResult.result.status);
      toast(preflightResult.result.status);
      toast(preflightResult.result.error.message);
      throw new Error("failure");
    } else {
      const transactionDescriptor = await jsclient.submit(bodyPayload);
      toast("TX Key: " + transactionDescriptor.requestKey);
      const result = await jsclient.listen(transactionDescriptor);
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

// export const continuation = async (fromChain, toChain, requestKey) => {
//   const jsclient = createClient(
//     `${config.apiUrl}/chainweb/0.0/${config.networkId}/chain/${toChain}/pact`
//   );
//   const NETWORK_ID = `${config.networkId}`;
//   const { account, pubKey } = useWalletStore.getState();
//   const providerName = useWalletStore.getState().provider;
//   console.log("providerName", pubKey);
//   let provider = providers[providerName];

//   if (providerName === null) {
//     throw new Error("Provider not found");
//   }

//   const gpayer = "u:n_eef68e581f767dd66c4d4c39ed922be944ede505.gas-station.enforce-guard-any:dorjIaX8IGJZtfgZzYRkXV0DE9mEPxPvyuwdmML5eTk";
//   const senderAccount = account;
//   const signerKey = pubKey;

//   // Call the spv function to get the proof
//   const proof = await spv(requestKey, fromChain, toChain);
//  console.log("proof", proof)
//   const transaction = Pact.builder
//     .continuation({
//       pactId: requestKey,
//       step: 1,
//       rollback: false,
//       data: {},
//       proof: proof,
//     })
//     .addSigner(
//       {
//         pubKey: pubKey,
//         scheme: 'WebAuthn',
//       },
//       (signFor) => [
//         signFor(`n_eef68e581f767dd66c4d4c39ed922be944ede505.gas-station.GAS_PAYER`, gpayer, { int: 1 }, 1),
//       ]
//     )
//     .addKeyset("ks", "keys-all", pubKey)
//     .setMeta({
//       chainId: String(toChain),
//       gasLimit: 2500,
//       gasPrice: 0.0000001,
//       sender: gpayer,
//       ttl: 100 * 600, // 100 minutes
//     })
//     .setNetworkId(NETWORK_ID)
//     .createTransaction();

//   let signedTx;
//   let cmd, sigs, outcomeHash;
//   console.log("transaction", transaction);

//   try {
//     if (providerName === 'SPIREKEY') {
//       const serializedTransaction = btoa(JSON.stringify(transaction));
//       const returnUrl = window.location.href;
//       window.location.href = `${config.spireKeyUrl}/sign?transaction=${encodeURIComponent(serializedTransaction)}&returnUrl=${encodeURIComponent(returnUrl)}`;
//       return;
//     } else {
//       signedTx = await provider.quickSignCont(transaction);
//       console.log('Signed transaction:', JSON.stringify(signedTx));
//     }
//   } catch (error) {
//     console.error('Error signing transaction:', error);
//     return;
//   }

//   let commandSigData = signedTx.responses[0].commandSigData;
//   cmd = commandSigData.cmd;
//   sigs = commandSigData.sigs;
//   outcomeHash = signedTx.responses[0].outcome.hash;

//   const bodyPayload = {
//     cmd,
//     sigs,
//     hash: outcomeHash,
//   };

//   const preflightResult = await jsclient.preflight(bodyPayload);
//   console.log(preflightResult);

//   if (preflightResult.result.status === "failure") {
//     console.error(preflightResult.result.status);
//     throw new Error("failure");
//   }

//   console.log("preflight successful");
// };

// async function spv(requestKey, fromChain, toChain) {
//   console.log("spv function", requestKey, fromChain, toChain)
//   const proofClient = createClient(
//     `${config.apiUrl}/chainweb/0.0/${config.networkId}/chain/${fromChain}/pact`
//   );
//   const proof = await proofClient.pollCreateSpv(
//     {
//       requestKey: requestKey,
//       networkId: 'testnet04',
//       chainId: fromChain,
//     },
//     toChain
//   );
//   console.log("proof", proof)
//   return proof;
// }

export const continuation = async (fromChain, toChain, requestKey) => {
  const jsclient = createClient(
    `${config.apiUrl}/chainweb/0.0/${config.networkId}/chain/${toChain}/pact`
  );
  const NETWORK_ID = `${config.networkId}`;
  const { account, pubKey } = useWalletStore.getState();
  const providerName = useWalletStore.getState().provider;
  console.log("providerName", pubKey);
  let provider = providers[providerName];

  if (providerName === null) {
    throw new Error("Provider not found");
  }

  const gpayer = "u:n_eef68e581f767dd66c4d4c39ed922be944ede505.gas-station.enforce-guard-any:dorjIaX8IGJZtfgZzYRkXV0DE9mEPxPvyuwdmML5eTk";
  const senderAccount = account;
  const signerKey = pubKey;

  // Call the spv function to get the proof
  const proof = await spv(requestKey, fromChain, toChain);
  console.log("proof", proof);

  // Await the continuation process
  await continuationProcess(proof, pubKey, gpayer, toChain, NETWORK_ID, jsclient, provider, providerName, requestKey);
};

async function continuationProcess(proof, pubKey, gpayer, toChain, NETWORK_ID, jsclient, provider, providerName, requestKey) {
  const transaction = Pact.builder
    .continuation({
      pactId: requestKey,
      step: 1,
      rollback: false,
      data: {},
      proof: proof,
    })
    .addSigner(
      {
        pubKey: pubKey,
        scheme: 'WebAuthn',
      },
      (signFor) => [
        signFor(`n_eef68e581f767dd66c4d4c39ed922be944ede505.gas-station.GAS_PAYER`, gpayer, { int: 1 }, 1),
      ]
    )
    .addKeyset("ks", "keys-all", pubKey)
    .setMeta({
      chainId: String(toChain),
      gasLimit: 2500,
      gasPrice: 0.0000001,
      sender: gpayer,
      ttl: 100 * 600, // 100 minutes
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  let signedTx;
  let cmd, sigs, outcomeHash;
  console.log("transaction", transaction);

  try {
    if (providerName === 'SPIREKEY') {
      const serializedTransaction = btoa(JSON.stringify(transaction));
      const returnUrl = window.location.href;
      window.location.href = `${config.spireKeyUrl}/sign?transaction=${encodeURIComponent(serializedTransaction)}&returnUrl=${encodeURIComponent(returnUrl)}`;
      return;
    } else {
      signedTx = await provider.quickSignCont(transaction);
      console.log('Signed transaction:', JSON.stringify(signedTx));
    }
  } catch (error) {
    console.error('Error signing transaction:', error);
    return;
  }

  let commandSigData = signedTx.responses[0].commandSigData;
  cmd = commandSigData.cmd;
  sigs = commandSigData.sigs;
  outcomeHash = signedTx.responses[0].outcome.hash;

  const bodyPayload = {
    cmd,
    sigs,
    hash: outcomeHash,
  };

  const preflightResult = await jsclient.preflight(bodyPayload);
  console.log(preflightResult);

  if (preflightResult.result.status === "failure") {
    console.error(preflightResult.result.status);
    throw new Error("failure");
  }

  console.log("preflight successful");
}

async function spv(requestKey, fromChain, toChain) {
  console.log("spv function", requestKey, fromChain, toChain);
  const proofClient = createClient(
    `${config.apiUrl}/chainweb/0.0/${config.networkId}/chain/${fromChain}/pact`
  );
  const proof = await proofClient.pollCreateSpv(
    {
      requestKey: requestKey,
      networkId: 'testnet04',
      chainId: fromChain,
    },
    toChain
  );
  console.log("proof", proof);
  return proof;
}