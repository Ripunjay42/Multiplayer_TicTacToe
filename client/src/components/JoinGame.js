import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";

function JoinGame({ logOut }) {
  const [rivalUsername, setRivalUsername] = useState("");
  const [channel, setChannel] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const { client } = useChatContext();
  // const [wait, setWait] = useState(false);

  const createChannel = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    try {
      const response = await client.queryUsers({ name: { $eq: rivalUsername } });

      if (response?.users?.length === 0) {
        alert("User not found");
        return;
      }

      if (response.users[0].id === client.userID) {
        alert("Please provide a different user ID");
        return;
      }

      if (!response.users[0].online) {
        alert("User is offline");
        return;
      }

      const newChannel = await client.channel("messaging", {
        members: [client.userID, response.users[0].id],
      });

      await newChannel.watch();
      setChannel(newChannel);

      // Update the users list to set the current user's status to "waiting"
      setUsersList((prevUsersList) =>
        prevUsersList.map((user) =>
          user.id === client.userID ? { ...user, status: "waiting" } : user
        )
      );


    } catch (error) {
      console.error("Error creating channel:", error);
      alert("An error occurred while creating the channel.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await client.queryUsers({});
      const users = response.users;
      console.log("al userrs : ", users);

      const members = channel?.state?.members || {};
      const channelMemberIds = Object.keys(members);

      const updatedUsersList = users
        .filter(user => user.id !== client.userID) // Exclude the current user
        .map(user => ({
          ...user,
          status: user.online
            ? "online" // User is online
            : "offline", // User is offline
        }));

      // Set the current user's status as "waiting" if they are in the channel
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
      alert("An error occurred while fetching users.");
    }
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel} logOut={logOut} />
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
              <button type="button" onClick={fetchUsers}>
                List Users
              </button>
              <button onClick={logOut}>Log Out</button>
            </form>
          </div>

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