import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        sessionStorage.removeItem('token')
        navigate('/login')
    })

    return (<div></div>)
}

export default Logout