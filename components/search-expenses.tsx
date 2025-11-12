"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"

interface Expense {
  id: string
  category: string
  amount: number
  type: string
  date: string
  description: string
}

export default function SearchExpenses({
  expenses,
  onSelect,
}: {
  expenses: Expense[]
  onSelect: (expense: Expense) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredExpenses = useMemo(() => {
    if (!searchTerm) return []

    return expenses.filter(
      (e) =>
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, expenses])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar despesas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-8"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {searchTerm && filteredExpenses.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-0 shadow-lg">
          <CardContent className="p-0 max-h-64 overflow-y-auto">
            <div className="divide-y divide-border">
              {filteredExpenses.map((expense) => (
                <button
                  key={expense.id}
                  onClick={() => {
                    onSelect(expense)
                    setSearchTerm("")
                  }}
                  className="w-full text-left p-3 hover:bg-muted smooth-transition flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{expense.category}</p>
                  </div>
                  <p
                    className={`font-semibold text-sm flex-shrink-0 ${expense.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {expense.type === "income" ? "+" : "-"} Kz {expense.amount.toFixed(2)}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchTerm && filteredExpenses.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground text-sm">Nenhuma transação encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
