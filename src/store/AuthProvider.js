import AuthContext from './auth-context';
import { useState } from 'react';

function AuthProvider(props) {
  const [token, setToken] = useState(null);

  const userIsLoggedIn = !!token;

  function logInHandler(token) {
    setToken(token);
  }

  function logOutHandler() {
    setToken(null);
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
