import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function Login({ setIsAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const cookies = new Cookies();
  
  const login = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    setIsLoggingIn(true);
    setErrorMessage("");
    Axios.post("https://tic-tac-toe-server-six.vercel.app/login", {
      username,
      password,
    }).then((res) => {
      const { firstName, lastName, username, token, userId } = res.data;
      if(token) {
        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("username", username);
        cookies.set("firstName", firstName);
        cookies.set("lastName", lastName);
        setIsAuth(true);
      } else {
        setErrorMessage("User not found");
        setIsAuth(false);
      }
      setIsLoggingIn(false);
    }).catch(error => {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login");
      setIsLoggingIn(false);
    });
  };

  return (
    <form onSubmit={login} className="login">
      <label>Login</label>
      <input
        placeholder="Username"
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
        }}
        required
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        required
      />
      <button type="submit" disabled={isLoggingIn}>
        Login
      </button>
      {isLoggingIn && <div className="logging-in-message">Logging in<span className="dots"></span></div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
}

export default Login;