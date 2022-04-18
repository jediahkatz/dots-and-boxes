import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MSG_TYPE } from '../shared/constants.js'
import { io } from 'socket.io-client'
import GameBoard from './GameBoard.js'

const Game = () => {
    const { id: gameId } = useParams()
    const [gameInfo, setGameInfo] = useState({})
    const [player1Name, setPlayer1Name] = useState('')
    const [player2Name, setPlayer2Name] = useState('')
    const [socket, setSocket] = useState(null)
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(true)
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
            const { error, rows, cols, isPlayer1, player1Name: p1Name, player2Name: p2Name } = res.data
            if (error) {
                return console.log(error)
            }
            console.log('this is happening??')
            setGameInfo({
                rows, cols, isPlayer1
            })
            setPlayer1Name(p1Name)
            setPlayer2Name(p2Name)
            const socket = io('http://localhost:3000')
            socket.emit(MSG_TYPE.JOIN_ROOM, { room: gameId })
            socket.emit(MSG_TYPE.PLAYER_JOINED, {
                room: gameId,
                isPlayer1,
                username: isPlayer1 ? p1Name : p2Name,
            })
            socket.on(MSG_TYPE.JOIN_ROOM, ({ hLines, vLines, isPlayer1Turn }) => {
                setHLines(hLines)
                setVLines(vLines)
                setIsPlayer1Turn(isPlayer1Turn)
            })
            socket.on(MSG_TYPE.PLAYER_JOINED, ({ username, isPlayer1 }) => {
                if (!isPlayer1 && !player2Name) {
                    setPlayer2Name(username)
                }
            })
            socket.on(MSG_TYPE.CLICK_HORIZONTAL, ({ hLines: newHLines, newIsPlayer1Turn }) => {
                console.log('newHLines', newHLines, 'newIsPlayer1Turn', newIsPlayer1Turn)
                setHLines(newHLines)
                setIsPlayer1Turn(newIsPlayer1Turn)
                setClickCooldown(false)
            })
            socket.on(MSG_TYPE.CLICK_VERTICAL, ({ vLines: newVLines, newIsPlayer1Turn }) => {
                console.log('newVLines', newVLines, 'newIsPlayer1Turn', newIsPlayer1Turn)
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
        console.log('turn?', isPlayer1, isPlayer1Turn, isMyTurn())
        if (!isMyTurn()) {
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
        if (!isMyTurn()) {
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
    
    if (!player1Name || !hLines || hLines.length === 0 || !vLines || vLines.length === 0) {
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
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <h2 className='title is-2'>
                    {player1Name}
                </h2> 
                <p>
                &nbsp;vs&nbsp;
                </p>
                <h2 className='title is-2'>
                    {player2Name}
                </h2> 
            </span>
            <div>
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
        </div>
    )
}

export default Game