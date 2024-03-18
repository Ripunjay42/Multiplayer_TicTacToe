import React, { useState } from "react";
import Board from "./Board";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import "./Chat.css";
import Confetti from 'react-confetti';

function Game({ channel, setChannel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );

  const [result, setResult] = useState({ winner: "none", state: "none" });
  const[winsize, setwinsize]=useState({width:undefined, height : undefined});

  function handlewindowsize(){
    setwinsize({width:window.innerWidth, height:window.innerHeight});
  }

  window.onresize=()=>handlewindowsize();
  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  if (!playersJoined) {
    return <h1> Waiting for other player to join...</h1>;
  }


  let elementStyle = {
    color: 'red', // Set the color to whatever you need
  };
  if(result.winner==="O")
  {
    elementStyle = {
      color: 'rgb(29, 236, 22)', // Set the color to whatever you need
    };
  }

  return (
    <div className="tic_ch">
       {result.state === "won" && <Confetti width={winsize.width} height={winsize.height}/>}  
      <div className="gameContainer">
        <h1>TIC TAC TOE </h1>
        <Board result={result} setResult={setResult} setChannel={setChannel} />
        <div className="result">
            <p>Result :</p>
            {result.state === "won" && <div style={elementStyle} className="wintie"> {result.winner} Won The Game</div>}
            {result.state === "tie" && <div className="wintie"> Game Tied</div>}
          </div>
        {/* <div className="leave">
        <button
            onClick={async () => {
              await channel.stopWatching();
              setChannel(null);
            }}
          >
            {" "}
            Leave Game
          </button>
          
        </div> */}
      </div>
      <div className="mgsContainer">
        <div className="mgs">
            <Window>
              <MessageList
                disableDateSeparator
                closeReactionSelectorOnClick
                hideDeletedMessages
                messageActions={["react"]}
              />
              <MessageInput noFiles />
            </Window>
          </div>
      </div>
    </div>
  );
}

export default Game;

