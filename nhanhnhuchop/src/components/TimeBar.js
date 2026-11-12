import { TIME_PER_QUESTION } from '../data';

const TimeBar = ({ timeLeft }) => {
  const percent = timeLeft / TIME_PER_QUESTION * 100;
  return (
    <div className="timer">
      <p>Còn {timeLeft} giây</p>
      <div className="time-track" role="progressbar" aria-label="Thời gian còn lại"
        aria-valuemin={0} aria-valuemax={TIME_PER_QUESTION} aria-valuenow={timeLeft}>
        <div className={timeLeft <= 5 ? 'time-fill urgent' : 'time-fill'} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default TimeBar;
