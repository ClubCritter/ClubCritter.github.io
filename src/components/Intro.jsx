import React from 'react'
import { Link } from 'react-router-dom'
import homeImg from '../assets/img/intro.png'

const Intro = () => {
  return (
      <div className="px-3" >
         <div className="intro-wrap">
              <div className="d-flex position-relative tm-border-top tm-border-bottom intro-container">
                 <div className="intro-left tm-bg-dark">
                   <h2 className="mb-4">Welcome to Club Critter</h2>
                   <p className="mb-4">The first fully KYC + Audited memecoin built with KadenAi initiatives. </p>
                   <h2>Join our Discord! </h2>
                   <p>We're not your average meme army. We're a friendly club that coexists peacefully with the entire Kadena ecosystem. We might not have a utility token, but we're passionate about helping others grow. In fact, Papa Otter himself has vouched for Club Critter members' ability to assist developers in expanding the Kadena ecosystem (with $CRITTER rewards as a bonus, of course!). </p>
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