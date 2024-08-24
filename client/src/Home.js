import React, { useState } from 'react'
import App from './App';
import './Home.css'
import image from './images/back.gif';
import icon from './images/dev.jpg';

function Home() 
{
    const [isClick, setisClick] = useState(false);
    const handleClick = () => {
        setisClick(true);
    }

  return (
    <>
    {isClick ? (
        <App setisClick={setisClick}/>
    ) : (
    <div className='background'>
        <div className='Home'>
            <div className='content'>
                <div className='animated'>
                    <span  style={{color: '' }}>TIC-TAC-TOE</span>
                    <span style={{fontSize: '32px'}}>MULTIPLAYER</span>
                </div>
            </div>
            <div className='gifi'>
                <img width='340px' height='340px' src={image} alt="gif"/>
            </div>
            <div className='play1'>
                <button onClick={handleClick}>Let's Play</button>
            </div>
            <footer className='copy'>
                <img width='100px' height='100px' src={icon} alt="ico"/>
                <p>&copy; by Ripunjay Choudhury</p>
            </footer>
        </div>
    </div>        
    )}
    </>
  )
}

export default Home