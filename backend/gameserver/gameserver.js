import { MSG_TYPE } from '../../frontend/src/shared/constants.js'

export const handleJoinRoom = (socket) => {
    socket.on(MSG_TYPE.JOIN_ROOM, ({ room }) => {
        console.log('joining room ' + room)
        socket.join(room)
    })
}