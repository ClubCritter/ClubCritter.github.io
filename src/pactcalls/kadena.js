import { Pact, createClient } from '@kadena/client';
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
    const tx = Pact.builder
     .execution(code)
     .addData("token", token)
     .addSigner(pubKey, (signFor) => [
      signFor('coin.TRANSFER', sender, receiver, Number(amount)),
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

export const airdropCoins = async (code, chain, quickSign, pubKey, sender, receivers, amount) => {
  try {
    const pactClient = createClient(`${api}/chainweb/0.0/${network}/chain/${chain}/pact`);
    const env = {
      "sender": sender,
      "receivers": receivers,
      "amount": amount
    }
    const tx = Pact.builder
     .execution(code)
     .addData("sender", env.sender)
     .addData("receivers", env.receivers)
     .addData("amount", env.amount)
     .addSigner(pubKey, (signFor) => [
        signFor('coin.TRANSFER', env.sender, 'u:ns.success:DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g', env.receivers.length * env.amount),
        signFor('coin.GAS'),
      ])
     .setMeta({
        chainId: String(chain),
        gasLimit: 2000,
        gasPrice: 0.0000001,
        sender: env.sender
      })
     .addKeyset('ks', 'keys-all', pubKey)
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