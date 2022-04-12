import ReactDOM from 'react-dom'
import axios from 'axios'
import App from './App.js'

axios.defaults.baseURL = 'http://localhost:3000'

const app = document.getElementById('root')
ReactDOM.render(
    <App />,
    app
)