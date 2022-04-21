import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const RequireAuth = ({ children }) => {
    const [isAuthed, setIsAuthed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(
                    `/account/isAuthenticated`, 
                    { headers: {
                        'x-auth-token': sessionStorage.getItem('token'),
                        'content-type': 'application/json'
                    }}
                )
                const { isAuthenticated } = res.data
                if (!isAuthenticated) {
                    navigate('/login', { replace: true, state: { path: location.pathname }})
                } else {
                    setIsAuthed(true)
                }
            } catch (e) {
                navigate('/login', { replace: true, state: { path: location.pathname }})
            }
        }
        checkAuth()
    }, [])

    return isAuthed ? children : <p>Loading...</p>
}

export default RequireAuth