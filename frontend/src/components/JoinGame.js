import axios from 'axios'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const JoinGame = () => {
    const { id: gameId } = useParams()
    const navigate = useNavigate()

    const joinGame = async () => {
        const res = await axios.post(
            `/game/join/${gameId}`, 
            { rows: 3, cols: 3 }, 
            { headers: {
                'x-auth-token': sessionStorage.getItem('token'),
                'content-type': 'application/json'
            }}
        )
        const { error } = res.data
        if (error) {
            return console.log(error)
        }
        navigate(`/game/${gameId}`)
    }

    joinGame()

    return (
        <div>
            TODO: error msg goes here
        </div>
    )
}

export default JoinGame