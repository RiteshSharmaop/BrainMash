
import Home from "./Components/Home"
import LoginPage from "./Pages/LoginPage"
import SignupPage from "./Pages/SignupPage"
import { Route, Routes } from 'react-router-dom'


function App() {
  return (

    <>
      <Routes>
        {/* <Route path='/' element= {<Home/>} /> */}
        <Route path='/login' element= {<LoginPage/>}/>
        <Route path='/register' element= {<SignupPage/>}/>
        <Route path='/chat' element={<Home />} />
      </Routes>
      
    </>
  )
}

export default App
