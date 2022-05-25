import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { Divider, Space, Card, Spin, message } from 'antd'
import { FireFilled, FireOutlined, FireTwoTone, CopyOutlined } from '@ant-design/icons';
import { useReward } from 'react-rewards'
import { BACKEND_URL, FRONTEND_URL, MSG_TYPE, OWNER } from '../shared/constants.js'
import GameBoard from './GameBoard.js'
import Button from './Button.js'
import Rules from './Rules.js'
import { FINAL_PINK, FINAL_BLUE } from '../shared/constants.js'

const BASE_URL = FRONTEND_URL

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
    const [boxes, setBoxes] = useState([])
    const [isGameOver, setIsGameOver] = useState(false)

    useEffect(() => {
        const getGameInfo = async () => {
            try {
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
                setGameInfo({
                    rows, cols, isPlayer1
                })
                setPlayer1Name(p1Name)
                setPlayer2Name(p2Name)
                const socket = io(BACKEND_URL)
                socket.emit(MSG_TYPE.JOIN_ROOM, { room: gameId })
                socket.emit(MSG_TYPE.PLAYER_JOINED, {
                    room: gameId,
                    isPlayer1,
                    username: isPlayer1 ? p1Name : p2Name,
                })
                socket.on(MSG_TYPE.JOIN_ROOM, ({ hLines, vLines, boxes, isPlayer1Turn }) => {
                    setHLines(hLines)
                    setVLines(vLines)
                    setBoxes(boxes)
                    setIsPlayer1Turn(isPlayer1Turn)
                })
                socket.on(MSG_TYPE.PLAYER_JOINED, ({ username, isPlayer1 }) => {
                    if (!isPlayer1 && !player2Name) {
                        setPlayer2Name(username)
                    }
                })
                socket.on(MSG_TYPE.CLICK_HORIZONTAL, ({ hLines: newHLines, boxes: newBoxes, isPlayer1Turn: newIsPlayer1Turn }) => {
                    console.log('newHLines', newHLines, 'newIsPlayer1Turn', newIsPlayer1Turn)
                    setHLines(newHLines)
                    setBoxes(newBoxes)
                    setIsPlayer1Turn(newIsPlayer1Turn)
                    setClickCooldown(false)
                })
                socket.on(MSG_TYPE.CLICK_VERTICAL, ({ vLines: newVLines, boxes: newBoxes, isPlayer1Turn: newIsPlayer1Turn }) => {
                    console.log('newVLines', newVLines, 'newIsPlayer1Turn', newIsPlayer1Turn)
                    setVLines(newVLines)
                    setBoxes(newBoxes)
                    setIsPlayer1Turn(newIsPlayer1Turn)
                    setClickCooldown(false)
                })
                setSocket(socket)
            } catch (e) {
                if (e.response) {
                    const { error } = e.response.data
                    console.log(e)
                    if (error) {
                        alert(error)
                    }
                }
            }
        }
        getGameInfo()
    }, [gameId, player2Name])

    const { rows, cols, isPlayer1 } = gameInfo

    const isMyTurn = () => isPlayer1 === isPlayer1Turn

    /**
     * The current player clicks on a horizontal line.
     */
    const clickHLine = (row, col) => {
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
    
    if (!player1Name || !hLines || hLines.length === 0 || !vLines || vLines.length === 0 || !boxes || boxes.length === 0) {
        return (
            <Space>
                <Spin size='large' />
            </Space>
        )
    }

    if (!player2Name) {
        const url = `/join/${gameId}`
        return (
            <div className='blue-bg center-box-layout'>
                <Card style={{ textAlign: 'center' }}>
                    <h2>Waiting for player 2...</h2>
                    <br />
                    <p>Invite them to join with this link:</p>
                    <Button icon={<CopyOutlined />} 
                        text="Copy Link" 
                        onClick={() => {
                            navigator.clipboard.writeText(BASE_URL + url)
                            message.success('Link copied!', 2)
                        }}>
                    </Button>
                </Card>
            </div>
        )
    }

    const allBoxes = boxes.flat()
    const player1BoxCount = allBoxes.filter(owner => owner === OWNER.PLAYER_1).length
    const player2BoxCount = allBoxes.filter(owner => owner === OWNER.PLAYER_2).length
    if (!isGameOver && (
        player1BoxCount * 2 > allBoxes.length || 
        player2BoxCount * 2 > allBoxes.length || 
        player1BoxCount + player2BoxCount === allBoxes.length)) {
        setIsGameOver(true)
    }

    return (
        <div className={isPlayer1 ? 'blue-bg center-box-layout' : 'pink-bg center-box-layout'}>
            <Rules />
            <div id="animate"></div>
            <div>
                <Card>
                    <span className='game-title'>
                        <h2 style={{ color: FINAL_BLUE, fontWeight: '700' }}>
                            {player1Name}
                        </h2> 
                        <p>vs</p>
                        <h2 style={{ color: FINAL_PINK, fontWeight: '700' }}>
                            {player2Name}
                        </h2> 
                    </span>
                    <div>
                        <GameBoard
                            rows={rows}
                            cols={cols}
                            hLines={hLines} 
                            vLines={vLines}
                            boxes={boxes}
                            isPlayer1={isPlayer1}
                            canClick={isMyTurn() && !clickCooldown && !isGameOver} 
                            clickHLine={clickHLine}
                            clickVLine={clickVLine}
                        />
                        <div style={{ textAlign: 'center' }}>
                            {isGameOver ? (
                                <GameOver 
                                    player1BoxCount={player1BoxCount}
                                    player2BoxCount={player2BoxCount}
                                    player1Name={player1Name}
                                    player2Name={player2Name}
                                    isPlayer1={isPlayer1}
                                />
                            ) : (
                                <p>
                                    { isPlayer1Turn ? 
                                        <span style={{color: FINAL_BLUE, fontWeight: '700'}}>
                                            {player1Name}
                                        </span> : 
                                        <span style={{color: FINAL_PINK, fontWeight: '700'}}>
                                            {player2Name}
                                        </span>
                                    }
                                    's turn!
                                </p>
                            )}
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Space direction='vertical' size='medium' align='center'>
                            <div>
                                <Divider plain><strong style={{ fontSize: '0.8em' }}>GAME STATUS</strong></Divider>
                                <p>
                                    { player1BoxCount > player2BoxCount ? 
                                        <FireFilled style={{ color: FINAL_BLUE }}/> : 
                                    player1BoxCount === player2BoxCount ? 
                                        <FireTwoTone twoToneColor={FINAL_BLUE}/> :
                                        <FireOutlined style={{ color: FINAL_BLUE }} />
                                    }
                                    {' '}
                                    <span style={{color: FINAL_BLUE, fontWeight: '700'}}>
                                        {player1Name}
                                    </span> 
                                    {' '}controls <strong>{player1BoxCount}</strong> boxes
                                </p>
                                <p>
                                    { player2BoxCount > player1BoxCount ? 
                                        <FireFilled style={{ color: FINAL_PINK }}/> : 
                                    player2BoxCount === player1BoxCount ? 
                                        <FireTwoTone twoToneColor={FINAL_PINK}/> :
                                        <FireOutlined style={{ color: FINAL_PINK }} />
                                    }
                                    {' '}
                                    <span style={{color: FINAL_PINK, fontWeight: '700'}}>
                                        {player2Name}
                                    </span>
                                    {' '}controls <strong>{player2BoxCount}</strong> boxes
                                </p>
                            </div>
                        </Space>
                    </div>
                </Card>
            </div>
        </div>
    )
}

