import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Game = () => {
    const { id: gameId } = useParams()
    const [gameInfo, setGameInfo] = useState({})

    const getGameInfo = async () => {
        const res = await axios.get(
            `/game/info/${gameId}`, 
            { headers: {
                'x-auth-token': sessionStorage.getItem('token'),
                'content-type': 'application/json'
            }}
        )
        const { error, rows, cols, isPlayer1, player1, player2 } = res.data
        if (error) {
            return console.log(error)
        }
        setGameInfo({ rows, cols, isPlayer1, player1, player2 })
    }

    useEffect(() => {
        getGameInfo()
    }, [setGameInfo])

    const { rows, cols, isPlayer1, player1, player2 } = gameInfo
    console.log(gameInfo)

    if (!player1) {
        return (
            <div>
                Loading!...
            </div>
        )
    }

    if (!player2) {
        return (
            <div>
                Waiting for player 2...
            </div>
        )
    }

    return (
        <div>
            All players joined! Starting...
        </div>
    )
}

export default Game