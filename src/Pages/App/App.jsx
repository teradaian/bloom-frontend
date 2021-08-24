import React, { useState, useEffect } from 'react';

import Nav from '../../Components/Nav/Nav'
import LoginForm from '../../Components/LoginForm/LoginForm'
import SignupForm from '../../Components/SignupForm/SignupForm'

import './App.module.css';

const App = (props) => {

      const [ loggedIn, setLoggedIn ] = useState(localStorage.getItem('token') ? true : false)
      const [ displayedForm, setDisplayedForm ] = useState ('')
      const [ username, setUsername ] = useState ('')

  useEffect(() => {
    (async () => {
      if (loggedIn) {
        const res = await fetch('http://localhost:8000/bloom/current_user/', {
          headers: {
            Authorization: `JWT ${ localStorage.getItem('token') }`
          }
        })
        const json = await res.json()
        setUsername(json.username)
      }
    })();
    return () => { setUsername('') }
  }, [loggedIn]);


  const handleLogin = async (e, data) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const json = await res.json()
    localStorage.setItem('token', json.token);
    setLoggedIn(true)
    setDisplayedForm('')
    setUsername(json.user.username)
  };

  const handleSignup = async (e, data) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/bloom/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      const json = await res.json()
      localStorage.setItem('token', json.token);
      setLoggedIn(true)
      setDisplayedForm('')
      setUsername(json.username)
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false)
    setUsername('')
  };

  const displayForm = form => setDisplayedForm(form)

  let form;
  switch (displayedForm) {
    case 'login':
      form = <LoginForm handleLogin={handleLogin} />;
      break;
    case 'signup':
      form = <SignupForm handleSignup={handleSignup} />;
      break;
    default:
      form = null;
  }

  return (
    <div className="App">
      <Nav
        loggedIn={loggedIn}
        displayForm={displayForm}
        handleLogout={handleLogout}
      />
      {form}
      <h3>
        {loggedIn
          ? `Hello, ${username}`
          : 'Please Log In'}
      </h3>
    </div>
  );
}


export default App;