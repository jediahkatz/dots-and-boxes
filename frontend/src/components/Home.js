import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button.js'
import { Card } from 'antd'

const Home = () => {
    const navigate = useNavigate()
    const createGame = async () => {
        const res = await axios.post(
            '/game/create', 
            { rows: 3, cols: 3 }, 
            { headers: {
                'x-auth-token': sessionStorage.getItem('token'),
                'content-type': 'application/json'
            }}
        )
        const { error, gameId } = res.data
        if (error) {
            return console.log(error)
        }
        navigate(`/game/${gameId}`)
    }

    return (
        <div className="home-bg center-box-layout">
            <Card 
                style={{ textAlign: 'center' }}
                actions={[
                    <a href='/login'><div>Log in</div></a>,
                    <a href='/logout'><div>Log out</div></a>,
                ]}
            >
                <div style={{ padding: '30px' }}>
                    <h2>Dots and Boxes</h2>
                    <br />
                    <Button text='New game' onClick={createGame}/>
                </div>
            </Card>
        </div>
    )
}

export default Home