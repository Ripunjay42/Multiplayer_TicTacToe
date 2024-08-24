import './App.css';
import Login from './components/Login';
import SignUp from './components/Signup';
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { useState } from "react";
import JoinGame from "./components/JoinGame";

function App({setisClick}) 
{

  const api_key = "p8k4r8ua5w5y";
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  };


  if (token) {
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then((user) => {
        setIsAuth(true);
      });
  }

  return (
    <div className='background'>
    <div className="App">
        {isAuth ? (
          <>
            <Chat client={client}>
              <div className='hd1'>
                <JoinGame logOut={logOut}  />
              </div>
            </Chat>
            </> 
      ) : (          
          <div className='Ls'>
              <div className='Head'> <span>TIC-TAC-TOE</span></div>
              <SignUp setIsAuth={setIsAuth} />
              <Login setIsAuth={setIsAuth} />
              <div className='back'>
                <button  onClick={()=>{setisClick(false) }}>Back</button>
              </div>
          </div>
        )}
    </div>
    </div>
  );
}

export default App;
