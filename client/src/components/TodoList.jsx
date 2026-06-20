import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete, onEdit, showDelete, emptyIcon, emptyText }) {
  if (todos.length === 0) {
    return (
      <div className="todo-list__empty">
        <div className="todo-list__empty-icon">{emptyIcon || '📝'}</div>
        <p className="todo-list__empty-text">
          {emptyText || 'Nothing here yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          showDelete={showDelete}
        />
      ))}
    </div>
  );
}
