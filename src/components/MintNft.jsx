import React, { useState } from 'react'
import SelectChain from './SelectChain'
import useTokenStore from '../store/tokenStore'
import { createTokenIdFromKey } from '../pactcalls/tokenIdGenerate'
import { toast } from 'react-toastify'



const MintNft = ({ mintNft}) => {
  const { chainId } = useTokenStore()
  const [ totalSupply, setTotalSupply ] = useState(1.0)
  const [ receiver, setReceiver ] = useState('')
  const [ uri, setUri ] = useState('')
  
  
  const handleMintNft = async() => {
    try{
      const {key, status} = await mintNft( totalSupply, chainId, receiver, uri )
      toast.success("Nft Minted!")
      console.log(key)
      console.log(status)
    } catch (err){
      console.log('error', err)
    }
  }

  return (
    <div className='mint-nft'>
       <label>Chain ID</label>
       <SelectChain />
       <label>File Url</label>
       <input type='text' placeholder='https:// or ipfs:// link' 
              onChange={(e) => setUri(e.target.value)} />
       <label>Total Supply</label>
       <input type='text' placeholder='Total Supply' 
              onChange={(e) => setTotalSupply(e.target.value)} />
       <label>Receiver's address</label>
       <input type="text" placeholder='receiver k: address'
              onChange={(e) => setReceiver(e.target.value)} />
       <button className='btn btn-secondary'
        onClick={handleMintNft}>Mint Nft</button>
    </div>
  )
}

export default MintNft