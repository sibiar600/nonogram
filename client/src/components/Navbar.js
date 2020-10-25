import React, {useState, useContext} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserContext } from '../App' 
import Scroll from './screens/Scroll'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,

    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: { 
        flexGrow: 1,
    },
    headerOptions: {

    }
}));

const Navbar = props =>  {
    const { history } = props
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { state, dispatch } = useContext(UserContext)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = (pageURL) => {
        history.push(pageURL)
        setAnchorEl(null);
    };

    const handleButtonClick = (pageURL) => {
        history.push(pageURL)
    };

    const handleMenuLogout = () => {
        localStorage.clear()
        dispatch({ type: "CLEAR" })
        history.push('/login')
    }

    const isLoggedInMenu = [
        {
            id: 2,
            menuTitle: 'New Post',
            pageURL: '/create'
        },
        {
            id: 3,
            menuTitle: 'Profile',
            pageURL: '/profile'
        },
        {
            id: 4,
            menuTitle: 'Following',
            pageURL: '/myfollowingpost'
        }
    ]

    const isLoggedOutMenu = [
        {
            id: 1,
            menuTitle: 'Login',
            pageURL: '/login'
        },
        {
            id: 2,
            menuTitle: 'Signup',
            pageURL: '/signup'
        }
    ]

    const renderMenu = () => {
        if (state) {
            return [
                isLoggedInMenu.map(menuItem => {
                    const { id, menuTitle, pageURL } = menuItem;
                    return (
                        <MenuItem key={id} onClick={() => handleMenuClick(pageURL)}>
                            {menuTitle}
                        </MenuItem>
                    );

                }),
                < MenuItem onClick={() => handleMenuLogout()}> Logout</ MenuItem >
            ]
        } else {
            return [
                isLoggedOutMenu.map(menuItem => {
                    const { id, menuTitle, pageURL } = menuItem;
                    return (
                        <MenuItem key={id} onClick={() => handleMenuClick(pageURL)}>
                            {menuTitle}
                        </MenuItem>
                    );
                })
            ]
        }
        
    }

    const renderButton = () => {
        if (state) {
            return [
                isLoggedInMenu.map(menuItem => {
                    const { id, menuTitle, pageURL } = menuItem;
                    return (
                        <Button key={id} onClick={() => handleButtonClick(pageURL)}>
                            {menuTitle}
                        </Button>
                    );

                }),
                <Button Button onClick={() => handleMenuLogout()}> Logout</Button >
            ]
        } else {
            return [
                isLoggedOutMenu.map(menuItem => {
                    const { id, menuTitle, pageURL } = menuItem;
                    return (
                        <Button key={id} onClick={() => handleButtonClick(pageURL)}>
                            {menuTitle}
                        </Button>
                    );
                })
            ]
        }
    }
    

    return (
        <div className={classes.root}>
            <Scroll showBelow={300} />
            <AppBar position="fixed" color='default' >
                <Toolbar>
                    <Typography className={classes.title}>
                        <Link href="/">▲⚬▲⚬</Link>
                    </Typography>
                    <div>
                        { isMobile ? (   
                            <>
                                <IconButton 
                                    edge="start" 
                                    className={classes.menuButton} 
                                    color="inherit" 
                                    aria-label="menu"
                                    onClick={handleMenu}>
                                    <MenuIcon />
                                </IconButton>

                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    {renderMenu()}
                                
                                </Menu>
                        </>
                        ) : (
                            <>
                                {renderButton()}
                            </>
                            
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </div>
    );
}

export default withRouter(Navbar)