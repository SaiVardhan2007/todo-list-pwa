import { useState, useEffect, useCallback, useRef } from 'react';

export function useAlarm(todos) {
  const [activeAlarm, setActiveAlarm] = useState(null);
  const firedRef = useRef(new Set());

  const checkAlarms = useCallback(() => {
    const now = new Date();

    for (const todo of todos) {
      if (!todo.reminderDate || todo.completed || firedRef.current.has(todo._id)) {
        continue;
      }

      const reminderTime = new Date(todo.reminderDate);

      if (reminderTime <= now) {
        firedRef.current.add(todo._id);
        setActiveAlarm(todo);

        // Fire browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Remdo Reminder', {
            body: todo.title,
            icon: '/icons/icon-192.png',
            tag: todo._id,
            requireInteraction: true,
          });
        }

        break;
      }
    }
  }, [todos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAlarms();
    }, 0);
    const interval = setInterval(checkAlarms, 15000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [checkAlarms]);

  const dismissAlarm = useCallback(() => {
    setActiveAlarm(null);
  }, []);

  const snoozeAlarm = useCallback((minutes) => {
    if (!activeAlarm) return;

    const mins = minutes || activeAlarm.snoozeDuration || 5;
    const snoozedTime = new Date(Date.now() + mins * 60000);
    firedRef.current.delete(activeAlarm._id);
    setActiveAlarm(null);

    return { id: activeAlarm._id, newReminderDate: snoozedTime.toISOString() };
  }, [activeAlarm]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return { activeAlarm, dismissAlarm, snoozeAlarm };
}
