import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from './Button.js'
import Input from './Input.js'
import { Space, Card } from 'antd'
import { FINAL_BLUE } from '../shared/constants.js'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    return (
        <div className="blue-bg center-box-layout">
            <div>
                <Card title="Log In" style={{textAlign: 'center'}}>
                    <Space direction="vertical" size="large">
                        <Space direction="vertical" size="middle">
                            <Input label="Username" value={username} setInput={setUsername} />
                            <Input label="Password" value={password} setInput={setPassword} />
                        </Space>
                        <Space direction="vertical" size="middle">
                            <Button text='Log In' onClick={async () => {
                                const res = await axios.post('/account/login', { username, password })
                                const { error, token } = res.data
                                if (error) {
                                    alert(error)
                                } else {
                                    localStorage.setItem('token', token)
                                    navigate('/')
                                }
                            }}/>
                            <p>
                                Don't have an account?&nbsp;
                                <Link style={{ color: FINAL_BLUE }} to='/signup' >Sign Up</Link>
                            </p>
                        </Space>
                    </Space>
                </Card>
            </div>
        </div>
    )
}

export default Login