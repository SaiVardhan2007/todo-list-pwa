const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  cleanupExpired,
} = require('../controllers/todoController');

// Cleanup must come before :id routes to avoid matching "expired" as an id
router.delete('/expired/cleanup', cleanupExpired);

router.route('/').get(getTodos).post(createTodo);
router.route('/:id').get(getTodoById).put(updateTodo).delete(deleteTodo);

module.exports = router;
