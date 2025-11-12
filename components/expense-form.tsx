"use client"

import type React from "react"

import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

const CATEGORIES = {
  expense: ["Alimentação", "Transporte", "Saúde", "Educação", "Diversão", "Contas", "Outros"],
  income: ["Salário", "Freelance", "Investimentos", "Outros"],
}

export default function ExpenseForm({ user, onClose }: any) {
  const [type, setType] = useState<"expense" | "income">("expense")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addDoc(collection(db, "expenses"), {
        type,
        category,
        amount: Number.parseFloat(amount),
        description,
        date,
        userId: user.uid,
        createdAt: serverTimestamp(),
      })

      onClose()
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = CATEGORIES[type]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <CardTitle className="text-xl font-bold">Nova Transação</CardTitle>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground smooth-transition p-1 hover:bg-muted rounded-md"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type Toggle */}
            <div className="flex gap-2 bg-muted p-1 rounded-lg">
              {(["expense", "income"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t)
                    setCategory("")
                  }}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold smooth-transition ${
                    type === t
                      ? "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "expense" ? "💸 Despesa" : "💵 Receita"}
                </button>
              ))}
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 smooth-transition"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Valor (Kz)</label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="border-border bg-muted/50 focus:bg-card h-10"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Descrição</label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a transação"
                className="border-border bg-muted/50 focus:bg-card h-10"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Data</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="border-border bg-muted/50 focus:bg-card h-10"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 gradient-primary font-semibold">
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
