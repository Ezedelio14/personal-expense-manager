"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Moon, Sun } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDark(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err: any) {
      setError(err.message || "Erro na autenticação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-10 p-3 rounded-full bg-card border border-border hover:bg-muted smooth-transition shadow-sm hover:shadow-md"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
      </button>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="border border-border shadow-xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="space-y-2">
              <div className="text-4xl mb-2">💰</div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Gestor de Despesas
              </CardTitle>
              <CardDescription className="text-base">
                {isSignUp ? "Comece a controlar suas finanças" : "Bem-vindo de volta"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-950">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="h-11 bg-muted/50 border-border focus:bg-card smooth-transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 bg-muted/50 border-border focus:bg-card smooth-transition"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 gradient-primary text-lg font-semibold hover:shadow-lg smooth-transition"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </div>
                ) : isSignUp ? (
                  "Criar Conta"
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">{isSignUp ? "Já tem conta?" : "Novo por aqui?"}</p>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm font-semibold text-primary hover:text-primary/80 smooth-transition"
              >
                {isSignUp ? "Entre com sua conta" : "Crie uma nova conta"}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Seus dados financeiros estão protegidos com segurança de nível empresarial
        </p>
      </div>
    </div>
  )
}
