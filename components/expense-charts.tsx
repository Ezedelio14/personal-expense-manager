"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

interface Expense {
  id: string
  type: "expense" | "income"
  category: string
  amount: number
  description: string
  date: string
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"]

export default function ExpenseCharts({ expenses }: { expenses: Expense[] }) {
  // Category breakdown
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
      [] as Array<{ name: string; value: number }>,
    )

  // Daily trend
  const dailyData = expenses
    .reduce(
      (acc, e) => {
        const date = e.date
        const existing = acc.find((item) => item.date === date)
        if (existing) {
          if (e.type === "expense") {
            existing.expense += e.amount
          } else {
            existing.income += e.amount
          }
        } else {
          acc.push({
            date,
            expense: e.type === "expense" ? e.amount : 0,
            income: e.type === "income" ? e.amount : 0,
          })
        }
        return acc
      },
      [] as Array<{ date: string; expense: number; income: number }>,
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-6">
      {/* Category Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Distribuição das despesas</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `Kz ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhuma despesa registrada</p>
          )}
        </CardContent>
      </Card>

      {/* Daily Trend Bar Chart */}
      {dailyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tendência Diária</CardTitle>
            <CardDescription>Receitas vs Despesas por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => `Kz ${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Receita" />
                <Bar dataKey="expense" fill="#ef4444" name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
