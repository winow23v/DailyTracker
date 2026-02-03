"use client"

import React from 'react'

export default function ExampleCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <article className="bg-[var(--color-surface)] shadow-md rounded-[var(--radius-card)] p-4">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
      <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{children}</div>
    </article>
  )
}
