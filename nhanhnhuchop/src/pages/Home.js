import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const start = (event) => {
    event.preventDefault();
    if (!playerName.trim()) return;
    setPlayerName(playerName.trim());
    navigate('/play');
  };

  return (
    <section className="panel">
      <h1>Nhanh như chớp</h1>
      <ul className="rules">
        <li>Trả lời 15 câu hỏi về HTML, CSS, JavaScript và React.</li>
        <li>Mỗi câu có 15 giây. Trả lời đúng được điểm mức độ và thêm 10 điểm mỗi giây còn lại.</li>
        <li>Trả lời sai hoặc hết giờ được 0 điểm. Hoàn thành cả 15 câu để nhận tối đa 3 sao.</li>
      </ul>
      <form className="controls" onSubmit={start}>
        <label>
          Tên người chơi
          <input value={playerName} onChange={({ target }) => setPlayerName(target.value)} />
        </label>
        <button type="submit" className="primary" disabled={!playerName.trim()}>Bắt đầu</button>
      </form>
    </section>
  );
};

export default Home;
