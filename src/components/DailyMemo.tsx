'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { toast } from "sonner"

interface DailyMemoProps {
  dailyPageId: number | string;
  session: Session | null;
}

export default function DailyMemo({ dailyPageId, session }: DailyMemoProps) {
  const [memo, setMemo] = useState('');
  const [memoId, setMemoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!session || typeof dailyPageId !== 'number') {
      // Local storage logic can be added here
      setIsLoading(false);
      return;
    }

    const fetchMemo = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('daily_memos')
        .select('id, memo')
        .eq('daily_page_id', dailyPageId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching memo:', error);
        toast.error("Failed to load memo.");
      } else if (data) {
        setMemo(data.memo || '');
        setMemoId(data.id);
      }
      setIsLoading(false);
    };

    fetchMemo();
  }, [dailyPageId, session, supabase]);

  const handleSaveMemo = async () => {
    if (!session || typeof dailyPageId !== 'number') {
      toast.warning('You must be logged in to save a memo.');
      return;
    }

    const { error } = await supabase
      .from('daily_memos')
      .upsert({ 
        id: memoId, 
        daily_page_id: dailyPageId, 
        memo: memo 
      }, { onConflict: 'id' });

    if (error) {
      console.error('Error saving memo:', error);
      toast.error('Failed to save memo.');
    } else {
      toast.success('Memo saved!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="w-full min-h-[150px] p-3 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        <div className="h-10 w-28 px-4 py-2 rounded-md self-end bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="Write down your thoughts, reflections, or anything important for the day..."
        className="w-full min-h-[150px] p-3 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
      />
      <button
        onClick={handleSaveMemo}
        className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-md self-end hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
      >
        Save Memo
      </button>
    </div>
  );
}
