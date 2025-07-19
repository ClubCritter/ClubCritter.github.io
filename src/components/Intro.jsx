import React from 'react'
import { Link } from 'react-router-dom'
import homeImg from '../assets/img/home-img-1.png'

const Intro = () => {
  return (
      <div className="px-3" >
         <div className="page-width-3 page-left">
              <div className="d-flex position-relative tm-border-top tm-border-bottom intro-container">
                 <div className="intro-left tm-bg-dark">
                   <h2 className="mb-4">Welcome to Club Critter</h2>
                   <p className="mb-4">The first fully KYC + Audited memecoin made on TokenGo with Kadpad Technology. </p>
                   <h2>Get in on the fun! </h2>
                   <p>We’re not your average memecoin. We’re the first memecoin launched on TokenGo with Kadpad Technology, making us a unique part of the Kadena ecosystem. We’re a friendly club that coexists peacefully with the entire Kadena community. While we might not have a utility to our token, our passion for helping others grow remains strong. In fact, Papa Otter himself has vouched for Club Critter members’ ability in expanding the Kadena ecosystem. Join us and be part of something amazing. Our leader, Andy Otter, will be actively supporting various initiatives and wants YOU... The community to be apart of it.</p>
                 </div>
                <div className="intro-right">
		            <div style={{textAlign: 'center'}}>
                      <img src={homeImg} alt="Image" className="img-fluid intro-img-1" />
		            </div>
                </div>
                <div className="circle intro-circle-1"></div>
                <div className="circle intro-circle-2"></div>
                <div className="circle intro-circle-3"></div>
                <div className="circle intro-circle-4"></div>
              </div>
              <div className="text-center">
                <Link to="/presale" className="btn btn-primary tm-intro-btn tm-page-link">
                  Join the presale
                </Link>
              </div>            
        </div>            
     </div>
  )
}

export default Intro
