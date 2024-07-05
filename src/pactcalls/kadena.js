import { Pact, createClient } from '@kadena/client';
import { createTokenId } from '@kadena/client-utils/marmalade'
import config from '../wallet/chainconfig';

const network = config.networkId;
const api = config.apiUrl;


export const fetchBalance = async( code , chain ) => {
    const pactClient = createClient(`${api}/chainweb/0.0/${network}/chain/${chain}/pact`)
    
    const tx = Pact.builder
                 .execution(code)
                 .setMeta({
                    chainId: String(chain),
                    gasLimit: 1000,
                    gasPrice: 0.0000001,
                 })
                 .setNetworkId(network)
                 .createTransaction();
                 
    try{
        const res = await pactClient.dirtyRead(tx)
        return res.result.data;
    } catch {
        console.error('Error fetching account details:', error)

        return null;
    }
}


export const transferCoin = async (token, code, chain, quickSign, pubKey, sender, receiver, amount) => {
  try {
    const pactClient = createClient(`${api}/chainweb/0.0/${network}/chain/${chain}/pact`);
    const recPubKey = receiver.slice(2, 66)
    const tx = Pact.builder
     .execution(code)
     .addData("ac-keyset", { "keys": [ recPubKey ], "pred": "keys-all" })
     .addSigner(pubKey, (signFor) => [
      signFor(`${token}.TRANSFER`, sender, receiver, Number(amount)),
        signFor('coin.GAS'),
      ])
     .setMeta({
        chainId: String(chain),
        gasLimit: 1000,
        gasPrice: 0.0000001,
        sender: sender
      })
     .addKeyset('ks', 'keys-all', pubKey)
     .setNetworkId(network)
     .createTransaction();
    let signedTx;
    signedTx = await quickSign(tx);
    if (!signedTx ||!signedTx.responses ||!signedTx.responses[0]) {
      console.error('Error signing transaction:', signedTx);
      return;
    }
    console.log(signedTx.responses[0]);
    let commandSigData = signedTx.responses[0].commandSigData;
    const cmd = commandSigData.cmd;
    const sigs = commandSigData.sigs;
    const outcomeHash = signedTx.responses[0].outcome.hash;
    const preflightResult = await pactClient.preflight({cmd, sigs, hash: outcomeHash});
    console.log(preflightResult)
    if (preflightResult.result.status === 'failure') {
      console.error(preflightResult.result.error.message);
      return preflightResult;
    } else {
      const transactionDescriptor = await pactClient.submit({cmd, sigs, hash: outcomeHash});
      console.log('TX Key: ', transactionDescriptor.requestKey);
      return { pactClient, transactionDescriptor, preflightResult };
    }
  } catch (error) {
    console.error(error);
  }
};

export const airdropCoins = async (token, code, chain, quickSign, pubKey, sender, receivers, amount) => {
  try {
    const pactClient = createClient(`${api}/chainweb/0.0/${network}/chain/${chain}/pact`);
    const env = {
      "sender": sender,
      "receivers": receivers,
      "amount": Number(amount)
    }
    console.log(env)
    let tx = Pact.builder
     .execution(code)
     .addData("sender", env.sender)
     .addData("receivers", env.receivers)
     .addData("amount", env.amount)
     .addSigner(pubKey, (signFor) => [
        signFor(`${token}.TRANSFER`, env.sender, 'u:ns.success:DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g', env.receivers.length * env.amount),
        signFor('coin.GAS'),
      ])
     .setMeta({
        chainId: String(chain),
        gasLimit: 10000,
        gasPrice: 0.0000001,
        sender: env.sender
      })
     .addKeyset('ks', 'keys-all', pubKey)
     .setNetworkId(network)

     for (let i = 0; i < env.receivers.length; i++) {
      const receiverPubKey = env.receivers[i].slice(2, 66);
      tx = tx.addKeyset(env.receivers[i], 'keys-all', receiverPubKey);
    }
    tx = tx.createTransaction();

    let signedTx;
    signedTx = await quickSign(tx);
    console.log(signedTx)
    if (!signedTx ||!signedTx.responses ||!signedTx.responses[0]) {
      console.error('Error signing transaction:', signedTx);
      return;
    }
    console.log(signedTx.responses[0]);
    let commandSigData = signedTx.responses[0].commandSigData;
    const cmd = commandSigData.cmd;
    const sigs = commandSigData.sigs;
    const outcomeHash = signedTx.responses[0].outcome.hash;
    const preflightResult = await pactClient.preflight({ cmd, sigs, hash: outcomeHash });
    console.log(preflightResult)
    if (preflightResult.result.status === 'failure') {
      console.error(preflightResult.result.error.message);
      return preflightResult;
    } else {
      const transactionDescriptor = await pactClient.submit({ cmd, sigs, hash: outcomeHash });
      console.log('TX Key: ', transactionDescriptor.requestKey);
      return { pactClient, transactionDescriptor, preflightResult };
    }
  } catch (error) {
    console.error(error);
  }
};

