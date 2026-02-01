'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

interface Todo {
  id: number | string;
  daily_page_id?: number;
  task: string;
  status: string;
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
  const [task, setTask] = useState('');
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
    if (!task.trim()) return;

    if (session && typeof dailyPageId === 'number') {
      const { data, error } = await supabase
        .from('todos')
        .insert({ daily_page_id: dailyPageId, task })
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
        task,
        status: '대기',
        created_at: new Date().toISOString(),
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      saveLocalTodos(pageDate, updatedTodos);
    }
    setTask('');
  };

  const handleUpdateTodo = async (id: number | string, newStatus: string) => {
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

  return (
    <div>
      <form onSubmit={handleAddTodo}>
        <input 
          type="text" 
          name="task" 
          className="border p-2" 
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <span>{todo.task}</span>
            <select 
              name="status" 
              value={todo.status} 
              className="border p-1"
              onChange={(e) => handleUpdateTodo(todo.id, e.target.value)}
            >
              <option value="대기">대기</option>
              <option value="진행">진행</option>
              <option value="완료">완료</option>
            </select>
            <button 
              onClick={() => handleDeleteTodo(todo.id)} 
              className="bg-red-500 text-white p-1"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
