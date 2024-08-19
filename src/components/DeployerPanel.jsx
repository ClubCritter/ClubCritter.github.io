import React, {useState} from 'react'
import ManageSales from './ManageSales';
import AccessTresury from './AccessTresury';

const DeployerPanel = ({setDeployerPanel, tokenSymbol}) => {
    const [showOption, setShowOption] = useState(null);

    const options = [{
      optionName: "Manage Sales",
      action: "manageSales"
    },{
      optionName: "Access Tresury",
      action: "accessTresury"
    }
  ]

    const handleOptionClick = (action) => {
      setShowOption(action);
    };

    const renderOption = () => {
      switch (showOption) {
        case 'manageSales':
            return <ManageSales tokenSymbol = {tokenSymbol}/>
        case 'accessTresury':
            return <AccessTresury tokenSymbol = {tokenSymbol}/>
        default:
            return null
      }
    }

    const handleClosePanel = () => {
        setDeployerPanel(false)
    }
  return (
  <div className='deployer-panel'>
    <h3>Deployer Panel</h3>
      <div className='deployer-options'>
      {options.map((option, index) => (
        <div key={index} >
          <button className="btn-primary col-12" onClick={() => handleOptionClick(option.action)}>
          {option.optionName}
           </button>
           
        </div>
      ))}
      </div>
      {showOption && renderOption()}
    <button onClick={handleClosePanel}
      className='close-button'>Close</button>
  </div>
    
  )
}

export default DeployerPanel