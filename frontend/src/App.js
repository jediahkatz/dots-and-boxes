import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'
import Game from './components/Game.js'
import Home from './components/Home.js'
import Login from './components/Login.js'
import Signup from './components/Signup.js'
import JoinGame from './components/JoinGame.js'
import 'antd/dist/antd.css';
import "./styles.css"

const App = () => {
  return (
    <Router>
      <div style={{fontFamily: '\'Raleway\', sans-serif'}}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/join/:id' element={<JoinGame />} />
          <Route path='/game/:id' element={<Game />} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
