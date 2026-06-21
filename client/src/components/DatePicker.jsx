import { useState } from 'react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function DatePicker({ value, onChange, onClose }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState(value);
  const selected = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;

  const [viewYear, setViewYear] = useState(selected?.getFullYear() || today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  function toStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function isDisabled(day) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  }

  function isSelected(day) {
    if (!selected) return false;
    return selected.getFullYear() === viewYear &&
           selected.getMonth() === viewMonth &&
           selected.getDate() === day;
  }

  function isToday(day) {
    return today.getFullYear() === viewYear &&
           today.getMonth() === viewMonth &&
           today.getDate() === day;
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function selectDay(day) {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return;
    setSelectedDate(toStr(d));
  }

  const handleConfirm = () => {
    onChange(selectedDate);
    onClose();
  };

  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth();

  // Build calendar grid
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="dp__cell dp__cell--empty" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const disabled = isDisabled(d);
    cells.push(
      <button
        key={d}
        type="button"
        className={`dp__cell ${isSelected(d) ? 'dp__cell--selected' : ''} ${isToday(d) ? 'dp__cell--today' : ''} ${disabled ? 'dp__cell--disabled' : ''}`}
        onClick={() => !disabled && selectDay(d)}
        disabled={disabled}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="dp-overlay" onClick={onClose}>
      <div className="dp" onClick={(e) => e.stopPropagation()}>
        <div className="dp__body">
          {/* Quick select */}
          <div className="dp__quick">
            <button
              type="button"
              className={`dp__chip ${selectedDate === toStr(today) ? 'dp__chip--active' : ''}`}
              onClick={() => setSelectedDate(toStr(today))}
            >Today</button>
            <button
              type="button"
              className={`dp__chip ${selectedDate === toStr(tomorrow) ? 'dp__chip--active' : ''}`}
              onClick={() => setSelectedDate(toStr(tomorrow))}
            >Tomorrow</button>
            <button
              type="button"
              className={`dp__chip ${selectedDate === toStr(nextWeek) ? 'dp__chip--active' : ''}`}
              onClick={() => setSelectedDate(toStr(nextWeek))}
            >Next week</button>
            {selectedDate && (
              <button
                type="button"
                className="dp__chip dp__chip--clear"
                onClick={() => setSelectedDate('')}
              >✕ Clear</button>
            )}
          </div>

          {/* Month nav */}
          <div className="dp__nav">
            <button
              type="button"
              className="dp__nav-btn"
              onClick={prevMonth}
              disabled={!canGoPrev}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span className="dp__month-label">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" className="dp__nav-btn" onClick={nextMonth}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
            </button>
          </div>

          {/* Day headers and cells */}
          <div className="dp__grid">
            {DAYS.map((d) => (
              <div key={d} className="dp__cell dp__cell--header">{d}</div>
            ))}
            {cells}
          </div>
        </div>

        {/* Actions */}
        <div className="dp__actions">
          <button className="tp__btn tp__btn--cancel" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="tp__btn tp__btn--ok" onClick={handleConfirm} type="button">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
