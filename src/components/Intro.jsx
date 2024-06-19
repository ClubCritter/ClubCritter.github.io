import React from 'react'

const Intro = () => {
  return (
      <div className="px-3" >
         <div className="page-width-3 page-left">
              <div className="d-flex position-relative tm-border-top tm-border-bottom intro-container">
                 <div className="intro-left tm-bg-dark">
                   <h2 className="mb-4">Welcome to Club Critter</h2>
                   <p className="mb-4">The first fully KYC + Audited memecoin built with KadenAi initiatives. </p>
                   <h2>Yo, check it out! </h2>
                   <p>The wait is finally over! We're dropping the hottest meme token on the Kadena blockchain, and you know it's gonna be fire.  That's right, the KadenAi team has been putting in the work, and now it's time to celebrate with the first-ever KTG (Kadena Token Generator) meme token. </p>
                 </div>
                <div className="intro-right">
		            <div style={{textAlign: 'center'}}>
                      <img src="src/assets/img/home-img-1.jpg" alt="Image" className="img-fluid intro-img-1" />
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