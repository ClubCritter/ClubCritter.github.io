import React from 'react'
import discordImg from '../assets/img/discord.png'
import telegramImg from '../assets/img/telegram.png'
import twitterImg from '../assets/img/twitter.png'

function Footer() {
  return (
    <div className="container-fluid footer">
      <footer className="row mx-auto tm-footer">
        <div className="col-md-6 tm-bg-dark">
           Copyright 2024 Club Critter - A KadenAi Initiantive - website developed by <a href='https://x.com/kabir_crypto' target='_blank'>ⓀKabir</a>
        </div>
        <div className="col-md-6 px-0 tm-footer-right">
          <a href='https://discord.gg/U5EMjSvb4s' target='_blank'>
            <img src={discordImg} className='social-image'/>
          </a>
          <a href='https://t.me/clubcritterkda' target='_blank'>
            <img src={telegramImg} className='social-image'/>
          </a>
          <a href='https://x.com/CritterToken' target='_blank'>
            <img src={twitterImg} className='social-image'/>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Footer
