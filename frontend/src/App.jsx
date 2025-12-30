import { useState } from 'react'
import "./index.css"
import {BrowserRouter as Router,Routes,Route, Link} from "react-router-dom"
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Navbar from './pages/Navbar.jsx'
import Home from './pages/Home.jsx'  
import Counseling from './pages/Counseling.jsx'    // Fixed typo from 'home.jsx' to 'Home.jsx'      
import Footer from './components/Footer.jsx'

function App() {

  return (
    <>
     <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path="/counselling" element={<Counseling />}/>
      </Routes>
      <Footer />
     </Router>

    </>
  )
}

export default App
