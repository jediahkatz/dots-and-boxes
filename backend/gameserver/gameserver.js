import { MSG_TYPE, OWNER } from '../../frontend/src/shared/constants.js'
import Game from '../models/game.js'
import User from '../models/user.js'

const games = {}

const handleJoinRoom = (_io, socket) => ({ room }) => {
    console.log('joining room ' + room)
    socket.join(room)
    const rows = 3
    const cols = 3
    if (!(room in games)) {
        games[room] = { 
            hLines: [...Array(rows+1)].map(_ => Array(cols).fill(OWNER.NO_ONE)),
            vLines: [...Array(rows)].map(_ => Array(cols+1).fill(OWNER.NO_ONE)),
            boxes: [...Array(rows)].map(_ => Array(cols).fill(OWNER.NO_ONE)),
            isPlayer1Turn: true,
        }
    }
    const { hLines, vLines, boxes, isPlayer1Turn } = games[room]
    socket.emit(MSG_TYPE.JOIN_ROOM, { hLines, vLines, boxes, isPlayer1Turn })
}

const handlePlayerJoined = (io, _socket) => ({ room, username, isPlayer1 }) => {
    console.log(`player joined! ${username} ${isPlayer1}`)
    io.to(room).emit(MSG_TYPE.PLAYER_JOINED, { username, isPlayer1 })
}

const isBoxCaptured = ({ row, col, hLines, vLines }) => (
    hLines[row][col] !== OWNER.NO_ONE   &&
    hLines[row+1][col] !== OWNER.NO_ONE &&
    vLines[row][col] !== OWNER.NO_ONE   &&
    vLines[row][col+1] !== OWNER.NO_ONE
)

const isGameCompleted = ({ boxes }) => {
    const allBoxes = boxes.flat()
    const player1BoxCount = allBoxes.filter(owner => owner === OWNER.PLAYER_1).length
    const player2BoxCount = allBoxes.filter(owner => owner === OWNER.PLAYER_2).length

    let winner = null
    if (player1BoxCount * 2 > allBoxes.length) {
        winner = OWNER.PLAYER_1
    } else if (player2BoxCount * 2 > allBoxes.length) {
        winner = OWNER.PLAYER_2
    } else if (player1BoxCount + player2BoxCount === allBoxes.length) {
        winner = OWNER.NO_ONE
    }
    return { completed: winner !== null, winner, player1BoxCount, player2BoxCount }
}

const setGameCompleted = async ({ gameId, winner, player1BoxCount, player2BoxCount }) => {
    delete games[gameId]

    console.log('game over!')
    const game = await Game.findById(gameId)
    game.completed = true
    game.player1BoxCount = player1BoxCount
    game.player2BoxCount = player2BoxCount
    game.save()

    const player1 = await User.findById(game.player1)
    const player2 = await User.findById(game.player2)
    if (winner === OWNER.PLAYER_1) {
        player1.wins += 1
        player2.losses += 1
    } else if (winner === OWNER.PLAYER_2) {
        player1.losses += 1
        player2.wins += 1
    } else {
        player1.draws += 1
        player2.draws += 1
    }
    player1.save()
    player2.save()

}

const handleClickHorizontal = (io, _socket) => ({ room, row, col }) => {
    console.log(`click horizontal: ${room} (${row}, ${col})`)
    if (!(room in games)) {
        throw Error('Game does not exist!')
    }
    const { hLines, vLines, boxes, isPlayer1Turn } = games[room]
    const owner = isPlayer1Turn ? OWNER.PLAYER_1 : OWNER.PLAYER_2
    hLines[row][col] = owner

    let didCapture = false
    if (row < boxes.length && isBoxCaptured({ row, col, hLines, vLines })) {
        boxes[row][col] = owner
        didCapture = true
    }
    if (row-1 >= 0 && isBoxCaptured({ row: row-1, col, hLines, vLines })) {
        boxes[row-1][col] = owner
        didCapture = true
    }

    const { completed, winner, player1BoxCount, player2BoxCount } = isGameCompleted({ boxes })

    games[room].isPlayer1Turn = didCapture ? isPlayer1Turn : !isPlayer1Turn
    io.to(room).emit(MSG_TYPE.CLICK_HORIZONTAL, { hLines, boxes, isPlayer1Turn: games[room].isPlayer1Turn })

    if (completed) {
        setGameCompleted({ gameId: room, winner, player1BoxCount, player2BoxCount })
    }
}

const handleClickVertical = (io, _socket) => ({ room, row, col }) => {
    console.log(`click vertical: ${room} (${row}, ${col})`)
    if (!(room in games)) {
        throw Error('Game does not exist!')
    }
    const { vLines, hLines, boxes, isPlayer1Turn } = games[room]
    const owner = isPlayer1Turn ? OWNER.PLAYER_1 : OWNER.PLAYER_2
    vLines[row][col] = owner

    let didCapture = false
    if (col < boxes[0].length && isBoxCaptured({ row, col, hLines, vLines })) {
        boxes[row][col] = owner
        didCapture = true
    }
    if (col-1 >= 0 && isBoxCaptured({ row, col: col-1, hLines, vLines })) {
        boxes[row][col-1] = owner
        didCapture = true
    }

    const { completed, winner, player1BoxCount, player2BoxCount } = isGameCompleted({ boxes })
    
    games[room].isPlayer1Turn = didCapture ? isPlayer1Turn : !isPlayer1Turn
    io.to(room).emit(MSG_TYPE.CLICK_VERTICAL, { vLines, boxes, isPlayer1Turn: games[room].isPlayer1Turn })

    if (completed) {
        setGameCompleted({ gameId: room, winner, player1BoxCount, player2BoxCount })
    }
}

const gameServer = io => socket => {
    socket.on(MSG_TYPE.JOIN_ROOM, handleJoinRoom(io, socket))
    socket.on(MSG_TYPE.PLAYER_JOINED, handlePlayerJoined(io, socket))
    socket.on(MSG_TYPE.CLICK_HORIZONTAL, handleClickHorizontal(io, socket))
    socket.on(MSG_TYPE.CLICK_VERTICAL, handleClickVertical(io, socket))
}

export default gameServer