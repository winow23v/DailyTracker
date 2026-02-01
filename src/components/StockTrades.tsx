'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

interface Trade {
  id: number | string;
  daily_page_id?: number;
  ticker: string;
  market: string;
  trade_type: string;
  quantity: number;
  price: number;
  currency: string;
  investment_memos?: { memo: string }[];
  created_at?: string;
}

// Local storage helpers
const getLocalTrades = (pageDate: string): Trade[] => {
  const localData = localStorage.getItem('dailyTracker');
  if (!localData) return [];
  const parsedData = JSON.parse(localData);
  return parsedData.trades?.[pageDate] || [];
};

const saveLocalTrades = (pageDate: string, trades: Trade[]) => {
  const localData = localStorage.getItem('dailyTracker');
  const parsedData = localData ? JSON.parse(localData) : {};
  if (!parsedData.trades) parsedData.trades = {};
  parsedData.trades[pageDate] = trades;
  localStorage.setItem('dailyTracker', JSON.stringify(parsedData));
};

export default function StockTrades({ dailyPageId, session, pageDate }: { dailyPageId: number | string, session: Session | null, pageDate: string }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchTrades = async () => {
      if (session && typeof dailyPageId === 'number') {
        const { data, error } = await supabase
          .from('stock_trades')
          .select('*, investment_memos(memo)')
          .eq('daily_page_id', dailyPageId);
        if (error) console.error('Error fetching trades:', error);
        else setTrades(data || []);
      } else {
        setTrades(getLocalTrades(pageDate));
      }
    };
    fetchTrades();
  }, [dailyPageId, session, supabase, pageDate]);

  const addTrade = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ticker = formData.get('ticker') as string;
    const market = formData.get('market') as string;
    const trade_type = formData.get('trade_type') as string;
    const quantity = parseInt(formData.get('quantity') as string);
    const price = parseFloat(formData.get('price') as string);
    const currency = formData.get('currency') as string;
    const memo = formData.get('memo') as string;

    if (!ticker || isNaN(quantity) || isNaN(price)) return;

    if (session && typeof dailyPageId === 'number') {
      const { data: tradeData, error } = await supabase
        .from('stock_trades')
        .insert({ daily_page_id: dailyPageId, ticker, market, trade_type, quantity, price, currency })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding trade:', error);
      } else if (tradeData) {
        let finalTrade = tradeData;
        if (memo) {
          const { data: memoData, error: memoError } = await supabase
            .from('investment_memos')
            .insert({ trade_id: tradeData.id, memo })
            .select();
          if (memoError) console.error('Error adding memo:', memoError);
          else finalTrade.investment_memos = [{ memo }];
        }
        setTrades([...trades, finalTrade]);
      }
    } else {
      const newTrade: Trade = {
        id: new Date().getTime().toString(),
        ticker, market, trade_type, quantity, price, currency,
        investment_memos: memo ? [{ memo }] : [],
        created_at: new Date().toISOString(),
      };
      const newTrades = [...trades, newTrade];
      setTrades(newTrades);
      saveLocalTrades(pageDate, newTrades);
    }
    e.currentTarget.reset();
  };

  const deleteTrade = async (id: number | string) => {
    if (session) {
      const { error } = await supabase.from('stock_trades').delete().eq('id', id);
      if (error) console.error('Error deleting trade:', error);
      else setTrades(trades.filter(t => t.id !== id));
    } else {
      const newTrades = trades.filter(t => t.id !== id);
      setTrades(newTrades);
      saveLocalTrades(pageDate, newTrades);
    }
  };

  return (
    <div>
      <ul>
        {trades.map((trade) => (
          <li key={trade.id} className="flex items-center gap-2">
            <span>{trade.trade_type} {trade.quantity} {trade.ticker} @ {trade.price} {trade.currency}</span>
            {trade.investment_memos && trade.investment_memos.length > 0 && (
              <p className="text-sm text-gray-500">Memo: {trade.investment_memos[0].memo}</p>
            )}
            <button onClick={() => deleteTrade(trade.id)} className="bg-red-500 text-white p-1">Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={addTrade}>
        <h4>Add Stock Trade</h4>
        {/* Form inputs - simplified for brevity */}
        <input type="text" name="ticker" placeholder="Ticker" className="border p-2" />
        <select name="market" className="border p-2"><option value="KRX">KRX</option><option value="NASDAQ">NASDAQ</option></select>
        <select name="trade_type" className="border p-2"><option value="매수">매수</option><option value="매도">매도</option></select>
        <input type="number" name="quantity" placeholder="Quantity" className="border p-2" />
        <input type="number" name="price" placeholder="Price" step="0.01" className="border p-2" />
        <select name="currency" className="border p-2"><option value="KRW">KRW</option><option value="USD">USD</option></select>
        <textarea name="memo" placeholder="Memo" className="border p-2"></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2">Add Trade</button>
      </form>
    </div>
  )
}
