import React, { useState } from 'react';
import { tokens } from '../pactcalls/tokens';

const SelectToken = ({ setToken }) => {
  const [customContract, setCustomContract] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSelectChange = (e) => {
    if (e.target.value === 'custom') {
      setShowCustomInput(true);
    } else {
      setToken({
        contract: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
      });
      setShowCustomInput(false);
    }
  };

  const handleCustomContractChange = (e) => {
    setCustomContract(e.target.value);
  };

  const handleCustomContractSubmit = () => {
    const tokenName = customContract.split('.').pop();
    setToken({ contract: customContract, name: tokenName });
  };

  return (
    <div>
      <select onChange={handleSelectChange}>
        {tokens.map((token, i) => (
          <option key={i} value={token.contract}>
            {token.name}
          </option>
        ))}
        <option value="custom">Custom Token</option>
      </select>
      {showCustomInput && (
        <div>
          <input
            type="text"
            value={customContract}
            onChange={handleCustomContractChange}
            placeholder="Enter custom token contract address"
          />
          <button onClick={handleCustomContractSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default SelectToken;