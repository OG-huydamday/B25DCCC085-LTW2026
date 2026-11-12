import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS, LEVELS } from '../data';

const Details = ({ item: { id, level, reserve, question, options, answer, explain } }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <h1>Câu hỏi số {id} – {LEVELS[level]} · {reserve ? 'Dự bị' : 'Chính thức'}</h1>
      <p className="question-text">{question}</p>
      <ul className="options">
        {options.map((option, index) => {
          const correct = revealed && index === answer;
          return (
            <li key={LETTERS[index]} className={correct ? 'correct' : ''}>
              {LETTERS[index]}. {option}{correct && ' (Đáp án đúng)'}
            </li>
          );
        })}
      </ul>
      {revealed && <p><strong>Giải thích:</strong> {explain}</p>}
      <button type="button" className="primary" onClick={() => setRevealed(!revealed)}>
        {revealed ? 'Ẩn đáp án' : 'Xem đáp án'}
      </button>
    </>
  );
};

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = questions.find((question) => question.id === Number(id));

  return (
    <section className="panel">
      {item ? <Details key={item.id} item={item} /> : <h1>Không tìm thấy câu hỏi</h1>}
      <button type="button" className="back" onClick={() => navigate(-1)}>Quay lại</button>
    </section>
  );
};

export default QuestionDetail;
