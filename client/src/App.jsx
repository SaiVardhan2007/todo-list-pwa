import { useState } from 'react';
import './index.css';
import Header from './components/Header';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import ReminderOverlay from './components/ReminderOverlay';
import useInstallPrompt from './components/InstallPrompt';
import { useTodos } from './hooks/useTodos';
import { useAlarm } from './hooks/useAlarm';

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState('active'); // 'active' | 'completed'
  const { todos, loading, error, isOffline, addTodo, toggleTodo, removeTodo, editTodo } = useTodos();
  const { activeAlarm, dismissAlarm, snoozeAlarm } = useAlarm(todos, removeTodo);
  const { canInstall, handleInstall } = useInstallPrompt();

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const handleSnooze = (minutes) => {
    const result = snoozeAlarm(minutes);
    if (result) {
      editTodo(result.id, { reminderDate: result.newReminderDate });
    }
  };

  return (
    <div className="app">
      <Header onInstall={handleInstall} canInstall={canInstall} />

      {/* Offline Banner */}
      {isOffline && (
        <div className="offline-banner" id="offline-banner">
          <span className="offline-banner__icon">⚡</span>
          <span className="offline-banner__text">Offline Mode (Cached Data)</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tabs__btn ${tab === 'active' ? 'tabs__btn--active' : ''}`}
          onClick={() => setTab('active')}
          id="tab-active"
        >
          <span>Active</span>
          {activeTodos.length > 0 && (
            <span className="tabs__count">{activeTodos.length}</span>
          )}
        </button>
        <button
          className={`tabs__btn ${tab === 'completed' ? 'tabs__btn--active' : ''}`}
          onClick={() => setTab('completed')}
          id="tab-completed"
        >
          <span>Completed</span>
          {completedTodos.length > 0 && (
            <span className="tabs__count">{completedTodos.length}</span>
          )}
        </button>
        <div
          className="tabs__indicator"
          style={{ transform: `translateX(${tab === 'active' ? '0' : '100'}%)` }}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading">
          <div className="loading__spinner" />
        </div>
      ) : error ? (
        <div className="todo-list__empty">
          <div className="todo-list__empty-icon">⚠️</div>
          <p className="todo-list__empty-text">
            Couldn't connect to server.<br />
            Check your connection and try again.
          </p>
        </div>
      ) : tab === 'active' ? (
        <TodoList
          todos={activeTodos}
          onToggle={toggleTodo}
          onDelete={removeTodo}
          onEdit={editTodo}
          emptyIcon="📝"
          emptyText={<>Nothing here yet.<br />Tap the + button to add your first reminder.</>}
        />
      ) : (
        <TodoList
          todos={completedTodos}
          onToggle={toggleTodo}
          onDelete={removeTodo}
          onEdit={editTodo}
          showDelete
          emptyIcon="✅"
          emptyText="No completed reminders yet."
        />
      )}

      {/* FAB — only on active tab */}
      {tab === 'active' && (
        <button
          className={`fab ${showAdd ? 'fab--open' : ''}`}
          onClick={() => setShowAdd(!showAdd)}
          aria-label={showAdd ? 'Close add form' : 'Add new reminder'}
          id="fab-add"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* Add Todo Modal */}
      {showAdd && (
        <AddTodo
          onAdd={addTodo}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Reminder Overlay */}
      {activeAlarm && (
        <ReminderOverlay
          alarm={activeAlarm}
          onDismiss={dismissAlarm}
          onSnooze={handleSnooze}
        />
      )}
    </div>
  );
}

export default App;
