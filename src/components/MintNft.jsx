import React, { useEffect, useState } from 'react'
import SelectChain from './SelectChain'
import useTokenStore from '../store/tokenStore'
// import { createTokenIdFromKey } from '../pactcalls/tokenIdGenerate'
import { toast } from 'react-toastify'
import { pactCalls } from '../pactcalls/kadena'
import useWalletStore from '../wallet/walletStore'
import paste from '../assets/img/paste.svg'

const MintNft = ({ mintNft}) => {
  const { chainId } = useTokenStore()
  const [receiver, setReceiver] = useState('')
  const [uri, setUri] = useState('')
  const [policies, setPolicies] = useState('DEFAULT')
  const [tokenId, setTokenId] = useState('')
  const [debouncedUri, setDebouncedUri] = useState(uri);
  const [debouncedPolicies, setDebouncedPolicies] = useState(policies);
  const [reqKey, setReqKey] = useState('')
  const pubKey = useWalletStore.getState().pubKey
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUri(uri);
      setDebouncedPolicies(policies);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [uri, policies]);


  useEffect(() => {
    const generateTokenId = async () => {
      if (!debouncedUri) return;
      const precision = 0;
      const code = `(use marmalade-v2.ledger)
                    (use marmalade-v2.util-v1)
      (create-token-id { 
                    'precision: ${precision}, 
                    'policies: (create-policies ${debouncedPolicies}), 
                    'uri: "${debouncedUri}"
                    } 
                    (read-keyset 'ks))`;

      try {
        const generatedTokenId = await pactCalls(
          code,
          chainId,
          pubKey
        );
        setTokenId(generatedTokenId);
      } catch (error) {
        console.error("Error generating token ID:", error);
      }
    };

    generateTokenId();
  }, [debouncedUri, debouncedPolicies, tokenId]);

  useEffect(() =>{
    setReceiver(getAccount())
  }, [])
  const handleMintNft = async() => {
    try{
      const {key, status} = await mintNft( chainId, receiver, debouncedUri, tokenId )
      setReqKey(key)
      setReceiver('')
      setUri('')
      toast.success("Nft Minted!", {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
      toast.success(`Request Key: ${key}`, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
       })
      console.log(key)
      console.log(status)
    } catch (err){
      console.log('error', err)
    }
  }

  const handlePasteReceiver = async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log(text)
      setReceiver(text);
    } catch (error) {
      console.error('Error reading from clipboard:', error);
    }
  };
  const handlePasteUri = async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log(text)
      setUri(text);
    } catch (error) {
      console.error('Error reading from clipboard:', error);
    }
  };
  const explorerLink = `https://explorer.chainweb.com/testnet/tx/${reqKey}`
  return (
    <div className='mint-nft my-5'>
      <div className='container'>
         <label>Chain ID</label>
         <SelectChain />
         <div className='nft-receiver'>
           <label>File Url</label>
           <input type='text' placeholder='https:// or ipfs:// link' 
              value={uri !== '' ? uri : ''}
              onChange={(e) => {setUri(e.target.value)
                                setReqKey('')
                                }} />
            <button>
            <img src={paste} alt='paste' onClick={handlePasteUri} />
            </button>
         </div>
         
       {/* <label>Total Supply</label>
       <input type='text' placeholder='Total Supply' 
              onChange={(e) => setTotalSupply(e.target.value)} /> */}
        <div className='nft-receiver'>
          <label>Receiver's address</label>
          <input type="text" placeholder='receiver k: address'
              value={receiver}
              onChange={(e) => {setReceiver(e.target.value)
                                setReqKey('')
                                }} 
              disabled/>
           <button>
            <img src={paste} alt='paste' onClick={handlePasteReceiver} />
           </button>
        </div>
       
              {tokenId &&
              <div className='mt-3'>
               <h4>token id</h4>
               <p style={{wordBreak: "break-all"}}>{tokenId}</p>
              </div>
              }
              { reqKey &&
                 <div className='mt-3'>
                   <h4>req key</h4>
                   <p style={{wordBreak: "break-all"}}>{reqKey}</p>
                   <h6>Check this tranasaction on <a href={explorerLink} target='_blank' className='link-a'>Chainweb Explorer</a></h6>
                 </div>
               }
        <button className='btn  btn-secondary mt-4'
                onClick={handleMintNft}>Mint Nft</button>
      </div>
    </div>
  )
}

export default MintNft