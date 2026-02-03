import type { Todo } from './types/tasks';

// PRD 기반의 목업(mock) 데이터 예시
const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Life Asset Planner 기능 설계',
    status: 'in_progress',
    priority: 'high',
    memo: 'Tasks, Money 페이지 구체화',
  },
  {
    id: '2',
    title: '저녁 장보기',
    status: 'pending',
    priority: 'medium',
    memo: '우유, 계란, 빵',
  },
  {
    id: '3',
    title: '운동하기',
    status: 'done',
    priority: 'low',
    memo: '공원 산책 30분',
  },
];

export default function TasksPage() {
  const pendingTodos = mockTodos.filter((todo) => todo.status !== 'done');

  return (
    <main className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-gray-500 dark:text-gray-400">
          사용자의 하루 실행력을 관리하는 최우선 화면
        </p>
      </header>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold border-b pb-2 mb-3">
            오늘의 할 일 ({pendingTodos.length})
          </h2>
          <ul className="space-y-3">
            {pendingTodos.map((todo) => (
              <li key={todo.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-gray-100">{todo.title}</p>
                {todo.memo && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{todo.memo}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}