"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './Card'

export default function SummaryCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-3">
          <div className="text-2xl font-bold">{value}</div>
          {sub && <div className="text-sm text-[var(--color-muted)]">{sub}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
