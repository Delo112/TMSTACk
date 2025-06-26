import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home'
import Library from '@mui/icons-material/LocalLibrary'
import Button from '@mui/material/Button'
import auth from './../auth/auth-helper'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const isActive = (pathname, path) => {
  return pathname === path
    ? { color: '#f57c00' }
    : { color: '#fffde7' }
}

const isPartActive = (pathname, path) => {
  return pathname.includes(path)
    ? { color: '#fffde7', backgroundColor: '#f57c00', marginRight: 10 }
    : {
        color: '#616161',
        backgroundColor: '#fffde7',
        border: '1px solid #f57c00',
        marginRight: 10,
      }
}

export default function Menu() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  return (
    <AppBar position="fixed" style={{ zIndex: 12343455 }}>
      <Toolbar>
        <Typography variant="h6" color="inherit">
          MERN Classroom
        </Typography>
        <div>
          <Link to="/">
            <IconButton aria-label="Home" style={isActive(pathname, '/')}>
              <HomeIcon />
            </IconButton>
          </Link>
        </div>
        <div style={{ position: 'absolute', right: '10px' }}>
          <span style={{ float: 'right' }}>
            {!auth.isAuthenticated() && (
              <span>
                <Link to="/signup">
                  <Button style={isActive(pathname, '/signup')}>Sign up</Button>
                </Link>
                <Link to="/signin">
                  <Button style={isActive(pathname, '/signin')}>Sign In</Button>
                </Link>
              </span>
            )}
            {auth.isAuthenticated() && (
              <span>
                {auth.isAuthenticated().user.educator && (
                  <Link to="/teach/courses">
                    <Button style={isPartActive(pathname, '/teach/')}>
                      <Library /> Teach
                    </Button>
                  </Link>
                )}
                <Link to={`/user/${auth.isAuthenticated().user._id}`}>
                  <Button style={isActive(pathname, `/user/${auth.isAuthenticated().user._id}`)}>
                    My Profile
                  </Button>
                </Link>
                <Button
                  color="inherit"
                  onClick={() => {
                    auth.clearJWT(() => navigate('/'))
                  }}
                >
                  Sign out
                </Button>
              </span>
            )}
          </span>
        </div>
      </Toolbar>
    </AppBar>
  )
}
