import React from 'react'
import SelectChain from './SelectChain'


const MintNft = ({mintNft}) => {
  

  const handleMintNft = async() => {
    const {key, status} = await mintNft(tokenId, totalSupply, chain, receiver, uri)
    console.log(key)
  }

  return (
    <div className='mint-nft'>
       <label>Chain ID</label>
       <SelectChain />
       <label>File Url</label>
       <input type='text' placeholder='https:// or ipfs:// link' />
       <label>Total Supply</label>
       <input type='text' placeholder='Total Supply' />
       <label>Receiver's address</label>
       <input type="text" placeholder='receiver k: address' />
     <button className='btn btn-secondary'
        onClick={handleMintNft}>Mint Nft</button>
    </div>
  )
}

export default MintNft