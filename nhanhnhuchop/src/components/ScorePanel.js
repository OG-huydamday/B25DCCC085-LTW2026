const ScorePanel = ({ score, correctCount, awarded }) => (
  <div className="score-panel" aria-live="polite">
    <div>Điểm: <strong>{score}</strong></div>
    <div>Số câu đúng: <strong>{correctCount}</strong></div>
    {awarded > 0 && <div className="awarded">+{awarded} điểm</div>}
  </div>
);

export default ScorePanel;
