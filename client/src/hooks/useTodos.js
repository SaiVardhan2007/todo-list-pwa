import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/todos';

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Sync isOffline status with browser online/offline events
  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await api.fetchTodos();
      setTodos(data);
      localStorage.setItem('remdo_todos', JSON.stringify(data));
      setIsOffline(false);
    } catch (err) {
      const cached = localStorage.getItem('remdo_todos');
      if (cached) {
        setTodos(JSON.parse(cached));
        setIsOffline(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTodos();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadTodos]);

  const addTodo = async (todoData) => {
    try {
      const newTodo = await api.createTodo(todoData);
      setTodos((prev) => {
        const updated = [newTodo, ...prev];
        localStorage.setItem('remdo_todos', JSON.stringify(updated));
        return updated;
      });
      return newTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    try {
      const updated = await api.updateTodo(id, { completed: !todo.completed });
      setTodos((prev) => {
        const updatedList = prev.map((t) => (t._id === id ? updated : t));
        localStorage.setItem('remdo_todos', JSON.stringify(updatedList));
        return updatedList;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const removeTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      setTodos((prev) => {
        const updatedList = prev.filter((t) => t._id !== id);
        localStorage.setItem('remdo_todos', JSON.stringify(updatedList));
        return updatedList;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const editTodo = async (id, data) => {
    try {
      const updated = await api.updateTodo(id, data);
      setTodos((prev) => {
        const updatedList = prev.map((t) => (t._id === id ? updated : t));
        localStorage.setItem('remdo_todos', JSON.stringify(updatedList));
        return updatedList;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return { 
    todos, 
    loading, 
    error, 
    isOffline,
    addTodo, 
    toggleTodo, 
    removeTodo, 
    editTodo, 
    refreshTodos: loadTodos 
  };
}

