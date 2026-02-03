'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/skeleton'

type Quote = {
  shortName: string
  regularMarketPrice: number
  regularMarketChange: number
  regularMarketChangePercent: number
  currency: string
}

type MarketData = {
  [symbol: string]: Quote
}

const symbols = ['^KS11', '^IXIC', '^GSPC', 'KRW=X']
const symbolNames: { [key: string]: string } = {
  '^KS11': 'KOSPI',
  '^IXIC': 'NASDAQ',
  '^GSPC': 'S&P 500',
  'KRW=X': 'USD/KRW',
}

export default function MarketPage() {
  const [data, setData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const responses = await Promise.all(
        symbols.map((symbol) => fetch(`/api/quote?symbol=${symbol}`).then((res) => res.json()))
      )

      const marketData: MarketData = {}
      responses.forEach((res, index) => {
        if (res.quoteResponse?.result?.[0]) {
          marketData[symbols[index]] = res.quoteResponse.result[0]
        }
      })
      setData(marketData)
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Market Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {symbols.map((symbol) => (
          <Card key={symbol}>
            <CardHeader>
              <CardTitle>{symbolNames[symbol]}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data?.[symbol] ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold">
                    {data[symbol].regularMarketPrice.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                    <span className="text-sm ml-2">{data[symbol].currency}</span>
                  </p>
                  <p
                    className={`text-sm ${
                      data[symbol].regularMarketChange >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {data[symbol].regularMarketChange.toFixed(2)} (
                    {data[symbol].regularMarketChangePercent.toFixed(2)}%)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
