import { useState } from 'react';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

export default function AddTodo({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [alarmType, setAlarmType] = useState(null);
  const [snoozeDuration, setSnoozeDuration] = useState(5);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);

    let reminderDate = null;
    if (date) {
      const dateTime = time ? `${date}T${time}` : `${date}T09:00`;
      reminderDate = new Date(dateTime).toISOString();
    }

    try {
      await onAdd({
        title: title.trim(),
        reminderDate,
        alarmType: date ? alarmType : null,
        snoozeDuration: (date && alarmType === 'snooze') ? snoozeDuration : null,
      });
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  function formatTimeDisplay(t) {
    if (!t) return null;
    const [hh, mm] = t.split(':').map(Number);
    const period = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 || 12;
    return `${h12}:${String(mm).padStart(2, '0')} ${period}`;
  }

  const SNOOZE_OPTIONS = [1, 2, 3, 5, 10, 15, 30];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">New Reminder</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close" id="close-modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form__group">
            <label className="form__label" htmlFor="todo-title">What do you need to remember?</label>
            <input
              className="form__input"
              id="todo-title"
              type="text"
              placeholder="e.g., Drink water, Call mom, Buy groceries..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              maxLength={200}
            />
          </div>

          {/* Date Picker */}
          <div className="form__group">
            <label className="form__label">When? (optional)</label>
            <DatePicker value={date} onChange={setDate} />
          </div>

          {/* Time selector — only if date is set */}
          {date && (
            <div className="form__group">
              <label className="form__label">Time</label>
              <button
                type="button"
                className="form__time-btn"
                onClick={() => setShowTimePicker(true)}
                id="todo-time-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {time ? formatTimeDisplay(time) : 'Set time (default 9:00 AM)'}
              </button>
            </div>
          )}

          {/* Alarm Type (only if date selected) */}
          {date && (
            <div className="form__group">
              <label className="form__label">Alarm</label>
              <div className="form__toggle-group">
                <button
                  type="button"
                  className={`form__toggle ${alarmType === null ? 'form__toggle--active' : ''}`}
                  onClick={() => setAlarmType(null)}
                >
                  Silent
                </button>
                <button
                  type="button"
                  className={`form__toggle ${alarmType === 'ring' ? 'form__toggle--active' : ''}`}
                  onClick={() => setAlarmType('ring')}
                >
                  🔔 Ring
                </button>
                <button
                  type="button"
                  className={`form__toggle ${alarmType === 'snooze' ? 'form__toggle--active' : ''}`}
                  onClick={() => setAlarmType('snooze')}
                >
                  💤 Snooze
                </button>
              </div>
            </div>
          )}

          {/* Snooze duration — only if snooze selected */}
          {date && alarmType === 'snooze' && (
            <div className="form__group">
              <label className="form__label">Snooze after</label>
              <div className="snooze-options">
                {SNOOZE_OPTIONS.map((min) => (
                  <button
                    key={min}
                    type="button"
                    className={`snooze-chip ${snoozeDuration === min ? 'snooze-chip--active' : ''}`}
                    onClick={() => setSnoozeDuration(min)}
                  >
                    {min} min
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="form__submit"
            disabled={!title.trim() || submitting}
            id="add-todo-submit"
          >
            {submitting ? 'Adding...' : 'Add Reminder'}
          </button>
        </form>

        {/* Time Picker Overlay */}
        {showTimePicker && (
          <TimePicker
            value={time}
            onChange={setTime}
            onClose={() => setShowTimePicker(false)}
          />
        )}
      </div>
    </div>
  );
}
