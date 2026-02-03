'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { Plus, Trash2 } from 'lucide-react'

interface Todo {
  id: number | string;
  daily_page_id?: number;
  title: string;
  status: string;
  priority: number;
  memo: string | null;
  created_at?: string;
}

// Helper to get todos from local storage
const getLocalTodos = (dailyPageId: string): Todo[] => {
  const localData = localStorage.getItem('dailyTracker');
  if (!localData) return [];
  const parsedData = JSON.parse(localData);
  return parsedData.todos?.[dailyPageId] || [];
};

// Helper to save todos to local storage
const saveLocalTodos = (dailyPageId: string, todos: Todo[]) => {
  const localData = localStorage.getItem('dailyTracker');
  const parsedData = localData ? JSON.parse(localData) : {};
  if (!parsedData.todos) parsedData.todos = {};
  parsedData.todos[dailyPageId] = todos;
  localStorage.setItem('dailyTracker', JSON.stringify(parsedData));
};

export default function TodoList({ dailyPageId, session, pageDate }: { dailyPageId: number | string, session: Session | null, pageDate: string }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchTodos = async () => {
      if (session && typeof dailyPageId === 'number') {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .eq('daily_page_id', dailyPageId)
          .order('created_at', { ascending: true });
        if (error) {
          console.error('Error fetching todos:', error);
        } else {
          setTodos(data);
        }
      } else {
        // For non-logged-in users, use pageDate as the key for local storage
        setTodos(getLocalTodos(pageDate));
      }
    };
    fetchTodos();
  }, [dailyPageId, session, supabase, pageDate]);

  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (session && typeof dailyPageId === 'number') {
      const { data, error } = await supabase
        .from('todos')
        .insert({ daily_page_id: dailyPageId, title, status: 'pending' })
        .select()
        .single();
      if (error) {
        console.error('Error adding todo:', error);
      } else if (data) {
        setTodos([...todos, data]);
      }
    } else {
      // Local logic
      const newTodo: Todo = {
        id: new Date().getTime().toString(),
        title,
        status: 'pending',
        priority: 1,
        memo: null,
        created_at: new Date().toISOString(),
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      saveLocalTodos(pageDate, updatedTodos);
    }
    setTitle('');
  };

  const handleUpdateStatus = async (id: number | string, newStatus: string) => {
    if (session) {
      const { error } = await supabase
        .from('todos')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) {
        console.error('Error updating todo:', error);
      } else {
        setTodos(todos.map(t => t.id === id ? { ...t, status: newStatus } : t));
      }
    } else {
      const updatedTodos = todos.map(t => t.id === id ? { ...t, status: newStatus } : t);
      setTodos(updatedTodos);
      saveLocalTodos(pageDate, updatedTodos);
    }
  };

  const handleDeleteTodo = async (id: number | string) => {
    if (session) {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) {
        console.error('Error deleting todo:', error);
      } else {
        setTodos(todos.filter(t => t.id !== id));
      }
    } else {
      const updatedTodos = todos.filter(t => t.id !== id);
      setTodos(updatedTodos);
      saveLocalTodos(pageDate, updatedTodos);
    }
  };

  const toggleTodoCompletion = (id: number | string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'in_progress' : 'done';
    handleUpdateStatus(id, newStatus);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTodo} className="flex gap-2">
        <input 
          type="text" 
          name="title" 
          className="flex-grow bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus size={16} />
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
            <input 
              type="checkbox"
              checked={todo.status === 'done'}
              onChange={() => toggleTodoCompletion(todo.id, todo.status)}
              className="w-4 h-4 text-zinc-600 bg-gray-100 border-gray-300 rounded focus:ring-zinc-500 dark:focus:ring-zinc-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className={`flex-grow ${todo.status === 'done' ? 'line-through text-zinc-500' : ''}`}>{todo.title}</span>
            <select 
              name="status" 
              value={todo.status} 
              className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-500"
              onChange={(e) => handleUpdateStatus(todo.id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button 
              onClick={() => handleDeleteTodo(todo.id)} 
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