"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Plus, Trash2 } from "lucide-react"

interface Budget {
  id: string
  category: string
  limit: number
  userId: string
}

interface Expense {
  category: string
  amount: number
  type: string
}

export default function BudgetTracker({
  user,
  expenses,
}: {
  user: any
  expenses: Expense[]
}) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newBudget, setNewBudget] = useState({ category: "", limit: "" })

  useEffect(() => {
    if (!user) return

    const q = query(collection(db, "budgets"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgetList: Budget[] = []
      snapshot.forEach((doc) => {
        budgetList.push({
          id: doc.id,
          ...doc.data(),
        } as Budget)
      })
      setBudgets(budgetList)
    })

    return () => unsubscribe()
  }, [user])

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBudget.category || !newBudget.limit) return

    try {
      await addDoc(collection(db, "budgets"), {
        category: newBudget.category,
        limit: Number.parseFloat(newBudget.limit),
        userId: user.uid,
      })
      setNewBudget({ category: "", limit: "" })
      setShowForm(false)
    } catch (error) {
      console.error("Erro ao adicionar orçamento:", error)
    }
  }

  const handleDeleteBudget = async (id: string) => {
    if (confirm("Deseja deletar este orçamento?")) {
      try {
        await deleteDoc(doc(db, "budgets", id))
      } catch (error) {
        console.error("Erro ao deletar orçamento:", error)
      }
    }
  }

  const getCategoryExpenses = (category: string) => {
    return expenses.filter((e) => e.category === category && e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
        <CardTitle>Metas de Gastos</CardTitle>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gradient-primary">
          <Plus className="w-4 h-4 mr-1" />
          Nova Meta
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {showForm && (
          <form onSubmit={handleAddBudget} className="mb-6 p-4 bg-muted rounded-lg space-y-3">
            <input
              type="text"
              placeholder="Categoria (ex: Alimentação)"
              value={newBudget.category}
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              required
            />
            <input
              type="number"
              placeholder="Limite (Kz)"
              step="0.01"
              value={newBudget.limit}
              onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 gradient-primary">
                Adicionar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-transparent"
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {budgets.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">Nenhuma meta cadastrada</p>
          ) : (
            budgets.map((budget) => {
              const spent = getCategoryExpenses(budget.category)
              const percentage = Math.min((spent / budget.limit) * 100, 100)
              const isOverBudget = spent > budget.limit

              return (
                <div key={budget.id} className="p-4 border border-border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{budget.category}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Kz {spent.toFixed(2)} / Kz {budget.limit.toFixed(2)}
                    </span>
                    <span
                      className={`font-semibold ${isOverBudget ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                    >
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full smooth-transition ${isOverBudget ? "bg-red-500" : percentage > 80 ? "bg-amber-500" : "bg-green-500"}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {isOverBudget && (
                    <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2 rounded">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      Limite excedido em Kz {(spent - budget.limit).toFixed(2)}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
