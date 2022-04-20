import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from './Button.js'
import Input from './Input.js'
import { Space, Card } from 'antd'
import { FINAL_PINK } from '../shared/constants.js'

const Signup = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    return (
        <div className="pink-bg center-box-layout">
            <div>
                <Card title="Sign Up" style={{textAlign: 'center'}}>
                    <Space direction="vertical" size="large">
                        <Space direction="vertical" size="middle">
                            <Input label="Username" value={username} setInput={setUsername} />
                            <Input label="Password" value={password} setInput={setPassword} />
                        </Space>
                        <Space direction="vertical" size="middle">
                            <Button text='Sign Up' onClick={async () => {
                                const signupRes = await axios.post('/account/signup', { username, password })
                                const { error: signupError } = signupRes.data
                                if (signupError) {
                                    alert(signupError)
                                } else {
                                    const loginRes = await axios.post('/account/login', { username, password })
                                    const { error: loginError } = loginRes.data
                                    if (loginError) {
                                        navigate('/login')
                                        console.log(loginError)
                                    } else {
                                        navigate('/')
                                    }
                                }
                            }}/>
                            <p>
                                Already have an account?&nbsp;
                                <Link to='/login' style={{ color: FINAL_PINK }}>Log In</Link>
                            </p>
                        </Space>
                    </Space>
                </Card>
            </div>
        </div>
    )
}

export default Signup