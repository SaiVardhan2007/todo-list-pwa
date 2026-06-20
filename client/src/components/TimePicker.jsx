import { useState, useRef, useCallback } from 'react';

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export default function TimePicker({ value, onChange, onClose }) {
  const parsed = parseTime(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState(parsed.period);
  const [mode, setMode] = useState('hour'); // 'hour' | 'minute'
  const clockRef = useRef(null);
  const dragging = useRef(false);

  function parseTime(str) {
    if (!str) {
      const now = new Date();
      const h = now.getHours();
      return {
        hour: h % 12 || 12,
        minute: Math.round(now.getMinutes() / 5) * 5 % 60,
        period: h >= 12 ? 'PM' : 'AM',
      };
    }
    const [hh, mm] = str.split(':').map(Number);
    return {
      hour: hh % 12 || 12,
      minute: mm,
      period: hh >= 12 ? 'PM' : 'AM',
    };
  }

  function to24(h, m, p) {
    let h24 = h % 12;
    if (p === 'PM') h24 += 12;
    return `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  const getAngleFromEvent = useCallback((e) => {
    const rect = clockRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let angle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  }, []);

  const handleClockInteraction = useCallback((e) => {
    const angle = getAngleFromEvent(e);

    if (mode === 'hour') {
      const idx = Math.round(angle / 30) % 12;
      setHour(HOURS_12[idx]);
    } else {
      const idx = Math.round(angle / 30) % 12;
      setMinute(MINUTES[idx]);
    }
  }, [mode, getAngleFromEvent, setHour, setMinute]);

  const handlePointerDown = (e) => {
    dragging.current = true;
    handleClockInteraction(e);
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;
    e.preventDefault();
    handleClockInteraction(e);
  };

  const handlePointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (mode === 'hour') {
      setMode('minute');
    }
  };

  const handleConfirm = () => {
    onChange(to24(hour, minute, period));
    onClose();
  };

  const currentAngle = mode === 'hour'
    ? (HOURS_12.indexOf(hour) * 30)
    : (minute / 5 * 30);

  const numbers = mode === 'hour' ? HOURS_12 : MINUTES;

  return (
    <div className="tp-overlay" onClick={onClose}>
      <div className="tp" onClick={(e) => e.stopPropagation()}>
        {/* Display */}
        <div className="tp__display">
          <button
            className={`tp__digit ${mode === 'hour' ? 'tp__digit--active' : ''}`}
            onClick={() => setMode('hour')}
            type="button"
          >
            {String(hour).padStart(2, '0')}
          </button>
          <span className="tp__colon">:</span>
          <button
            className={`tp__digit ${mode === 'minute' ? 'tp__digit--active' : ''}`}
            onClick={() => setMode('minute')}
            type="button"
          >
            {String(minute).padStart(2, '0')}
          </button>
          <div className="tp__period">
            <button
              className={`tp__period-btn ${period === 'AM' ? 'tp__period-btn--active' : ''}`}
              onClick={() => setPeriod('AM')}
              type="button"
            >AM</button>
            <button
              className={`tp__period-btn ${period === 'PM' ? 'tp__period-btn--active' : ''}`}
              onClick={() => setPeriod('PM')}
              type="button"
            >PM</button>
          </div>
        </div>

        {/* Clock face */}
        <div
          className="tp__clock"
          ref={clockRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={() => { dragging.current = false; }}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* Center dot */}
          <div className="tp__center" />

          {/* Hand */}
          <div
            className="tp__hand"
            style={{ transform: `rotate(${currentAngle}deg)` }}
          >
            <div className="tp__hand-dot" />
          </div>

          {/* Numbers */}
          {numbers.map((num, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const radius = 38;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            const isActive = mode === 'hour' ? num === hour : num === minute;

            return (
              <button
                key={num}
                className={`tp__number ${isActive ? 'tp__number--active' : ''}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => {
                  if (mode === 'hour') {
                    setHour(num);
                    setMode('minute');
                  } else {
                    setMinute(num);
                  }
                }}
                type="button"
              >
                {mode === 'minute' ? String(num).padStart(2, '0') : num}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="tp__actions">
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
