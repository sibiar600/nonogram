import React, {useContext, } from 'react'
import { Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import '../App.css'

const NavBar = () => {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const logoutHandler = () => {
        localStorage.clear()
        dispatch({type: "CLEAR"})
        history.push('/login')
    }


    const renderList = () => {
        if (state) {
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Create Post</Link></li>,
                <li><Link to="/myfollowingpost">Following</Link></li>,
                <li>
                    <button
                        className="btn"
                        onClick={() => logoutHandler()}
                    >
                        Logout
                    </button>

                </li>
            ]
        }else {
            return [
                <li><Link to="/login">Login</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return (
        <div className="navbar-fixed" >
            <nav>
                <div className="nav-wrapper white">
                    <Link to={state ? "/" : "/login"} className="brand-logo left">▲⚬▲⚬</Link>
                    <ul id="nav-mobile" className="right">
                        {renderList()}
                    </ul>
                </div>  
            </nav>
        </div>
    )
    
}

export default NavBar
