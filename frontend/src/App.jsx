import React, { useEffect } from 'react'
import { Navigate, Route,Routes } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Settingspage from "./Pages/Settingspage"
import ProfilePage from "./Pages/ProfilePage"
import HomePage from "./Pages/HomePage"
import SignUpPage from "./Pages/SignUpPage"
import LoginPage from "./Pages/LoginPage"
import { useAuthStore } from "./store/useAuthStore.js"
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
import { useThemeStore } from "./store/useThemeStore.js"

function App() {

  const { authUser, checkAuth ,isCheckingAuth} = useAuthStore();
  const {theme} =useThemeStore()
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});

  if(isCheckingAuth && !authUser) return <div className="flex items-center justify-center h-screen">
    <Loader className="size-10 animate-spin"/>
  </div>

  // useEffect(() => {
  //   document.documentElement.setAttribute("data-theme", theme);
  // }, [theme]);

  return (
    <div data-theme={theme}>
      <Navbar/>

      <Routes>
        <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser?<SignUpPage/>:<Navigate to="/"/>} />
        <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/" />}/>
        <Route path="/settings" element={<Settingspage/>}/>
        <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>

      </Routes>

      <Toaster />
    </div>
  )
}

export default App