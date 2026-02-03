"use client"

import React from 'react'
import { Plus } from 'lucide-react'

export default function FAB({ onClick }: { onClick?: () => void }) {
  return (
    <button
      aria-label="빠른 추가"
      onClick={onClick}
      className={`fixed md:hidden bottom-6 right-6 z-50 flex items-center justify-center
        w-14 h-14 rounded-full shadow-lg text-white bg-[var(--color-accent)] touch-target`}
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}
