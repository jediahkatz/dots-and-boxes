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

const handleClickHorizontal = (io, _socket) => ({ room, row, col }) => {
    console.log(`click horizontal: ${room} (${row}, ${col})`)
    if (!(room in games)) {
        throw Error('Game does not exist!')
    }
    const { hLines, vLines, boxes, isPlayer1Turn } = games[room]
    const owner = isPlayer1Turn ? OWNER.PLAYER_1 : OWNER.PLAYER_2
    hLines[row][col] = owner
    if (row < boxes.length && isBoxCaptured({ row, col, hLines, vLines })) {
        boxes[row][col] = owner
    }
    if (row-1 >= 0 && isBoxCaptured({ row: row-1, col, hLines, vLines })) {
        boxes[row-1][col] = owner
    }
    games[room].isPlayer1Turn = !isPlayer1Turn
    io.to(room).emit(MSG_TYPE.CLICK_HORIZONTAL, { hLines, boxes, isPlayer1Turn: games[room].isPlayer1Turn })
}

const handleClickVertical = (io, _socket) => ({ room, row, col }) => {
    console.log(`click vertical: ${room} (${row}, ${col})`)
    if (!(room in games)) {
        throw Error('Game does not exist!')
    }
    const { vLines, hLines, boxes, isPlayer1Turn } = games[room]
    const owner = isPlayer1Turn ? OWNER.PLAYER_1 : OWNER.PLAYER_2
    vLines[row][col] = owner
    if (col < boxes[0].length && isBoxCaptured({ row, col, hLines, vLines })) {
        boxes[row][col] = owner
    }
    if (col-1 >= 0 && isBoxCaptured({ row, col: col-1, hLines, vLines })) {
        boxes[row][col-1] = owner
    }
    games[room].isPlayer1Turn = !isPlayer1Turn
    io.to(room).emit(MSG_TYPE.CLICK_VERTICAL, { vLines, boxes, isPlayer1Turn: games[room].isPlayer1Turn })
}

const gameServer = io => socket => {
    socket.on(MSG_TYPE.JOIN_ROOM, handleJoinRoom(io, socket))
    socket.on(MSG_TYPE.PLAYER_JOINED, handlePlayerJoined(io, socket))
    socket.on(MSG_TYPE.CLICK_HORIZONTAL, handleClickHorizontal(io, socket))
    socket.on(MSG_TYPE.CLICK_VERTICAL, handleClickVertical(io, socket))
}

export default gameServer