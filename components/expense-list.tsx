"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Expense {
  id: string
  type: "expense" | "income"
  category: string
  amount: number
  description: string
  date: string
}

export default function ExpenseList({
  expenses,
  onDelete,
  loading,
}: {
  expenses: Expense[]
  onDelete: (id: string) => void
  loading: boolean
}) {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="py-12 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            Carregando transações...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (expenses.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="py-12 text-center">
          <div className="text-5xl mb-3">📊</div>
          <p className="text-muted-foreground">Nenhuma transação encontrada</p>
          <p className="text-xs text-muted-foreground mt-2">Adicione sua primeira transação para começar</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>{expenses.length} transações registradas</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 smooth-transition group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">{expense.type === "income" ? "💵" : "💸"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">{expense.category}</p>
                    <p className="text-sm text-muted-foreground truncate">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right flex-shrink-0">
                  <p
                    className={`font-bold text-lg ${expense.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {expense.type === "income" ? "+" : "-"} Kz {expense.amount.toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 smooth-transition"
                  aria-label="Delete transaction"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
