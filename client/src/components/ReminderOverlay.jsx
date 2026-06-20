import { formatTime } from '../utils/time';

export default function ReminderOverlay({ alarm, onDismiss, onSnooze }) {
  if (!alarm) return null;

  const showSnooze = alarm.alarmType === 'snooze';
  const snoozeMins = alarm.snoozeDuration || 5;

  return (
    <div className="reminder-overlay" role="alertdialog" aria-label={`Reminder: ${alarm.title}`}>
      <div className="reminder__content">
        <div className="reminder__icon">⏰</div>
        <p className="reminder__label">Reminder</p>
        <h2 className="reminder__title">{alarm.title}</h2>
        {alarm.reminderDate && (
          <p className="reminder__time">
            Scheduled for {formatTime(alarm.reminderDate)}
          </p>
        )}

        <div className="reminder__actions">
          <button
            className="reminder__btn reminder__btn--dismiss"
            onClick={onDismiss}
            id="dismiss-alarm"
          >
            Got it
          </button>
          {showSnooze && (
            <button
              className="reminder__btn reminder__btn--snooze"
              onClick={() => onSnooze(snoozeMins)}
              id="snooze-alarm"
            >
              Snooze {snoozeMins} min
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
