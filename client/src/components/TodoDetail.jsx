import { formatDate, formatTime, formatRelativeCreated, isOverdue } from '../utils/time';

export default function TodoDetail({ todo, onDelete, onEdit }) {
  return (
    <div className="todo-detail">
      <div className="todo-detail__row">
        <svg className="todo-detail__row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="todo-detail__row-label">Created</span>
        <span>{formatRelativeCreated(todo.createdAt)}</span>
      </div>

      {todo.reminderDate && (
        <div className="todo-detail__row">
          <svg className="todo-detail__row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="todo-detail__row-label">Reminder</span>
          <span style={{ color: isOverdue(todo.reminderDate) && !todo.completed ? 'var(--danger)' : undefined }}>
            {formatDate(todo.reminderDate)} at {formatTime(todo.reminderDate)}
          </span>
        </div>
      )}

      {todo.alarmType && (
        <div className="todo-detail__row">
          <svg className="todo-detail__row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
          </svg>
          <span className="todo-detail__row-label">Alarm</span>
          <span style={{ textTransform: 'capitalize' }}>
            {todo.alarmType}
            {todo.alarmType === 'snooze' && todo.snoozeDuration ? ` · ${todo.snoozeDuration} min` : ''}
          </span>
        </div>
      )}

      <div className="todo-detail__actions">
        <button className="btn btn--danger" onClick={() => onDelete(todo._id)} id={`delete-${todo._id}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}
