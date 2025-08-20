import './App.css'
import { Routes, Route, Navigate, Outlet } from 'react-router'
import { Login } from './pages/Login'
import axios from 'axios'
import { useNavigate } from 'react-router'
import type React from 'react'
import {gettoken} from './pages/api/apis'
import { Detail } from './pages/Detail'

axios.defaults.baseURL="http://192.168.20.21:8080/api/v1"

function App() {
  const navigate = useNavigate()

  const ProtectRoute = () => {
    const t = gettoken()
    if (!t) {
      return <Navigate to='/login' replace/>;
    }

    return <Outlet/>;
  }

  return (
    <>
      <Routes>
        <Route path='/login' Component={Login}/>

        <Route element={ProtectRoute()}>
          <Route path='/detail' Component={Detail}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
