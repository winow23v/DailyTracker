'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

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

  return (
    <div>
      <h3>Incomes</h3>
      <ul>
        {incomes.map((income) => (
          <li key={income.id} className="flex items-center gap-2">
            <span>{income.amount} {income.currency} - {income.income_type}</span>
            <button onClick={() => deleteTransaction(income.id, 'income')} className="bg-red-500 text-white p-1">Delete</button>
          </li>
        ))}
      </ul>
      <h3>Expenses</h3>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="flex items-center gap-2">
            <span>{expense.amount} {expense.currency} - {expense.category}</span>
            <button onClick={() => deleteTransaction(expense.id, 'expense')} className="bg-red-500 text-white p-1">Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={addTransaction}>
        <h4>Add Transaction</h4>
        <select name="type" className="border p-2">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="number" name="amount" placeholder="Amount" className="border p-2" step="0.01" />
        <select name="currency" className="border p-2">
          <option value="KRW">KRW</option>
          <option value="USD">USD</option>
        </select>
        <input type="text" name="category" placeholder="Category" className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2">Add</button>
      </form>
    </div>
  )
}
