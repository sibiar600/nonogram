import React, {useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App' 
import M from 'materialize-css'

import '../App.css'

const NavBar = () => {
    const searchModal = useRef(null)
    const sideNav = useRef(null)
    const [search, setSearch] = useState()
    const [userDetails, setUserDetails] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    useEffect(() => {
        M.Sidenav.init(sideNav.current)
    }, [])

    const logoutHandler = () => {
        localStorage.clear()
        dispatch({type: "CLEAR"})
        history.push('/login')
    }

    const renderList = () => {
        if (state) {
            return [
                <ul className="sidenav" id="mobile-demo">
                    <li key="1"><i data-target="modal1" className="material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,
                    <li key="2"><Link to="/profile">Profile</Link></li>,
                    <li key="3"><Link to="/create">New Post</Link></li>,
                    <li key="4"><Link to="/myfollowingpost">Following</Link></li>,
                    <li key="5">
                        <button className="btn"
                            onClick={() => {
                                localStorage.clear()
                                dispatch({ type: "CLEAR" })
                                history.push('/login')
                            }}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            ]
        } else {
            return [
                <ul className="sidenav" id="mobile-demo">
                    <li key="6"><Link to="/login">Login</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
                </ul>
                

            ]
        }
    }

    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/search-users', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query
            })
        })
        .then(res => res.json())
        .then(result => setUserDetails(result.user))
    }

    return (
        <nav className="navbar-fixed white" >
                <div className="navbar-wrapper">
                    <Link to={state ? "/" : "/login"} className="brand-logo center">▲⚬▲⚬</Link>
                    <a href='#' data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                    <ul className="hide-on-med-and-down">
                        {renderList()}
                    </ul>
                </div>

                {/* search */}
                <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
                    <div className="modal-content">
                        <input
                            type="text"
                            placeholder="search users"
                            value={search}
                            onChange={(e) => fetchUsers(e.target.value)}
                        />
                        <ul className="collection">
                            {userDetails.map(item => {
                                return <Link to={item._id !== state._id ? "/profile/" + item._id : '/profile'} onClick={() => {
                                    M.Modal.getInstance(searchModal.current).close()
                                    setSearch('')
                                }}><li className="collection-item">{item.email}</li></Link>
                            })}

                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>close</button>
                    </div>
                </div>
        </nav>
    )
}

export default NavBar