const GameOver = ({ player1BoxCount, player2BoxCount, player1Name, player2Name, isPlayer1 }) => {    
    let winner
    let winnerColor
    let rewardParams

    const winReward = { 
        rewardId: 'winReward', 
        rewardType: 'confetti', 
        rewardConfig: { zIndex: 3 } 
    }
    const lossReward = { 
        rewardId: 'lossReward', rewardType: 'emoji', rewardConfig: {
            emoji: ['😭', '😞', '😢', '😥', '😡'],
            zIndex: 3
        } 
    }
    const drawReward = { 
        rewardId: 'drawReward', 
        rewardType: 'emoji',
        rewardConfig: {
            emoji: ['😕', '😐', '🤷‍♀️', '👌', '😶'],
            zIndex: 3
        } 
    }

    if (player1BoxCount > player2BoxCount) {
        winner = player1Name
        winnerColor = FINAL_BLUE
        rewardParams = isPlayer1 ? winReward : lossReward
    } else if (player2BoxCount > player1BoxCount) {
        winner = player2Name
        winnerColor = FINAL_PINK
        rewardParams = isPlayer1 ? lossReward : winReward
    } else {
        rewardParams = drawReward
    }

    const { rewardId, rewardType, rewardConfig } = rewardParams
    const { reward } = useReward(rewardId, rewardType, rewardConfig)

    useEffect(() => reward(), [])

    if (winner) {
        return (
            <div>
                <p>
                    <span id={rewardId} style={{color: winnerColor, fontWeight: '700'}}>{winner}</span>
                    {' '}wins!
                </p>
            </div>
        )
    }
    return (
        <div>
            <p>It's a <span id='rewardId' style={{fontWeight: '700'}}>draw</span>!</p>
        </div>
    )
}

export default Game