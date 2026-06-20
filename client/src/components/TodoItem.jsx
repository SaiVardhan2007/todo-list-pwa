import { useState } from 'react';
import TodoDetail from './TodoDetail';
import { formatDate, formatTime } from '../utils/time';

export default function TodoItem({ todo, onToggle, onDelete, onEdit, showDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`todo-item ${todo.completed ? 'todo-item--completed' : ''}`} id={`todo-${todo._id}`}>
      <div className="todo-item__main" onClick={() => setExpanded(!expanded)}>
        {/* Checkbox */}
        <div
          className={`todo-item__checkbox ${todo.completed ? 'todo-item__checkbox--checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(todo._id);
          }}
          role="checkbox"
          aria-checked={todo.completed}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onToggle(todo._id);
            }
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Content */}
        <div className="todo-item__content">
          <p className="todo-item__title">{todo.title}</p>
          {todo.reminderDate && (
            <div className="todo-item__meta">
              <span className="todo-item__badge todo-item__badge--time">
                🔔 {formatDate(todo.reminderDate)}{' '}
                {formatTime(todo.reminderDate)}
              </span>
              {todo.alarmType === 'snooze' && todo.snoozeDuration && (
                <span className="todo-item__badge todo-item__badge--snooze">
                  💤 {todo.snoozeDuration}m
                </span>
              )}
            </div>
          )}
        </div>

        {/* Delete button on completed tab */}
        {showDelete && (
          <button
            className="todo-item__delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(todo._id);
            }}
            aria-label="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        )}

        {/* Expand chevron */}
        {!showDelete && (
          <button
            className={`todo-item__expand ${expanded ? 'todo-item__expand--open' : ''}`}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
            tabIndex={-1}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>

      {/* Expanded Detail */}
      {expanded && !showDelete && (
        <TodoDetail
          todo={todo}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
    </div>
  );
}
