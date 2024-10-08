import React, { useState, useEffect } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function SignUp({ setIsAuth }) {
  const cookies = new Cookies();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: ""
  });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const signUp = (e) => {
    e.preventDefault();
    setIsSigningUp(true);
    setErrorMessage("");

    Axios.post("https://tic-tac-toe-server-six.vercel.app/signup", user)
      .then((res) => {
        const { token, userId, firstName, lastName, username } = res.data;
        if (token) {
          cookies.set("token", token);
          cookies.set("userId", userId);
          cookies.set("username", username);
          cookies.set("firstName", firstName);
          cookies.set("lastName", lastName);
          setIsAuth(true);
        } else {
          setErrorMessage("An unexpected error occurred.");
          setIsAuth(false);
        }
        setIsSigningUp(false);
      })
      .catch((error) => {
        setIsSigningUp(false);
        if (error.response && error.response.status === 400) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An error occurred during signup.");
        }
      });
  };

  return (
    <form onSubmit={signUp} className="signUp">
      <label>Sign Up</label>
      <input
        placeholder="First Name"
        value={user.firstName}
        onChange={(event) => setUser({ ...user, firstName: event.target.value })}
        required
      />
      <input
        placeholder="Last Name"
        value={user.lastName}
        onChange={(event) => setUser({ ...user, lastName: event.target.value })}
        required
      />
      <input
        placeholder="Username"
        value={user.username}
        onChange={(event) => setUser({ ...user, username: event.target.value })}
        required
      />
      <input
        placeholder="Password"
        type="password"
        value={user.password}
        onChange={(event) => setUser({ ...user, password: event.target.value })}
        required
      />
      <button type="submit" disabled={isSigningUp}>
        Sign Up
      </button>
      {isSigningUp && <div className="signing-up-message">Signing up<span className="dots"></span></div>}
      {errorMessage && <div className="error-message-box">{errorMessage}</div>}
    </form>
  );
}

export default SignUp;
