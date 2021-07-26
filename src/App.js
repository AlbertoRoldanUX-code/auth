import { Switch, Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './store/auth-context';

function App() {
  const ctx = useContext(AuthContext);
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        <Route path='/auth'>
          <AuthPage />
        </Route>
        <Route path='/profile'>
          {ctx.isLoggedIn && <UserProfile />}
          {!ctx.isLoggedIn && (
            <Redirect to='/'>
              <HomePage />
            </Redirect>
          )}
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;

// Implement change of password.
