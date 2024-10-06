import React, { useState } from 'react';
import App from './App';
import './Home.css';
import image from './images/back.gif';
import icon from './images/dev.jpg';
import { GiAbstract024, GiAbstract044 } from 'react-icons/gi';  // Example icons from react-icons
import { motion } from "framer-motion";

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
            <div className="animated">
                <motion.span
                    style={{ color: "" }}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    TIC-TAC-TOE
                </motion.span>
                <motion.div
                    className="multiplayer-container"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <GiAbstract024 size={40} color="#9932CC" />
                    <span style={{ fontSize: "30px", color: "#9932CC", margin: '0 10px' }}>MULTIPLAYER</span>
                    <GiAbstract044 size={40} color="#9932CC" />
                </motion.div>
            </div>
            </div>
            <div className='gifi'>
                <img width='340px' height='340px' src={image} alt="gif"/>
            </div>
            <motion.div 
                className='about-game'
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ 
                    color: "antiquewhite", // White text
                    maxWidth: "420px", // Limit the paragraph width
                    margin: "10px auto", // Center the div and add vertical space above and below
                    textAlign: "center", // Center the text inside the div
                    lineHeight: "1.8",
                    letterSpacing: "0.05em",
                }}
            >
                <p>Experience the excitement of real-time multiplayer Tic-Tac-Toe, featuring instant matchmaking and a live player list.
                     Chat with other players during the game, thanks to the integrated Stream Chat API. 
                     Challenge your friends or find new opponents online for seamless gameplay and communication.</p>
            </motion.div>
            <div className='play1' style={{ marginTop: "0px" }}>
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

export default Home;
