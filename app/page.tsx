"use client"

import { useState, useEffect } from "react"
import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard"
import { PersonalInfoModal } from "@/components/personal-info-modal"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("landing") // landing, login, dashboard
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPersonalInfo, setShowPersonalInfo] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    // Check if user is logged in (in real app, check auth state)
    const loggedIn = localStorage.getItem("isLoggedIn")
    const savedUserInfo = localStorage.getItem("userInfo")

    if (loggedIn) {
      setIsLoggedIn(true)
      setCurrentPage("dashboard")
      if (savedUserInfo) {
        setUserInfo(JSON.parse(savedUserInfo))
      } else {
        setShowPersonalInfo(true)
      }
    }
  }, [])

  const handleGetStarted = () => {
    setCurrentPage("login")
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setCurrentPage("dashboard")
    localStorage.setItem("isLoggedIn", "true")

    // Check if user info exists
    const savedUserInfo = localStorage.getItem("userInfo")
    if (!savedUserInfo) {
      setShowPersonalInfo(true)
    }
  }

  const handlePersonalInfoSave = (info: any) => {
    setUserInfo(info)
    localStorage.setItem("userInfo", JSON.stringify(info))
    setShowPersonalInfo(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage("landing")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userInfo")
    setUserInfo(null)
  }

  if (currentPage === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <>
      <Dashboard userInfo={userInfo} onLogout={handleLogout} onUpdateInfo={() => setShowPersonalInfo(true)} />
      {showPersonalInfo && (
        <PersonalInfoModal
          initialInfo={userInfo}
          onSave={handlePersonalInfoSave}
          onClose={() => setShowPersonalInfo(false)}
        />
      )}
    </>
  )
}
