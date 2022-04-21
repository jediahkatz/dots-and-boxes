import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'
import Game from './components/Game.js'
import Home from './components/Home.js'
import Login from './components/Login.js'
import Logout from './components/Logout.js'
import Signup from './components/Signup.js'
import JoinGame from './components/JoinGame.js'
import RequireAuth from './components/RequireAuth.js'
import 'antd/dist/antd.css';
import "./styles.css"

const App = () => {
  return (
    <Router>
      <div style={{fontFamily: '\'Raleway\', sans-serif'}}>
        <Routes>
          <Route path='/' element={<RequireAuth><Home /></RequireAuth>} />
          <Route path='/join/:id' element={<RequireAuth><JoinGame /></RequireAuth>} />
          <Route path='/game/:id' element={<RequireAuth><Game /></RequireAuth>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<RequireAuth><Logout /></RequireAuth>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
