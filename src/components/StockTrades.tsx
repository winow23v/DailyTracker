'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { Trash2, Plus } from 'lucide-react'

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

  const inputStyle = "w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500";
  
  return (
    <div className="space-y-6">
       <form onSubmit={addTrade} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="ticker" placeholder="Ticker" className={inputStyle} />
          <select name="market" className={inputStyle}>
            <option value="KRX">KRX</option>
            <option value="NASDAQ">NASDAQ</option>
            <option value="NYSE">NYSE</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <select name="trade_type" className={inputStyle}>
            <option value="매수">Buy</option>
            <option value="매도">Sell</option>
          </select>
          <input type="number" name="quantity" placeholder="Quantity" className={inputStyle} />
          <input type="number" name="price" placeholder="Price" step="0.01" className={inputStyle} />
        </div>
        <select name="currency" className={inputStyle}>
            <option value="KRW">KRW</option>
            <option value="USD">USD</option>
        </select>
        <textarea name="memo" placeholder="Why did you make this trade?" className={`${inputStyle} h-24`} />
        <button type="submit" className="w-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2">
          <Plus size={16} />
          Add Trade
        </button>
      </form>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Today's Trades</h4>
        <ul className="space-y-2">
          {trades.map((trade) => (
            <li key={trade.id} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${trade.trade_type === '매수' ? 'text-green-600' : 'text-red-600'}`}>{trade.trade_type}</span>
                  <span className="font-bold">{trade.ticker}</span>
                  <span>{trade.quantity} @ {trade.price.toLocaleString()} {trade.currency}</span>
                </div>
                <button onClick={() => deleteTrade(trade.id)} className="text-zinc-500 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
              {trade.investment_memos && trade.investment_memos.length > 0 && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 pl-2 border-l-2 border-zinc-200 dark:border-zinc-700">
                  {trade.investment_memos[0].memo}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}