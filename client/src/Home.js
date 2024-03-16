import React, { useState } from 'react'
// import {Routes, Route, useNavigate} from 'react-router-dom';
import App from './App';
import './Home.css'
import image from './images/back.gif';
import icon from './images/mul.png';

function Home() 
{
    const [isClick, setisClick] = useState(false);
    const handleClick=()=>{
        setisClick(true);
    }

  return (
    <>
    {isClick ? (
        <App setisClick={setisClick}/>):(
    <div className='Home'>
        <div className='content'>
            <h1>TIC-TAC-TOE</h1>
        </div>
        <div className='gifi'>
            <img  width='390px' height='390px' src={image} alt="gif"/>
        </div>
        <div className='play1'>
            <button onClick={handleClick}>Lets Play</button>
        </div>
        <footer className='copy'>
            <div className='playericon'>
                <img width='150px' height='110px' align='center' src={icon} alt="ico"/>
            </div>
            <p> &copy;by Ripunjay Choudhury </p>
        </footer>
    </div>
    )}
    </>
  )
}

export default Home