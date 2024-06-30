import React from 'react'
import { tokens } from '../pactcalls/tokens'

const SelectToken = ({ setToken}) => {
  return (
    <select onChange={(e) => setToken({
        contract: e.target.value,
         name: e.target.options[e.target.selectedIndex].text
         })}>
        {tokens.map((token, i) => (
        <option key={i} value={token.contract}>{token.name}</option>
       ))}
   </select>
  )
}

export default SelectToken