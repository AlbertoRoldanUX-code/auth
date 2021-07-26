import classes from './ProfileForm.module.css';
import { useState, useContext } from 'react';
import useSendRequest from '../../hooks/use-send-request';
import AuthContext from '../../store/auth-context';
import LoadingSpinner from '../Layout/LoadingSpinner';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  const ctx = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, errorMessage } = useSendRequest();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  function changePasswordHandler(e) {
    setEnteredPassword(e.target.value);
  }

  function sendSuccessMessage() {
    setIsChanged(true);
    setTimeout(() => {
      history.replace('/');
    }, 3000);
  }

  function submitHandler(e) {
    e.preventDefault();

    sendRequest(
      {
        url: `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_API_KEY}`,
        method: 'POST',
        body: {
          idToken: ctx.token,
          password: enteredPassword,
          returnSecureToken: false,
        },
        headers: { 'Content-Type': 'application/json' },
      },
      sendSuccessMessage
    );
  }

  return (
    <div>
      {isChanged && (
        <h3 style={{ color: 'green' }}>Password changed successfully</h3>
      )}
      {!isChanged && (
        <form className={classes.form} onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor='new-password'>New Password</label>
            <input
              type='password'
              id='new-password'
              onChange={changePasswordHandler}
              minLength='7'
            />
          </div>
          <div className={classes.action}>
            {error && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {isLoading && <LoadingSpinner />}
            {!isLoading && <button>Change Password</button>}
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
