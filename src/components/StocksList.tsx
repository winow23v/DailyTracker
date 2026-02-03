"use client"

import { useState, useEffect, FormEvent } from 'react'

interface Holding {
  id: string
  ticker: string
  quantity: number
  avgPrice: number
  currency: string
}

async function fetchQuote(symbol: string) {
  try {
    const res = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`)
    if (!res.ok) throw new Error('Quote fetch failed')
    return res.json()
  } catch (e) {
    console.error(e)
    return null
  }
}

export default function StocksList({ dailyPageId, session, pageDate }: { dailyPageId: number | string, session: any, pageDate: string }) {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [quotes, setQuotes] = useState<Record<string, any>>({})

  useEffect(() => {
    const local = localStorage.getItem('dailyTracker')
    if (!local) return
    const parsed = JSON.parse(local)
    const list: Holding[] = parsed.holdings?.[pageDate] || []
    setHoldings(list)
    // fetch quotes
    list.forEach(async (h) => {
      const q = await fetchQuote(h.ticker)
      if (q) setQuotes((s) => ({ ...s, [h.ticker]: q }))
    })
  }, [pageDate])

  const saveLocal = (list: Holding[]) => {
    const local = localStorage.getItem('dailyTracker')
    const parsed = local ? JSON.parse(local) : {}
    if (!parsed.holdings) parsed.holdings = {}
    parsed.holdings[pageDate] = list
    localStorage.setItem('dailyTracker', JSON.stringify(parsed))
  }

  const addHolding = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const ticker = (fd.get('ticker') as string || '').toUpperCase()
    const quantity = parseInt(fd.get('quantity') as string || '0')
    const avgPrice = parseFloat(fd.get('avgPrice') as string || '0')
    const currency = fd.get('currency') as string || 'KRW'
    if (!ticker || quantity <= 0) return
    const newH: Holding = { id: Date.now().toString(), ticker, quantity, avgPrice, currency }
    const newList = [...holdings, newH]
    setHoldings(newList)
    saveLocal(newList)
    // fetch quote
    fetchQuote(ticker).then((q) => { if (q) setQuotes((s) => ({ ...s, [ticker]: q })) })
    e.currentTarget.reset()
  }

  const removeHolding = (id: string) => {
    const newList = holdings.filter(h => h.id !== id)
    setHoldings(newList)
    saveLocal(newList)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addHolding} className="grid grid-cols-2 gap-3">
        <input name="ticker" placeholder="Ticker (AAPL)" className="w-full p-2 rounded-md border" />
        <input name="quantity" type="number" placeholder="Quantity" className="w-full p-2 rounded-md border" />
        <input name="avgPrice" type="number" placeholder="Avg Price" className="w-full p-2 rounded-md border" />
        <select name="currency" className="w-full p-2 rounded-md border">
          <option>KRW</option>
          <option>USD</option>
        </select>
        <button className="col-span-2 bg-[var(--color-accent)] text-white py-2 rounded-md">Add Holding</button>
      </form>

      <ul className="space-y-2">
        {holdings.map(h => {
          const q = quotes[h.ticker]
          const current = q?.quoteResponse?.result?.[0]?.regularMarketPrice ?? q?.price ?? null
          const high = q?.quoteResponse?.result?.[0]?.regularMarketDayHigh ?? null
          const low = q?.quoteResponse?.result?.[0]?.regularMarketDayLow ?? null
          return (
            <li key={h.id} className="p-3 bg-[var(--color-surface)] rounded-md flex items-center justify-between">
              <div>
                <div className="font-bold">{h.ticker} <span className="text-sm text-muted">{h.quantity} @{h.avgPrice} {h.currency}</span></div>
                <div className="text-sm text-zinc-500">Current: {current !== null ? current : '—'} {h.currency} {high && low ? ` (H:${high} / L:${low})` : ''}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => removeHolding(h.id)} className="text-sm text-red-500">Remove</button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
