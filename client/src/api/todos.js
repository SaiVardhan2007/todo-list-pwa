const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

export async function fetchTodos() {
  const res = await fetch(`${API_URL}/api/todos`);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

export async function createTodo(data) {
  const res = await fetch(`${API_URL}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}

export async function updateTodo(id, data) {
  const res = await fetch(`${API_URL}/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/api/todos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete todo');
  return res.json();
}

export async function cleanupExpired() {
  const res = await fetch(`${API_URL}/api/todos/expired/cleanup`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to cleanup');
  return res.json();
}
