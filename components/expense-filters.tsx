"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Expense {
  id: string
  type: "expense" | "income"
  category: string
  amount: number
  description: string
  date: string
}

export default function ExpenseFilters({
  selectedMonth,
  onMonthChange,
  selectedCategory,
  onCategoryChange,
  expenses,
}: {
  selectedMonth: string
  onMonthChange: (month: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  expenses: Expense[]
}) {
  // Get unique categories
  const categories = Array.from(new Set(expenses.filter((e) => e.type === "expense").map((e) => e.category))).sort()

  // Get unique months
  const months = Array.from(new Set(expenses.map((e) => e.date.slice(0, 7))))
    .sort()
    .reverse()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Month Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Mês</label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
          >
            <option value="">Todos os meses</option>
            {months.map((month) => {
              const [year, monthNum] = month.split("-")
              const monthName = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1).toLocaleDateString(
                "pt-BR",
                {
                  month: "long",
                  year: "numeric",
                },
              )
              return (
                <option key={month} value={month}>
                  {monthName}
                </option>
              )
            })}
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Categoria</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  )
}
