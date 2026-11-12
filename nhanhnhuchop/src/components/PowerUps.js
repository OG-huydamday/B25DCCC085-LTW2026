const PowerUps = ({ enabled, used, doubled, paused, canSwap, onSwap, onDouble, onPause }) => (
  <div className="controls" role="group" aria-label="Quyền trợ giúp">
    <button type="button" disabled={!enabled || used.swap || !canSwap} onClick={onSwap}>Đổi câu hỏi</button>
    <button type="button" disabled={!enabled || used.double} onClick={onDouble}>
      {doubled ? 'Đang nhân đôi' : 'Nhân đôi'}
    </button>
    <button type="button" disabled={!enabled || used.pause} onClick={onPause}>
      {paused ? 'Đã dừng giờ' : 'Dừng giờ'}
    </button>
  </div>
);

export default PowerUps;
