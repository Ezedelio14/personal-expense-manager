"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import LoginForm from "@/components/login-form"
import ExpenseDashboard from "@/components/expense-dashboard"

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDark(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return user ? (
    <ExpenseDashboard user={user} isDark={isDark} onToggleDarkMode={toggleDarkMode} />
  ) : (
    <LoginForm isDark={isDark} onToggleDarkMode={toggleDarkMode} />
  )
}
