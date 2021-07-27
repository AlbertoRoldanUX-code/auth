import AuthContext from './auth-context';
import { useState } from 'react';

function calculateRemainingTime(expirationTime) {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingTime = adjExpirationTime - currentTime;
  return remainingTime;
}

function AuthProvider(props) {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  function logInHandler(token, expirationTime) {
    setToken(token);
    localStorage.setItem('token', token);

    const remainingTime = calculateRemainingTime(expirationTime);

    setTimeout(() => {
      logOutHandler();
    }, remainingTime);
  }

  function logOutHandler() {
    setToken(null);
    localStorage.removeItem('token ');
  }

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: logInHandler,
    logout: logOutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
