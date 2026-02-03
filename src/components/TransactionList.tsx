'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { Plus, Trash2 } from 'lucide-react'

interface Transaction {
  id: number | string;
  daily_page_id?: number;
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  category: string | null;
  memo: string | null;
  created_at?: string;
}

// Helper to get transactions from local storage
const getLocalTransactions = (dailyPageId: string): Transaction[] => {
  const localData = localStorage.getItem('dailyTracker');
  if (!localData) return [];
  const parsedData = JSON.parse(localData);
  return parsedData.transactions?.[dailyPageId] || [];
};

// Helper to save transactions to local storage
const saveLocalTransactions = (dailyPageId: string, transactions: Transaction[]) => {
  const localData = localStorage.getItem('dailyTracker');
  const parsedData = localData ? JSON.parse(localData) : {};
  if (!parsedData.transactions) parsedData.transactions = {};
  parsedData.transactions[dailyPageId] = transactions;
  localStorage.setItem('dailyTracker', JSON.stringify(parsedData));
};

export default function TransactionList({ dailyPageId, session, pageDate }: { dailyPageId: number | string, session: Session | null, pageDate: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [memo, setMemo] = useState('');
  const [currency, setCurrency] = useState('KRW');
  const supabase = createClient();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (session && typeof dailyPageId === 'number') {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('daily_page_id', dailyPageId)
          .order('created_at', { ascending: true });
        if (error) {
          console.error('Error fetching transactions:', error);
        } else {
          setTransactions(data as Transaction[]);
        }
      } else {
        setTransactions(getLocalTransactions(pageDate));
      }
    };
    fetchTransactions();
  }, [dailyPageId, session, supabase, pageDate]);

  const handleAddTransaction = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount.trim() || isNaN(parseFloat(amount))) return;

    if (session && typeof dailyPageId === 'number') {
      const newTransactionData = {
        daily_page_id: dailyPageId,
        amount: parseFloat(amount),
        type,
        memo,
        currency
      };
      const { data, error } = await supabase
        .from('transactions')
        .insert(newTransactionData)
        .select()
        .single();
      if (error) {
        console.error('Error adding transaction:', error);
      } else if (data) {
        setTransactions([...transactions, data as Transaction]);
      }
    } else {
      const newLocalTransaction: Transaction = {
        id: new Date().getTime().toString(),
        amount: parseFloat(amount),
        type,
        memo,
        currency,
        created_at: new Date().toISOString(),
        category: null,
      };
      const updatedTransactions = [...transactions, newLocalTransaction];
      setTransactions(updatedTransactions);
      saveLocalTransactions(pageDate, updatedTransactions);
    }
    setAmount('');
    setMemo('');
  };
  
  const handleDeleteTransaction = async (id: number | string) => {
    if (session) {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) {
          console.error('Error deleting transaction:', error);
        } else {
          setTransactions(transactions.filter(t => t.id !== id));
        }
      } else {
        const updatedTransactions = transactions.filter(t => t.id !== id);
        setTransactions(updatedTransactions);
        saveLocalTransactions(pageDate, updatedTransactions);
      }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTransaction} className="flex flex-wrap gap-2 p-4 border rounded-md">
        <select value={type} onChange={e => setType(e.target.value as 'income' | 'expense')} className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
        </select>
        <input 
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="flex-grow bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
        <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm">
            <option value="KRW">KRW</option>
            <option value="USD">USD</option>
        </select>
        <input 
          type="text"
          placeholder="Memo (optional)"
          value={memo}
          onChange={e => setMemo(e.target.value)}
          className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
        <button type="submit" className="w-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2">
          <Plus size={16} />
          Add Transaction
        </button>
      </form>
      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
            <div>
                <span className={`font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toLocaleString()} {transaction.currency}
                </span>
                {transaction.memo && <p className="text-sm text-zinc-500">{transaction.memo}</p>}
            </div>
            <button 
              onClick={() => handleDeleteTransaction(transaction.id)} 
              className="text-zinc-500 hover:text-red-500 dark:hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}