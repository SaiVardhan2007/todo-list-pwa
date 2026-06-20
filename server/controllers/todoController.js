const Todo = require('../models/Todo');

// GET /api/todos
const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

// POST /api/todos
const createTodo = async (req, res, next) => {
  try {
    const { title, reminderDate, alarmType, snoozeDuration } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = await Todo.create({
      title: title.trim(),
      reminderDate: reminderDate || null,
      alarmType: alarmType || null,
      snoozeDuration: snoozeDuration || null,
    });

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

// GET /api/todos/:id
const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
};

// PUT /api/todos/:id
const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const { title, completed, reminderDate, alarmType, snoozeDuration } = req.body;

    if (title !== undefined) todo.title = title.trim();
    if (completed !== undefined) todo.completed = completed;
    if (reminderDate !== undefined) todo.reminderDate = reminderDate;
    if (alarmType !== undefined) todo.alarmType = alarmType;
    if (snoozeDuration !== undefined) todo.snoozeDuration = snoozeDuration;

    const updated = await todo.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/todos/:id
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await todo.deleteOne();
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/todos/expired/cleanup
const cleanupExpired = async (req, res, next) => {
  try {
    const result = await Todo.deleteMany({
      autoDelete: true,
      reminderDate: { $lte: new Date() },
    });

    res.json({ message: `Cleaned up ${result.deletedCount} expired todos` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  cleanupExpired,
};
