import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from './Button.js'
import Input from './Input.js'
import { Space, Card, message } from 'antd'
import { FINAL_BLUE } from '../shared/constants.js'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { state } = useLocation()

    const doLogin = async () => {
        try {
            const res = await axios.post('/account/login', { username, password })
            const { error, token } = res.data
            if (error) {
               message.error(error, 5)
            } else {
                sessionStorage.setItem('token', token)
                navigate(state?.path || '/')
            }
        } catch (e) {
            const { error } = e.response.data
            message.error(error, 5)
        }
    }
    
    const doPlayAsGuest = async () => {
        try {
            const res = await axios.post('/account/guest')
            const { error, token } = res.data
            if (error) {
                message.error(error, 5)
            } else {
                sessionStorage.setItem('token', token)
                navigate(state?.path || '/')
            }
        } catch (e) {
            console.log(e)
            const { error } = e.response.data
            message.error(error, 5)
        }
    }

    return (
        <div className="blue-bg center-box-layout">
            <div>
                <Card title="Log in" style={{textAlign: 'center'}}>
                    <Space direction="vertical" size="large">
                        <Space direction="vertical" size="middle">
                            <Input label="Username" value={username} setInput={setUsername} />
                            <Input label="Password" value={password} setInput={setPassword} />
                        </Space>
                        <Space direction="vertical" size="middle">
                            <span>
                                <Button text='Log in' onClick={() => doLogin({ username, password })}/>
                                &nbsp;&nbsp;
                                <Button text='Play as guest' type='primary' onClick={doPlayAsGuest}/>
                            </span>
                            <p>
                                Don't have an account?&nbsp;
                                <Link to='/signup' style={{ color: FINAL_BLUE }} replace state={{ path: state?.path }}>Sign up</Link>
                            </p>
                        </Space>
                    </Space>
                </Card>
            </div>
        </div>
    )
}

export default Login