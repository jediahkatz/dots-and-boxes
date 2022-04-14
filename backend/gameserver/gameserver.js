import { MSG_TYPE, OWNER } from '../../frontend/src/shared/constants.js'

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
            isPlayer1Turn: true
        }
    }
}

const handlePlayerJoined = (io, _socket) => ({ room, username, isPlayer1 }) => {
    console.log(`player joined! ${username} ${isPlayer1}`)
    io.to(room).emit(MSG_TYPE.PLAYER_JOINED, { username, isPlayer1 })
}

const handleClickHorizontal = (io, _socket) => ({ room, row, col }) => {
    if (!(room in games)) {
        throw Error('Game does not exist!')
    }
    const { hLines, isPlayer1Turn } = games[room]
    hLines[row][col] = isPlayer1Turn ? OWNER.PLAYER_1 : OWNER.PLAYER_2
    games[room].isPlayer1Turn = !isPlayer1Turn
    io.to(room).emit(MSG_TYPE.CLICK_HORIZONTAL, { hLines, isPlayer1Turn: games[room].isPlayer1Turn })
}

const handleClickVertical = (io, _socket) => ({ room, row, col }) => {
    if (!(room in games)) {
        throw Error('Game does not exist!')
    }
    const { vLines, isPlayer1Turn } = games[room]
    vLines[row][col] = isPlayer1Turn ? OWNER.PLAYER_1 : OWNER.PLAYER_2
    games[room].isPlayer1Turn = !isPlayer1Turn
    io.to(room).emit(MSG_TYPE.CLICK_VERTICAL, { vLines, isPlayer1Turn: games[room].isPlayer1Turn })
}

const gameServer = io => socket => {
    socket.on(MSG_TYPE.JOIN_ROOM, handleJoinRoom(io, socket))
    socket.on(MSG_TYPE.PLAYER_JOINED, handlePlayerJoined(io, socket))
    socket.on(MSG_TYPE.CLICK_HORIZONTAL, handleClickHorizontal(io, socket))
    socket.on(MSG_TYPE.CLICK_VERTICAL, handleClickVertical(io, socket))
}

export default gameServer