import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from './Button.js'
import Input from './Input.js'

const Signup = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    return (
        <div>
            <div>
                <h3 className='title is-3'>Sign Up</h3>
                <p>Username:</p>
                <Input value={username} setInput={setUsername} />
                <p>Password:</p>
                <Input value={password} setInput={setPassword} />
                </div>
            <div>
                <Button text='Sign up' onClick={async () => {
                    const res = await axios.post('/account/signup', { username, password })
                    const { error } = res.data
                    if (error) {
                        alert(error)
                    } else {
                        navigate('/login')
                    }
                }}/>
                <p>
                    Already have an account?&nbsp;
                    <Link to='/login' >Log in</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup