import React, { useState } from 'react'
// import {Routes, Route, useNavigate} from 'react-router-dom';
import App from './App';
import './Home.css'
import image from './images/back.gif';
import icon from './images/dev.jpg';

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
    <div className='background'>
        <div className='Home'>
            <div className='content'>
                <h1>TIC-TAC-TOE</h1>
            </div>
            <div className='gifi'>
                <img  width='350px' height='350px' src={image} alt="gif"/>
            </div>
            <div className='play1'>
                <button onClick={handleClick}>Lets Play</button>
            </div>
            <footer className='copy'>
                <img width='100px' height='100px' align='center' src={icon} alt="ico"/>
                <p> &copy;by Ripunjay Choudhury </p>
            </footer>
        </div>
    </div>        
    )}
    </>
  )
}

export default Home
