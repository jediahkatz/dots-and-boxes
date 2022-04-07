import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

const Home = () => {
    const navigate = useNavigate()

    const createGame = async () => {
        const res = await axios.post('/game/create', { rows: 3, cols: 3 })
        const { error, gameId } = res.data
        if (error) {
            return console.log(error)
        }
        console.log(gameId)
        navigate(`/game/${gameId}`)
    }

    return (
        <div>
            <Button text='Create game' onClick={createGame}/>
        </div>
    )
}

export default Home