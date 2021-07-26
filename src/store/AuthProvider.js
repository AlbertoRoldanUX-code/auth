import AuthContext from './auth-context';
import { useState } from 'react';

function AuthProvider(props) {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  function logInHandler(token) {
    setToken(token);
    localStorage.setItem('token', token);
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
