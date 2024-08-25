import React, { useState } from 'react'
import App from './App';
import './Home.css'
import image from './images/back.gif';
import icon from './images/dev.jpg';
import { motion } from "framer-motion";

function Home() 
{
    const [isClick, setisClick] = useState(false);
    const handleClick = () => {
        setisClick(true);
    }

  return (
    <div className='background'>
    {isClick ? (
        <App setisClick={setisClick}/>
    ) : (
    <>
        <div className='Home'>
            <div className='content'>
            <div className="animated">
                <motion.span
                    style={{ color: "" }}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    TIC-TAC-TOE
                </motion.span>
                <motion.span
                    style={{ fontSize: "30px", color: "#9932CC" }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    MULTIPLAYER
                </motion.span>
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
    </>        
    )}
    </div>
  )
}

export default Home