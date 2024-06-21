import React from 'react'
import img1 from '../assets/img/gallery-img-01.png'
import img2 from '../assets/img/gallery-img-02.png'
import img3 from '../assets/img/gallery-img-03.png'
import img4 from '../assets/img/gallery-img-04.png'

const Tokenomics = () => {
  return (
    <div data-page-no="2" className='tokenomics-container'>
            <div className="mx-auto position-relative gallery-container">
              <div className="mx-auto tm-border-top tm-border-bottom tokenomics-grid-container tm-bg-dark">
                <figure className="effect-julia item">
                    <img src={img1} alt="Image" />
                    <figcaption>
                        <div>
                            <p>10% Team</p>
                        </div>
                    </figcaption>
                </figure>
                <figure className="effect-julia item">
                    <img src={img2} alt="Image" />
                    <figcaption>
                        <div>
                            <p>20% Treasury</p>
                        </div>
                    </figcaption>
                </figure>
                <figure className="effect-julia item">
                    <img src={img3} alt="Image" />
                    <figcaption>
                        <div>
                            <p>30% Presale and burn</p>
                        </div>
                    </figcaption>
                </figure>
                <figure className="effect-julia item">
                    <img src={img4} alt="Image" />
                    <figcaption>
                        <div>
                            <p>40% Locked Liquidity</p>
                        </div>
                    </figcaption>
                </figure>
              </div>
            </div>
    </div>
  )
}

export default Tokenomics