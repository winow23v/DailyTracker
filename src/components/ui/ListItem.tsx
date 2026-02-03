"use client"

import React from 'react'

export default function ListItem({
  left,
  title,
  right,
  onRemove,
}: {
  left?: React.ReactNode
  title: React.ReactNode
  right?: React.ReactNode
  onRemove?: () => void
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-[var(--color-surface)]">
      <div className="flex items-center gap-3">
        {left && <div className="w-10 h-10 flex items-center justify-center">{left}</div>}
        <div className="text-sm">{title}</div>
      </div>
      <div className="flex items-center gap-3">
        {right}
        {onRemove && (
          <button onClick={onRemove} className="text-sm text-red-500">삭제</button>
        )}
      </div>
    </div>
  )
}
