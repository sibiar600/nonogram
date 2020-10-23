import React, {useEffect, createContext, useReducer} from 'react';
import './App.css';
import NavBar from './components/Navbar';
import { Route, useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Signup from './components/screens/Signup';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import UserProfile from './components/screens/UserProfile';
import CreatePost from './components/screens/CreatePost';
import SubscribedUserPosts from './components/screens/SubscribedUserPosts'
import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const history = useHistory()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: 'USER', payload: user })
      history.push('/')
    }else {
      history.push('/login')
    }
  }, [])

  return (
    <>
    <UserContext.Provider value={{state, dispatch}}>
        <NavBar />
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
        <Route exact path='/profile'>
          <Profile />
        </Route>
        <Route path='/profile/:userid'>
          <UserProfile/>
        </Route>
        <Route path='/create'>
          <CreatePost />
        </Route>
        <Route path="/myfollowingpost">
          <SubscribedUserPosts />
        </Route>
    </UserContext.Provider>
        
    </>
  );
}

export default App;
