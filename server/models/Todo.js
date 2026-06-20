const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    reminderDate: {
      type: Date,
      default: null,
    },
    alarmType: {
      type: String,
      enum: ['ring', 'snooze', null],
      default: null,
    },
    snoozeDuration: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Todo', todoSchema);
