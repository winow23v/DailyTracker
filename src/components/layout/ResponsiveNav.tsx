'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, SettingsIcon, DollarSign, GlobeIcon } from 'lucide-react'

// Consolidated main navigation: keep core screens only to reduce clutter
const navLinks = [
  { href: '/', label: 'Tasks', icon: <HomeIcon className="w-5 h-5" /> },
  { href: '/money', label: 'Money', icon: <DollarSign className="w-5 h-5" /> },
  { href: '/market', label: 'Market', icon: <GlobeIcon className="w-5 h-5" /> },
  { href: '/settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
]

export default function ResponsiveNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-center h-16 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Life Asset
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                      }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center h-16">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full
                ${
                  isActive
                    ? 'text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
            >
              {link.icon}
              <span className="text-xs">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
