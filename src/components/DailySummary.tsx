'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { SummaryCard } from '@/components/SummaryCard'
import { DollarSign, CreditCard } from 'lucide-react'

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Total Income"
        value={`${totalIncome.toLocaleString()} KRW`}
        icon={<DollarSign className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />}
        description="Today's total income"
      />
      <SummaryCard
        title="Total Expense"
        value={`${totalExpense.toLocaleString()} KRW`}
        icon={<CreditCard className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />}
        description="Today's total expense"
      />
    </div>
  );
}
