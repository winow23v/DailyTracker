'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { Trash2, Plus } from 'lucide-react'

interface Transaction {
  id: number | string;
  daily_page_id?: number;
  amount: number;
  currency: string;
  created_at?: string;
}
interface Income extends Transaction {
  income_type: string;
}
interface Expense extends Transaction {
  category: string;
  is_fixed?: boolean;
}

// Local storage helpers
const getLocalFinance = (pageDate: string): { incomes: Income[], expenses: Expense[] } => {
  const localData = localStorage.getItem('dailyTracker');
  if (!localData) return { incomes: [], expenses: [] };
  const parsedData = JSON.parse(localData);
  return {
    incomes: parsedData.incomes?.[pageDate] || [],
    expenses: parsedData.expenses?.[pageDate] || [],
  };
};

const saveLocalFinance = (pageDate: string, data: { incomes?: Income[], expenses?: Expense[] }) => {
  const localData = localStorage.getItem('dailyTracker');
  const parsedData = localData ? JSON.parse(localData) : { incomes: {}, expenses: {} };
  if (data.incomes) {
    if (!parsedData.incomes) parsedData.incomes = {};
    parsedData.incomes[pageDate] = data.incomes;
  }
  if (data.expenses) {
    if (!parsedData.expenses) parsedData.expenses = {};
    parsedData.expenses[pageDate] = data.expenses;
  }
  localStorage.setItem('dailyTracker', JSON.stringify(parsedData));
};

export default function Finance({ dailyPageId, session, pageDate }: { dailyPageId: number | string, session: Session | null, pageDate: string }) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchFinanceData = async () => {
      if (session && typeof dailyPageId === 'number') {
        const { data: incomeData, error: incomeError } = await supabase
          .from('incomes')
          .select('*')
          .eq('daily_page_id', dailyPageId);
        if (incomeError) console.error('Error fetching incomes:', incomeError);
        else setIncomes(incomeData || []);

        const { data: expenseData, error: expenseError } = await supabase
          .from('expenses')
          .select('*')
          .eq('daily_page_id', dailyPageId);
        if (expenseError) console.error('Error fetching expenses:', expenseError);
        else setExpenses(expenseData || []);
      } else {
        const { incomes: localIncomes, expenses: localExpenses } = getLocalFinance(pageDate);
        setIncomes(localIncomes);
        setExpenses(localExpenses);
      }
    };
    fetchFinanceData();
  }, [dailyPageId, session, supabase, pageDate]);

  const addTransaction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const currency = formData.get('currency') as string;
    const category = formData.get('category') as string;

    if (isNaN(amount) || !currency) return;
    
    if (session && typeof dailyPageId === 'number') {
      const table = type === 'income' ? 'incomes' : 'expenses';
      const payload = {
        daily_page_id: dailyPageId,
        amount,
        currency,
        ...(type === 'income' ? { income_type: category } : { category }),
      };
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      if (error) {
        console.error(`Error adding ${type}:`, error);
      } else if (data) {
        if (type === 'income') setIncomes([...incomes, data as Income]);
        else setExpenses([...expenses, data as Expense]);
      }
    } else {
      const newTransaction = {
        id: new Date().getTime().toString(),
        amount,
        currency,
        created_at: new Date().toISOString(),
      };
      if (type === 'income') {
        const newIncomes = [...incomes, { ...newTransaction, income_type: category }];
        setIncomes(newIncomes);
        saveLocalFinance(pageDate, { incomes: newIncomes });
      } else {
        const newExpenses = [...expenses, { ...newTransaction, category: category }];
        setExpenses(newExpenses);
        saveLocalFinance(pageDate, { expenses: newExpenses });
      }
    }
    e.currentTarget.reset();
  };
  
  const deleteTransaction = async (id: number | string, type: 'income' | 'expense') => {
    if (session) {
        const table = type === 'income' ? 'incomes' : 'expenses';
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) {
            console.error(`Error deleting ${type}:`, error);
        } else {
            if (type === 'income') setIncomes(incomes.filter(i => i.id !== id));
            else setExpenses(expenses.filter(e => e.id !== id));
        }
    } else {
        if (type === 'income') {
            const newIncomes = incomes.filter(i => i.id !== id);
            setIncomes(newIncomes);
            saveLocalFinance(pageDate, { incomes: newIncomes });
        } else {
            const newExpenses = expenses.filter(e => e.id !== id);
            setExpenses(newExpenses);
            saveLocalFinance(pageDate, { expenses: newExpenses });
        }
    }
  };

  const inputStyle = "w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500";

  return (
    <div className="space-y-6">
      <form onSubmit={addTransaction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <select name="type" className={inputStyle}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input type="text" name="category" placeholder="Category" className={inputStyle} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="amount" placeholder="Amount" className={inputStyle} step="0.01" />
          <select name="currency" className={inputStyle}>
            <option value="KRW">KRW</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2">
          <Plus size={16} />
          Add Transaction
        </button>
      </form>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Incomes</h4>
          <ul className="space-y-2">
            {incomes.map((income) => (
              <li key={income.id} className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{income.amount.toLocaleString()}</span>
                  <span className="text-xs text-zinc-500">{income.currency}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{income.income_type}</span>
                  <button onClick={() => deleteTransaction(income.id, 'income')} className="text-zinc-500 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Expenses</h4>
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{expense.amount.toLocaleString()}</span>
                  <span className="text-xs text-zinc-500">{expense.currency}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{expense.category}</span>
                  <button onClick={() => deleteTransaction(expense.id, 'expense')} className="text-zinc-500 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}