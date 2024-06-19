import React from 'react'

const Presale = () => {
  return (
    <div data-page-no="4" className='presale-container'>
            <div className="mx-auto page-width-2">
              <div className="row gap-6">
                <div className="col-md-6 tm-contact-left tm-bg-dark-l">
                  <form action="#" method="POST" className="contact-form">
                    <div className="input-group tm-mb-30">
                        <input name="name" type="text" className="form-control rounded-0 border-top-0 border-end-0 border-start-0" placeholder="Name" />
                    </div>
                    <div className="input-group tm-mb-30">
                        <input name="email" type="text" className="form-control rounded-0 border-top-0 border-end-0 border-start-0" placeholder="Email" />
                    </div>
                    <div className="input-group tm-mb-30">
                        <textarea rows="5" name="message" className="textarea form-control rounded-0 border-top-0 border-end-0 border-start-0" placeholder="Message"></textarea>
                    </div>
                    <div className="input-group justify-content-end">
                        <input type="submit" className="btn btn-primary tm-btn-pad-2" value="Send" />
                    </div>
                  </form>
                </div>
                <div className="col-md-6 tm-contact-right tm-bg-dark-r py-5">    
                  <h2 className="mb-4">Presale</h2>              
                  <p className="mb-4">
                    Coming Soon
                  </p>
                  <div>
                    Keep An eye on this page
                  </div>
                  <div className="tm-mb-45">
                    I mean it!!
                  </div>
                  {/* <!-- Map --> */}
                  <div className="map-outer">
                    <div className="gmap-canvas">
                        <iframe width="100%" height="400" id="gmap-canvas"
                            src="https://maps.google.com/maps?q=Av.+L%C3%BAcio+Costa,+Rio+de+Janeiro+-+RJ,+Brazil&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            ></iframe>
                    </div>
                </div>
                </div>
              </div>
            </div>            
          </div>
  )
}

export default Presale