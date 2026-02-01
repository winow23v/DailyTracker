'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

interface DailySummaryProps {
  dailyPageId: number | string;
  session: Session | null;
}

export default function DailySummary({ dailyPageId, session }: DailySummaryProps) {
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    if (!session || typeof dailyPageId !== 'number') {
      // Handle local storage logic if needed, for now, we focus on logged-in users
      return;
    }

    const fetchSummaryData = async () => {
      // Fetch Incomes
      const { data: incomes, error: incomeError } = await supabase
        .from('incomes')
        .select('amount, currency')
        .eq('daily_page_id', dailyPageId);
      
      if (incomeError) {
        console.error('Error fetching incomes for summary:', incomeError);
      } else {
        // TODO: Handle currency conversion
        const incomeSum = incomes.reduce((acc, income) => acc + Number(income.amount), 0);
        setTotalIncome(incomeSum);
      }

      // Fetch Expenses
      const { data: expenses, error: expenseError } = await supabase
        .from('expenses')
        .select('amount, currency')
        .eq('daily_page_id', dailyPageId);

      if (expenseError) {
        console.error('Error fetching expenses for summary:', expenseError);
      } else {
        // TODO: Handle currency conversion
        const expenseSum = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
        setTotalExpense(expenseSum);
      }
    };

    fetchSummaryData();
  }, [dailyPageId, session, supabase]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/50">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Income</h3>
        <p className="text-2xl font-semibold text-blue-900 dark:text-blue-200">
          ₩{totalIncome.toLocaleString()}
        </p>
      </div>
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/50">
        <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Total Expense</h3>
        <p className="text-2xl font-semibold text-red-900 dark:text-red-200">
          ₩{totalExpense.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
