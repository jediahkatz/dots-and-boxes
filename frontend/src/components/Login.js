import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import Button from './Button'
import Input from './Input'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    return (
        <div>
            <div>
                <h3 className='title is-3'>Log In</h3>
                <p>Username:</p>
                <Input value={username} setInput={setUsername} />
                <p>Password:</p>
                <Input value={password} setInput={setPassword} />
                </div>
            <div>
                <Button text='Login' onClick={async () => {
                    const res = await axios.post('/account/login', { username, password })
                    const { error } = res.data
                    if (error) {
                        alert(error)
                    } else {
                        navigate('/')
                    }
                }}/>
                <p>
                    Don't have an account?&nbsp;
                    <Link to='/signup' >Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login