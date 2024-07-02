import React, { useState } from 'react';
import { tokens } from '../pactcalls/tokens';
import useTokenStore from '../store/tokenStore';

const SelectToken = () => {
  const { token, setToken, customContract, setCustomContract } = useTokenStore()
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSelectChange = (e) => {
    if (e.target.value === 'custom') {
      setShowCustomInput(true);
    } else {
      setToken({
        contract: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
        isCustom: false
      });
      setShowCustomInput(false);
    }
  };

  const handleCustomContractChange = (e) => {
    setCustomContract(e.target.value);
  };

  const handleCustomContractSubmit = () => {
    const tokenName = customContract.split('.').pop();
    setToken({ 
      contract: customContract, 
      name: tokenName,
      isCustom: true
    });
    setShowCustomInput(false);
  };

  return (
    <div>
      <select value={token.isCustom? customContract : token.contract} onChange={handleSelectChange}>
        {tokens.map((token, i) => (
          <option key={i} value={token.contract}>
            {token.name}
          </option>
        ))}
        {token.isCustom? (
          <option value={customContract}>{token.name}</option>
        ) : (
          <option value="custom">Custom Token</option>
        )}
      </select>
      {showCustomInput ? (
        <div className='custom-token-input'>
          <input
            type="text"
            value={customContract}
            onChange={handleCustomContractChange}
            placeholder="Enter custom token contract address"
          />
          <button onClick={handleCustomContractSubmit}>Submit</button>
        </div>
      ) 
      : token.isCustom ? (<p>{token.name.toUpperCase() }</p>) 
      : null
      }
    </div>
  );
};

export default SelectToken;