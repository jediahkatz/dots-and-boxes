import ReactDOM from 'react-dom'
import React from 'react'
import axios from 'axios'
import App from './App.js'
import { BACKEND_URL } from './shared/constants.js'

axios.defaults.baseURL = BACKEND_URL

const app = document.getElementById('root')
ReactDOM.render(
    <App />,
    app
)