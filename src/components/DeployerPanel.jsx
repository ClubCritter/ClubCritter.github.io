import React from 'react'

const DeployerPanel = ({setDeployerPanel}) => {

    const handleClosePanel = () => {
        setDeployerPanel(false)
    }
  return (
  <div className='deployer-panel'>
    <h3>Deployer Panel</h3>
      <div className='deployer-options'>
        <button className='btn btn-primary col-12'>
          Manage Sales
        </button>
        <button className='btn btn-primary col-12'>
          Access Tresury
        </button>
        <button className='btn btn-primary col-12'>
          Access Liquidity
        </button>
      </div>
    <button onClick={handleClosePanel}
      className='close-button'>Close</button>
  </div>
    
  )
}

export default DeployerPanel