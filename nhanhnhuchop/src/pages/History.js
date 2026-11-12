import { formatStars, sortHistory } from '../utils';

const History = ({ history, onDelete, onClear }) => {
  const count = history.length;
  const totals = history.reduce((sum, { score, correctCount }) => ({
    score: sum.score + score,
    correct: sum.correct + correctCount,
  }), { score: 0, correct: 0 });
  const average = count ? Math.round(totals.score / count) : 0;
  const accuracy = count ? Math.round(totals.correct / (15 * count) * 100) : 0;

  return (
    <section>
      <h1>Lịch sử</h1>
      <dl className="stats">
        <div><dt>Số lượt chơi:</dt> <dd>{count}</dd></div>
        <div><dt>Điểm trung bình:</dt> <dd>{average}</dd></div>
        <div><dt>Tỉ lệ trả lời đúng:</dt> <dd>{accuracy}%</dd></div>
      </dl>
      {count === 0 ? <p>Chưa có lượt chơi nào.</p> : (
        <>
          <div className="controls">
            <button type="button" onClick={onClear}>Xóa lịch sử</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Người chơi</th><th>Số câu đúng</th><th>Xếp loại</th><th>Điểm</th><th>Thời gian</th><th>Thao tác</th></tr>
              </thead>
              <tbody>
                {sortHistory(history).map(({ id, name, score, correctCount, stars, playedAt }) => (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>{correctCount}/15</td>
                    <td><span className="stars" aria-label={`${stars} sao`}>{formatStars(stars)}</span></td>
                    <td>{score}</td>
                    <td>{playedAt}</td>
                    <td><button type="button" onClick={() => onDelete(id)}>Xóa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default History;
