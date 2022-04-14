import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { OWNER, MSG_TYPE } from '../shared/constants.js'
import { io } from 'socket.io-client'
import GameBoard from './GameBoard.js'

const Game = () => {
    const { id: gameId } = useParams()
    const [gameInfo, setGameInfo] = useState({})
    const [player1Name, setPlayer1Name] = useState('')
    const [player2Name, setPlayer2Name] = useState('')
    const [socket, setSocket] = useState(null)
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(false)
    const [clickCooldown, setClickCooldown] = useState(false)
    const [hLines, setHLines] = useState([])
    const [vLines, setVLines] = useState([])

    useEffect(() => {
        const getGameInfo = async () => {
            const res = await axios.get(
                `/game/info/${gameId}`, 
                { headers: {
                    'x-auth-token': sessionStorage.getItem('token'),
                    'content-type': 'application/json'
                }}
            )
            const { error, rows, cols, isPlayer1, player1Name, player2Name } = res.data
            if (error) {
                return console.log(error)
            }
            console.log('this is happening??')
            setGameInfo({
                rows, cols, isPlayer1
            })
            setPlayer1Name(player1Name)
            setPlayer2Name(player2Name)
            setHLines([...Array(rows+1)].map(_ => Array(cols).fill(OWNER.NO_ONE)))
            setVLines([...Array(rows)].map(_ => Array(cols+1).fill(OWNER.NO_ONE)))
    
            const socket = io('http://localhost:3000')
            socket.emit(MSG_TYPE.JOIN_ROOM, { room: gameId })
            socket.emit(MSG_TYPE.PLAYER_JOINED, {
                room: gameId,
                isPlayer1,
                username: isPlayer1 ? player1Name : player2Name,
            })
            socket.on(MSG_TYPE.PLAYER_JOINED, ({ username, isPlayer1 }) => {
                if (!isPlayer1 && !player2Name) {
                    setPlayer2Name(username)
                }
            })
            socket.on(MSG_TYPE.CLICK_HORIZONTAL, ({ newHLines, newIsPlayer1Turn }) => {
                setHLines(newHLines)
                setIsPlayer1Turn(newIsPlayer1Turn)
                setClickCooldown(false)
            })
            socket.on(MSG_TYPE.CLICK_VERTICAL, ({ newVLines, newIsPlayer1Turn }) => {
                setVLines(newVLines)
                setIsPlayer1Turn(newIsPlayer1Turn)
                setClickCooldown(false)
            })
            setSocket(socket)
        }
        getGameInfo()
    }, [gameId])

    const { rows, cols, isPlayer1 } = gameInfo

    const isMyTurn = () => isPlayer1 === isPlayer1Turn

    /**
     * The current player clicks on a horizontal line.
     */
    const clickHLine = (row, col) => {
        if (isMyTurn()) {
            throw Error('Not your turn')
        }
        if (clickCooldown) {
            return
        }
        if (hLines[row][col]) {
            // Already owned by someone
            return
        }
        setClickCooldown(true)
        socket.emit(MSG_TYPE.CLICK_HORIZONTAL, { room: gameId, row, col })
    }

    /**
     * The current player clicks on a vertical line.
     */
    const clickVLine = (row, col) => {
        if (isMyTurn()) {
            throw Error('Not your turn')
        }
        if (clickCooldown) {
            return
        }
        if (vLines[row][col]) {
            // Already owned by someone
            return
        }
        setClickCooldown(true)
        socket.emit(MSG_TYPE.CLICK_VERTICAL, { room: gameId, row, col })
    }

    if (!player1Name) {
        return (
            <div>
                Loading!...
            </div>
        )
    }

    if (!player2Name) {
        return (
            <div>
                Waiting for player 2...
            </div>
        )
    }

    return (
        <div>
            {player1Name} vs {player2Name}
            <GameBoard 
                rows={rows}
                cols={cols}
                hLines={hLines} 
                vLines={vLines}
                isPlayer1={isPlayer1}
                canClick={isMyTurn() && !clickCooldown} 
                clickHLine={clickHLine}
                clickVLine={clickVLine}
            />
        </div>
    )
}

export default Game