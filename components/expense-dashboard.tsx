"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ExpenseForm from "./expense-form"
import ExpenseList from "./expense-list"
import ExpenseCharts from "./expense-charts"
import ExpenseFilters from "./expense-filters"
import BudgetTracker from "./budget-tracker"
import SpendingAnalytics from "./spending-analytics"
import SearchExpenses from "./search-expenses"
import { LogOut, Plus, Download, Moon, Sun, TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react"

interface Expense {
  id: string
  type: "expense" | "income"
  category: string
  amount: number
  description: string
  date: string
  userId: string
}

export default function ExpenseDashboard({ user }: any) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "analytics" | "budgets">("dashboard")

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDark(savedDarkMode)
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

  useEffect(() => {
    if (!user) return

    const q = query(collection(db, "expenses"), where("userId", "==", user.uid))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseList: Expense[] = []
      snapshot.forEach((doc) => {
        expenseList.push({
          id: doc.id,
          ...doc.data(),
        } as Expense)
      })
      setExpenses(expenseList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta transação?")) {
      try {
        await deleteDoc(doc(db, "expenses", id))
      } catch (error) {
        console.error("Erro ao deletar:", error)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const filteredExpenses = expenses.filter((e) => {
    const expenseMonth = e.date.slice(0, 7)
    const monthMatch = !selectedMonth || expenseMonth === selectedMonth
    const categoryMatch = !selectedCategory || e.category === selectedCategory
    return monthMatch && categoryMatch
  })

  const totalIncome = filteredExpenses.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
  const totalExpenses = filteredExpenses.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
  const balance = totalIncome - totalExpenses

  const handleExportCSV = () => {
    const headers = ["Data", "Tipo", "Categoria", "Descrição", "Valor"]
    const rows = filteredExpenses.map((e) => [
      e.date,
      e.type === "income" ? "Receita" : "Despesa",
      e.category,
      e.description,
      `Kz ${e.amount.toFixed(2)}`,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `expenses-${selectedMonth}.csv`)
    link.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-gradient-to-r from-card via-card to-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💰</div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gestor de Despesas</h1>
                <p className="text-xs lg:text-sm text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="rounded-full w-10 h-10 p-0 hover:bg-muted"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 font-semibold border-b-2 smooth-transition ${
              activeTab === "dashboard"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 font-semibold border-b-2 smooth-transition flex items-center gap-2 ${
              activeTab === "analytics"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Análise
          </button>
          <button
            onClick={() => setActiveTab("budgets")}
            className={`px-4 py-2 font-semibold border-b-2 smooth-transition flex items-center gap-2 ${
              activeTab === "budgets"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wallet className="w-4 h-4" />
            Metas
          </button>
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Income Card */}
              <Card className="border-0 shadow-sm hover:shadow-md smooth-transition bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
                    <div className="bg-green-100 dark:bg-green-950 p-2 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">Kz {totalIncome.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-2">Entradas neste período</p>
                </CardContent>
              </Card>

              {/* Expenses Card */}
              <Card className="border-0 shadow-sm hover:shadow-md smooth-transition bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
                    <div className="bg-red-100 dark:bg-red-950 p-2 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">Kz {totalExpenses.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-2">Saídas neste período</p>
                </CardContent>
              </Card>

              {/* Balance Card */}
              <Card
                className={`border-0 shadow-sm hover:shadow-md smooth-transition bg-gradient-to-br ${balance >= 0 ? "from-primary/10 to-primary/5" : "from-red-100 dark:from-red-950 to-red-50 dark:to-red-900/50"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
                    <div className={`p-2 rounded-lg ${balance >= 0 ? "bg-primary/20" : "bg-red-100 dark:bg-red-950"}`}>
                      <Wallet
                        className={`w-5 h-5 ${balance >= 0 ? "text-primary" : "text-red-600 dark:text-red-400"}`}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-3xl font-bold ${balance >= 0 ? "text-primary" : "text-red-600 dark:text-red-400"}`}
                  >
                    Kz {balance.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {balance >= 0 ? "Você tem superávit" : "Você tem déficit"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Charts */}
              <div className="lg:col-span-3">
                <ExpenseCharts expenses={filteredExpenses} />
              </div>

              {/* Filters and Actions */}
              <div className="space-y-4">
                <SearchExpenses
                  expenses={expenses}
                  onSelect={(e) => {
                    setSelectedMonth(e.date.slice(0, 7))
                  }}
                />
                <ExpenseFilters
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  expenses={expenses}
                />
                <div className="flex flex-col gap-2">
                  <Button onClick={() => setShowForm(true)} className="w-full gradient-primary font-semibold h-10">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Transação
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportCSV}
                    className="w-full h-10 font-semibold bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Modal */}
            {showForm && <ExpenseForm user={user} onClose={() => setShowForm(false)} />}

            {/* Expense List */}
            <ExpenseList expenses={filteredExpenses} onDelete={handleDelete} loading={loading} />
          </>
        )}

        {activeTab === "analytics" && <SpendingAnalytics expenses={expenses} />}

        {activeTab === "budgets" && <BudgetTracker user={user} expenses={expenses} />}
      </main>
    </div>
  )
}