export const multiTransfer = async (token, code, chain, quickSign, pubKey, sender, receivers, amounts) => {
  try {
    const pactClient = createClient(`${api}/chainweb/0.0/${network}/chain/${chain}/pact`);
    const env = {
      "sender": sender,
      "receivers": receivers,
      "amounts": amounts
    }
    let totalAmount = 0;
    
    env.amounts.forEach(
      (amount) => {
        const newAmount = totalAmount + parseFloat(amount)
        totalAmount = newAmount;
      }
    )
    
    console.log(totalAmount)
    let tx = Pact.builder
     .execution(code)
     .addData("sender", env.sender)
     .addData("receivers", env.receivers)
     .addData("amounts", env.amounts)
     .addSigner(pubKey, (signFor) => [
        signFor(`${token}.TRANSFER`, env.sender, 'u:ns.success:DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g', totalAmount),
        signFor('coin.GAS'),
      ])
     .setMeta({
        chainId: String(chain),
        gasLimit: 10000,
        gasPrice: 0.0000001,
        sender: env.sender
      })
     .addKeyset('ks', 'keys-all', pubKey)
     .setNetworkId(network)

     for (let i = 0; i < env.receivers.length; i++) {
      const receiverPubKey = env.receivers[i].slice(2, 66);
      tx = tx.addKeyset(env.receivers[i], 'keys-all', receiverPubKey);
    }
    tx = tx.createTransaction();

    let signedTx;
    signedTx = await quickSign(tx);
    console.log(signedTx)
    if (!signedTx ||!signedTx.responses ||!signedTx.responses[0]) {
      console.error('Error signing transaction:', signedTx);
      return;
    }
    console.log(signedTx.responses[0]);
    let commandSigData = signedTx.responses[0].commandSigData;
    const cmd = commandSigData.cmd;
    const sigs = commandSigData.sigs;
    const outcomeHash = signedTx.responses[0].outcome.hash;
    const preflightResult = await pactClient.preflight({ cmd, sigs, hash: outcomeHash });
    console.log(preflightResult)
    if (preflightResult.result.status === 'failure') {
      console.error(preflightResult.result.error.message);
      return preflightResult;
    } else {
      const transactionDescriptor = await pactClient.submit({ cmd, sigs, hash: outcomeHash });
      console.log('TX Key: ', transactionDescriptor.requestKey);
      return { pactClient, transactionDescriptor, preflightResult };
    }
  } catch (error) {
    console.error(error);
  }
};
export const nftMinting = async (sender, receiver, uri, code, chain, quickSign, pubKey, precision) => {
  try {
    const pactClient = createClient(`${api}/chainweb/0.0/${network}/chain/${chain}/pact`);
    
  // const tokenId = await createTokenId({
  //     uri: String(uri),
  //     precision: { int: precision },
  //     policies: [`marmalade-v2.non-fungible-policy-v1`, `marmalade-v2.guard-policy-v1`],
  //     creator: {
  //       keyset: {
  //         keys: [String(pubKey)],
  //         pred: 'keys-all'
  //       }
  //     },
  //     chainId: chain,
  //     networkId: network,
  //     host: api
  //   });

    const env = {
      "sender": sender,
      "mintToAc": receiver,
      "uri": uri,
      "precision": parseFloat(precision),
      "tokenId": "t:Wf-PmibrCT8HJDAPYdgayZy5bka9PkmXWbJz9rpv8f0",
      "mta": true
    }

    let tx = Pact.builder
     .execution(code)
     .addData("sender", env.sender)
     .addData("mintToAc", env.mintToAc)
     .addData("precision", env.precision)
     .addData("uri", env.uri)
     .addData("pubKey", pubKey)
     .addData("tokenId", env.tokenId)
     .addData("chain", chain)
     .addSigner(pubKey, (signFor) => [
        signFor('marmalade-v2.ledger.MINT', env.tokenId, sender , Number(chain)),
        signFor('marmalade-v2.ledger.CREATE-TOKEN', env.tokenId, {"keys": [pubKey], pred: "keys-all"}),
        signFor('coin.GAS'),
      ])
     .setMeta({
        chainId: String(chain),
        gasLimit: 10000,
        gasPrice: 0.0000001,
        sender: sender
      })
     .addKeyset('ks', 'keys-all', pubKey)
     .addKeyset('mintTo', 'keys-all', env.mintToAc.slice(2, 66))
    //  .addKeyset('tks', 'keys-all', env.mintToAc.slice(2, 66))
     .setNetworkId(network)
     .createTransaction();

    let signedTx;
    signedTx = await quickSign(tx);
    console.log(signedTx)
    if (!signedTx ||!signedTx.responses ||!signedTx.responses[0]) {
      console.error('Error signing transaction:', signedTx);
      return;
    }
    console.log(signedTx.responses[0]);
    let commandSigData = signedTx.responses[0].commandSigData;
    const cmd = commandSigData.cmd;
    const sigs = commandSigData.sigs;
    const outcomeHash = signedTx.responses[0].outcome.hash;
    const preflightResult = await pactClient.preflight({ cmd, sigs, hash: outcomeHash });
    console.log(preflightResult)
    if (preflightResult.result.status === 'failure') {
      console.error(preflightResult.result.error.message);
      return preflightResult;
    } else {
      const transactionDescriptor = await pactClient.submit({ cmd, sigs, hash: outcomeHash });
      console.log('TX Key: ', transactionDescriptor.requestKey);
      return { pactClient, transactionDescriptor, preflightResult };
    }
  } catch (error) {
    console.error(error);
  }
};