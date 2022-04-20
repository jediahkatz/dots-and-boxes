import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RequireAuth = ({ children }) => {
    const [isAuthed, setIsAuthed] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(
                    `/account/isAuthenticated`, 
                    { headers: {
                        'x-auth-token': localStorage.getItem('token'),
                        'content-type': 'application/json'
                    }}
                )
                const { isAuthenticated } = res.data
                if (!isAuthenticated) {
                    navigate('/login')
                } else {
                    setIsAuthed(true)
                }
            } catch (e) {
                navigate('/login')
            }
        }
        checkAuth()
    }, [])

    console.log(isAuthed)

    return isAuthed ? children : <p>bro...</p>
}

export default RequireAuth