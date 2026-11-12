import { Link, Navigate, useLocation } from 'react-router-dom';
import { LETTERS } from '../data';
import { formatStars, getStars } from '../utils';

const Result = () => {
  const { state } = useLocation();
  if (!state) return <Navigate to="/" replace />;

  const { name, answers, score, correctCount } = state;
  const { stars, message } = getStars(correctCount);

  return (
    <section>
      <h1>{message}</h1>
      <p>Người chơi: <strong>{name}</strong></p>
      <p>Số câu trả lời đúng: <strong>{correctCount}/15</strong></p>
      <p>Điểm: <strong>{score}</strong></p>
      <p>Xếp loại: {stars} sao <span className="stars" aria-hidden="true">{formatStars(stars)}</span></p>
      <h2>Xem lại</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Câu</th><th>Bạn chọn</th><th>Đáp án đúng</th><th>Còn lại</th><th>Điểm</th></tr></thead>
          <tbody>
            {answers.map(({ id, chosen, correct, timeLeft, points }, index) => (
              <tr key={id} className={chosen === correct ? 'correct' : 'incorrect'}>
                <td>Câu {index + 1}</td>
                <td>{chosen === null ? '—' : LETTERS[chosen]}</td>
                <td>{LETTERS[correct]}</td>
                <td>{timeLeft} giây</td>
                <td>{points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="controls">
        <Link to="/play" className="button primary">Chơi lại</Link>
        <Link to="/" className="button">Về trang chủ</Link>
      </div>
    </section>
  );
};

export default Result;
