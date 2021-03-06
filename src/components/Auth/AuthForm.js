import { useState, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';
import LoadingSpinner from '../Layout/LoadingSpinner';
import useSendRequest from '../../hooks/use-send-request';
import { useHistory } from 'react-router-dom';

const AuthForm = () => {
  const ctx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  function onChangeEmailHandler(e) {
    setEnteredEmail(e.target.value);
  }
  function onChangePasswordHandler(e) {
    setEnteredPassword(e.target.value);
  }

  const { isLoading, error, errorMessage, sendRequest } = useSendRequest();

  function LogIn(data) {
    const expirationTime = new Date(
      new Date().getTime() + +data.expiresIn * 1000
    );
    ctx.login(data.idToken, expirationTime.toISOString());
    history.replace('/');
  }

  function submitHandler(e) {
    e.preventDefault();
    const user = {
      email: enteredEmail,
      password: enteredPassword,
      returnSecureToken: true,
    };

    //Sign Up
    if (!isLogin) {
      sendRequest(
        {
          url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`,
          method: 'POST',
          body: user,
          headers: { 'Content-Type': 'application/json' },
        },
        LogIn
      );
    }
    //log In
    if (isLogin) {
      sendRequest(
        {
          url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`,
          method: 'POST',
          body: user,
          headers: { 'Content-Type': 'application/json' },
        },
        LogIn
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

// 1?? Extract entered values.
// 2?? Check wether we're in login or signup mode.
// 3?? If we're in signup mode, send entered data to appropiate API endpoint.
