"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface Expense {
  category: string
  amount: number
  type: string
  date: string
}

export default function SpendingAnalytics({ expenses }: { expenses: Expense[] }) {
  // Calculate category breakdown
  const categoryData = expenses
    .filter((e) => e.type === "expense")
    .reduce(
      (acc, e) => {
        const existing = acc.find((item) => item.name === e.category)
        if (existing) {
          existing.value += e.amount
        } else {
          acc.push({ name: e.category, value: e.amount })
        }
        return acc
      },
      [] as { name: string; value: number }[],
    )
    .sort((a, b) => b.value - a.value)

  // Calculate daily spending trend
  const dailyData = expenses
    .filter((e) => e.type === "expense")
    .reduce(
      (acc, e) => {
        const day = new Date(e.date).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })
        const existing = acc.find((item) => item.date === day)
        if (existing) {
          existing.amount += e.amount
        } else {
          acc.push({ date: day, amount: e.amount })
        }
        return acc
      },
      [] as { date: string; amount: number }[],
    )
    .slice(-7)

  const topCategory = categoryData[0]
  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.value, 0)
  const avgPerCategory = totalSpent / categoryData.length || 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Categoria Principal</p>
            <p className="text-2xl font-bold text-primary">{topCategory?.name || "-"}</p>
            <p className="text-xs text-muted-foreground mt-2">Kz {(topCategory?.value || 0).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Média por Categoria</p>
            <p className="text-2xl font-bold text-primary">Kz {avgPerCategory.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">{categoryData.length} categorias</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `Kz ${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">Sem dados para exibir</p>
          )}
        </CardContent>
      </Card>

      {/* Trend Chart */}
      <Card className="border-0 shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Tendência de Gastos (Últimos 7 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `Kz ${value.toFixed(2)}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 5 }}
                  name="Gastos Diários"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">Sem dados para exibir</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
