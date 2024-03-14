import React, { useState } from 'react'
// import {Routes, Route, useNavigate} from 'react-router-dom';
import App from './App';
import './Home.css'

function Home() 
{
    const [isClick, setisClick] = useState(false);
    const handleClick=()=>{
        setisClick(true);
    }
    // const navigate = useNavigate();

    // const navigatePlay = () => {
    //   navigate('/App');
    // };

  return (
    <>
    {isClick ? (
        <App setisClick={setisClick}/>):(
    <div className='Home'>
        <div className='content'>
            <h1>HOME</h1>
        </div>
        <div className='hd1'>
            <button onClick={handleClick}>Lets Play</button>
        </div>
    </div>
    )}
    </>
  )
}

export default Home