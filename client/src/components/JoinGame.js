import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";
import Axios from "axios"; // Import Axios to make API calls

function JoinGame({ logOut }) {
  const [rivalUsername, setRivalUsername] = useState("");
  const [users, setUsers] = useState([]);
  // const [showUserList, setShowUserList] = useState(false);
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);

  const createChannel = async (e) => {
    e.preventDefault();
    const response = await client.queryUsers({ name: { $eq: rivalUsername } });

    if (response.users.length === 0) {
      alert("User not found");
      return;
    }
    if (response.users[0].id === client.userID) {
      alert("Please provide a different user id");
      return;
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);
  };

  const fetchUsers = async () => {
    console.log("Fetching users...");
    try {
      const response = await Axios.get("https://tic-tac-toe-server-six.vercel.app/users");
      console.log(response.data.usernames);
      setUsers(response.data.usernames);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel} />
        </Channel>
      ) : (
        <div className="joinGame">
          <div>
            <span>Create Game</span>
          </div>
          <form onSubmit={createChannel}>
            <input
              placeholder="Username of rival..."
              onChange={(event) => setRivalUsername(event.target.value)}
              required
            />
            <button type="submit">JoinGame</button>
          </form>
          <button type="button" onClick={fetchUsers}>ListUser</button>
          <button onClick={logOut}>LogOut</button>
          {users.length > 0 && (
            <div className="user-list-box">
              {users.map(user => (
                <div key={user.id} className="user-item">
                  {user.username}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default JoinGame;
