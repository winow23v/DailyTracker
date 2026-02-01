'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

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
      // Handle local storage logic if needed
      alert('You must be logged in to save a memo.');
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
      alert('Failed to save memo.');
    } else {
      alert('Memo saved!');
    }
  };

  if (isLoading) {
    return <div>Loading memo...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="Write down your thoughts, reflections, or anything important for the day..."
        className="w-full min-h-[150px] p-3 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent"
      />
      <button
        onClick={handleSaveMemo}
        className="px-4 py-2 bg-blue-600 text-white rounded-md self-end hover:bg-blue-700 transition-colors"
      >
        Save Memo
      </button>
    </div>
  );
}
