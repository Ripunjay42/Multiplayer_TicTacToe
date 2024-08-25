import React, { useEffect, useState, useCallback } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";
import clapon from "../audio/clap.wav"

function Board({ result, setResult, setChannel}) {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const clap = new Audio(clapon);

  if(result.state === "won")
  {
      clap.play();
  }

  const chooseSquare = async (square) => 
  {
    if(result.state !== "won")
    {
        if (turn === player && board[square] === "") 
        {
          setTurn(player === "X" ? "O" : "X");

          await channel.sendEvent(
          {
            type: "game-move",
            data: { square, player },
          });
          setBoard(
            board.map((val, idx) => 
            {
                if (idx === square && val === "") 
                {
                  return player;
                }
              return val;
            })
            );
        }
     }
  };

  const checkWin = useCallback(() => {
    Patterns.forEach((currPattern) => {
      const firstPlayer = board[currPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;
      currPattern.forEach((idx) => {
        if (board[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });
      if (foundWinningPattern) {
        setResult({ winner: board[currPattern[0]], state: "won" });
      }
    });
  }, [board, setResult]);

  const checkIfTie = useCallback(() => {
    let filled = true;
    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });

    if (filled) {
      setResult({ winner: "none", state: "tie" });
    }
  }, [board, setResult]);

  useEffect(() => {
    checkIfTie();
    checkWin();
  }, [board, checkIfTie, checkWin]);

  channel.on((event) => {
    if (event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(
        board.map((val, idx) => {
          if (idx === event.data.square && val === "") {
            return event.data.player;
          }
          return val;
        })
      );
    }
  });

  const reset= async()=> 
  {
    clap.pause();
    if(result.state ==="none")
    {
      alert("complete the game first")
    }
    else
    {
      setBoard(["", "", "", "", "", "", "", "", ""]);
      setPlayer("X");
      setTurn("X");
      setResult({ winner: "none", state: "none" });
      
    }
  }

  const leaved = async () => {
    clap.pause();
    try {
      // Send a "player-left" event
      await channel.sendEvent({
        type: 'player-left',
        data: { userId: client.userID }
      });
      
      await channel.stopWatching();
      channel.removeMembers( [client.userID]);
      channel.state.watcher_count = 0;
      setChannel(null);
    } catch (error) {
      console.error("Error leaving game:", error);
    }
  };


  useEffect(() => {
    const handlePlayerLeft = (event) => {
      if (event.type === 'player-left' && event.user.id !== client.userID) {
        clap.pause();
        alert("The other player has left the game.");
        channel.stopWatching();
        channel.removeMembers( [client.userID]);
        channel.state.watcher_count = 0;
        setChannel(null); 
      }
    };
  
    channel.on('player-left', handlePlayerLeft);
  
    // Clean up the event listener when the component unmounts
    return () => {
      channel.off('player-left', handlePlayerLeft);
    };
  }, [channel, client.userID, setChannel]);

  return (
    <>
    <div className="playagain">
      <button className="playagain" onClick={reset}>Play Again</button>
      <button onClick={leaved}>Leave Game</button>
    </div>
    <div className="board">
      <div className="row">
        <Square val={board[0]} chooseSquare={() => chooseSquare(0)} />
        <Square val={board[1]} chooseSquare={() => chooseSquare(1)} />
        <Square val={board[2]} chooseSquare={() => chooseSquare(2)} />
      </div>

      <div className="row">
        <Square val={board[3]} chooseSquare={() => chooseSquare(3)} />
        <Square val={board[4]} chooseSquare={() => chooseSquare(4)} />
        <Square val={board[5]} chooseSquare={() => chooseSquare(5)} />
      </div>

      <div className="row">
        <Square val={board[6]} chooseSquare={() => chooseSquare(6)} />
        <Square val={board[7]} chooseSquare={() => chooseSquare(7)} />
        <Square val={board[8]} chooseSquare={() => chooseSquare(8)} />
      </div>
    </div>
    </>
  );
}

export default Board;
