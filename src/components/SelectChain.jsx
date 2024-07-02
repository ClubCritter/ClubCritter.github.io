import React from 'react'
import { chains } from '../pactcalls/tokens'
import useTokenStore from '../store/tokenStore'

const SelectChain = () => {
  const { chainId, setChainId } = useTokenStore()
  return (
    <select value={chainId} onChange={(e) => setChainId(e.target.value)}>
                   {chains.map((chain, i) =>(
                   <option key={i} value={chain}>{chain}</option>
                   ))}
    </select>
  )
}

export default SelectChain