import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";
function JoinGame({logOut}) {
  const [rivalUsername, setRivalUsername] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: rivalUsername } });

    if (response.users.length === 0 ) {
      alert("User not found");
      return;
    }
    if (response.users[0].id === client.userID ) {
        alert("please provide different user id");
        return;
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);
  };
  return (
    <>
      {channel ? 
      (
        <Channel channel={channel} Input={CustomInput}> 
            <Game channel={channel} setChannel={setChannel} />
        </Channel>
      ) : 
      (
        <div className="joinGame">
          <h1>Create Game</h1>
          <input
            placeholder="Username of rival..."
            onChange={(event) => {
              setRivalUsername(event.target.value);
            }}
          />
          <button onClick={createChannel}> Join/Start Game</button><br/>
          <button onClick={logOut}> Log Out</button>

        </div>
      )}
    </>
  );
}

export default JoinGame;
