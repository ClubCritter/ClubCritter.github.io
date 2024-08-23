import React, {useState} from 'react'
import ManageSales from './ManageSales';
import AccessTresury from './AccessTresury';
import usePresaleStore from '../store/usePresaleStore';

const DeployerPanel = ({setDeployerPanel, tokenSymbol, countdown}) => {
    const {phase0startTime, phase1startTime, salesEndTime} = usePresaleStore()
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

  const now = new Date();
  const isPreWl = now < phase0startTime;
  const isPhase0 = now >= phase0startTime && now < phase1startTime;
  const isPhase1 = now >= phase1startTime && now < salesEndTime;

  return (
  <div className='deployer-panel'>
    <h3>Deployer Panel</h3>
    <div className='countdown-container'>
                    <p>{isPreWl ? "Whitelist Starts in" : isPhase0 ? "Public Sale Starts In" : isPhase1 ? "Public Sale Ends in" : "Sale Ended"}</p>
                    <div className="countdown">
                      <p>{countdown.days}d : {countdown.hours}h : {countdown.minutes}m : {countdown.seconds}s</p>
                    </div>
    </div>
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