import { useState } from 'react';

import classes from './AuthForm.module.css';
import LoadingSpinner from '../Layout/LoadingSpinner';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  function onChangeEmailHandler(e) {
    setEnteredEmail(e.target.value);
  }
  function onChangePasswordHandler(e) {
    setEnteredPassword(e.target.value);
  }

  async function sendRequest(user, url) {
    try {
      setError(false);
      setIsLoading(true);
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      let errorMessage = 'Authentication failed';
      if (data.error) {
        errorMessage = data.error.message;
      }
      if (!res.ok) throw new Error(errorMessage);

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage(err.message);
      setIsLoading(false);
    }
  }

  function submitHandler(e) {
    e.preventDefault();
    const user = {
      email: enteredEmail,
      password: enteredPassword,
      returnSecureToken: true,
    };
    if (!isLogin) {
      sendRequest(
        user,
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`
      );
    }
    if (isLogin) {
      sendRequest(
        user,
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`
      );
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input
            type='email'
            id='email'
            onChange={onChangeEmailHandler}
            required
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          {error && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <input
            type='password'
            id='password'
            onChange={onChangePasswordHandler}
            required
          />
        </div>
        <div className={classes.actions}>
          {isLoading && <LoadingSpinner />}
          {!isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;

// 1º Extract entered values.
// 2º Check wether we're in login or signup mode.
// 3º If we're in signup mode, send entered data to appropiate API endpoint.
