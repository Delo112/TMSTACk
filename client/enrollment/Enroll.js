
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import {create} from './api-enrollment'
import auth from './../auth/auth-helper'
import {Redirect} from 'react-router-dom'

const CustomDiv = styled('div')(({ theme }) => ({
    form: {
        minWidth: 500
    }
}))

export default function Enroll(props) {
  const classes = useStyles()
  const [values, setValues] = useState({
    enrollmentId: '',
    error: '',
    redirect: false
  })
  const jwt = auth.isAuthenticated()
  const clickEnroll = () => {
    create({
      courseId: props.courseId
    }, {
      t: jwt.token
    }).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, enrollmentId: data._id, redirect: true})
      }
    })
  }

    if(values.redirect){
        return (<Redirect to={'/learn/'+values.enrollmentId}/>)
    }

  return (
      <Button variant="contained" color="secondary" onClick={clickEnroll}> Enroll </Button>
  )
}

Enroll.propTypes = {
  courseId: PropTypes.string.isRequired
}
