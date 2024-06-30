import React from 'react'
import { chains } from '../pactcalls/tokens'

const SelectChain = ({setChainId}) => {
  return (
    <select onChange={(e) => setChainId(e.target.value)}>
                   {chains.map((chain, i) =>(
                   <option key={i} value={chain}>{chain}</option>
                   ))}
    </select>
  )
}

export default SelectChain