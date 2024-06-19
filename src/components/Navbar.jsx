import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <div className="cd-slider-nav">
              <nav className="navbar navbar-expand-lg" aria-current="page" id="tm-nav">
                <Link className="navbar-brand" to='/'>Club Critter</Link>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-supported-content" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbar-supported-content">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                      <li className="nav-item selected">
                        <Link className="nav-link home"  to="/" data-no="1" >Home</Link>
                        <div className="circle"></div>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to='/tokenomics' data-no="2">Tokenomics</Link>
                        <div className="circle"></div>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/about" data-no="3">About</Link>
                        <div className="circle"></div>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/presale" data-no="4">Presale</Link>
                        <div className="circle"></div>
                      </li>
                    </ul>
                  </div>
              </nav>
            </div>
          </div>          
        </div>        
      </div>
  )
}

export default Navbar