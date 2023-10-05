import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ButtonLink = ({ to, label }) => {
  const navigate = useNavigate()
  return (
    <Button onClick={() => navigate(to)} variant='text'>
      {label}
    </Button>
  )
}

export default ButtonLink
