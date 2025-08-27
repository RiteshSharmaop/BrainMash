
import Home from "./Components/Home"
import LoginPage from "./Pages/LoginPage"
import SignupPage from "./Pages/SignupPage"
import { Navigate, Route, Routes } from 'react-router-dom'
import UserProtectedWrapper from "./Pages/UserProtectedWrapper"
import Loading from "./Components/Loading"
import Payment from "./Components/Payment/Payment"
import { useState } from "react"


function App() {
  const [paymentDone, setPaymentDone] = useState(false);
  return (

    <>
      <Routes>
        <Route path='/' element= {<Navigate to="/login" replace />} />

        <Route path='/login' element= {<LoginPage/>}/>
        <Route path='/register' element= {<SignupPage/>}/>
        <Route path='/chat' element={
          <UserProtectedWrapper>
            <Home paymentDone={paymentDone} setPaymentDone={setPaymentDone}  />
          </UserProtectedWrapper>
        } />
      <Route
        path="/payment"
        element={<Payment setPaymentDone={setPaymentDone} />}
      />
      </Routes>
      
    </>
  )
}

export default App
