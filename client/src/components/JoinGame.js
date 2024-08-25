import React, { useState, useEffect } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";

function JoinGame({ logOut }) {
  const [rivalUsername, setRivalUsername] = useState("");
  const [channel, setChannel] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [showUsers, setShowUsers] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { client } = useChatContext();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const createChannel = async (e) => {
    e.preventDefault();

    try {
      console.log("Querying for user:", rivalUsername);
      const response = await client.queryUsers({ name: { $eq: rivalUsername } });
      console.log("Query response:", response);

      if (response?.users?.length === 0) {
        setErrorMessage("User not found");
        return;
      }

      const rivalUser = response.users[0];

      if (rivalUser.id === client.userID) {
        setErrorMessage("Please provide a different user ID");
        return;
      }

      if (!rivalUser.online) {
        setErrorMessage("User is offline");
        return;
      }

      console.log("Creating channel with members:", client.userID, rivalUser.id);
      const newChannel = await client.channel("messaging", {
        members: [client.userID, rivalUser.id],
      });

      await newChannel.watch();
      setChannel(newChannel);
    } catch (error) {
      console.error("Error in createChannel:", error);
      setErrorMessage(`An error occurred while creating the channel: ${error.message}`);
    }
  };

  const leave = async () => {
    try {
      await channel.stopWatching();
      channel.removeMembers([client.userID]);
      channel.state.watcher_count = 0;
      setChannel(null);
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await client.queryUsers({});
      const users = response.users;
      console.log("all users: ", users);

      const members = channel?.state?.members || {};
      const channelMemberIds = Object.keys(members);

      const updatedUsersList = users
        .filter((user) => user.id !== client.userID)
        .map((user) => ({
          ...user,
          status: user.online ? "online" : "offline",
        }));

      if (channelMemberIds.includes(client.userID)) {
        updatedUsersList.push({
          id: client.userID,
          name: client.user.name || client.user.username,
          status: "waiting",
        });
      }

      setUsersList(updatedUsersList);
      setShowUsers(true);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("An error occurred while fetching users.");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchUsers();
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel} leave={leave} />
        </Channel>
      ) : (
        <div className="joinGame">
          <div className="game-controls">
            <div>
              <span>Create Game</span>
            </div>
            <form onSubmit={createChannel}>
              <input
                placeholder="Username of rival..."
                value={rivalUsername}
                onChange={(event) => setRivalUsername(event.target.value)}
                required
              />
              <button type="submit">Join Game</button>
              <button onClick={logOut}>Log Out</button>
            </form>
          </div>
          {errorMessage && <div className="error-message-box" style={{fontSize : "17px", marginTop : "3%"}}>{errorMessage}</div>}
          {showUsers && (
            <div className="users-list-container">
              <h3 className="users-list-header">Users</h3>
              <div className="users-list">
                {usersList.length > 0 ? (
                  usersList.map((user) => (
                    <div key={user.id} className="user-item">
                      <span className={`online-indicator ${user.status}`}></span>
                      {user.name || user.username}
                    </div>
                  ))
                ) : (
                  <div className="user-item">No users found</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default JoinGame;
