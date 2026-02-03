export type TodoStatus = 'pending' | 'in_progress' | 'done';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string; // 또는 number
  title: string;
  status: TodoStatus;
  priority: TodoPriority;
  memo?: string;
  // daily_page_id, user_id 등 Daily Page 연결을 위한 필드 추가 필요
}