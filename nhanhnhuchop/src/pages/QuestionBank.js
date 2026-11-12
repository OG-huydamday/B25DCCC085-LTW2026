import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const filters = [
  { id: 'all', label: 'Tất cả', matches: () => true },
  { id: 'official', label: 'Chính thức', matches: ({ reserve }) => !reserve },
  { id: 'reserve', label: 'Dự bị', matches: ({ reserve }) => reserve },
];

const sorts = {
  id: (a, b) => a.id - b.id,
  ascending: (a, b) => a.level - b.level || a.id - b.id,
  descending: (a, b) => b.level - a.level || a.id - b.id,
};

const QuestionBank = ({ questions }) => {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('id');
  const [keyword, setKeyword] = useState('');

  const handleSearchChange = ({ target }) => setKeyword(target.value);
  const { matches } = filters.find(({ id }) => id === filter);
  const searchTerm = keyword.trim().toLocaleLowerCase('vi');
  const visibleQuestions = questions.filter(
    (question) => matches(question) &&
      question.question.toLocaleLowerCase('vi').includes(searchTerm)
  ).sort(sorts[sort]);

  return (
    <section>
      <h1>Ngân hàng câu hỏi</h1>
      <div className="controls">
        {filters.map(({ id, label, matches }) => (
          <button key={id} type="button" aria-pressed={id === filter} onClick={() => setFilter(id)}>
            {label} ({questions.filter(matches).length})
          </button>
        ))}
      </div>
      <div className="controls">
        <label>
          Sắp xếp
          <select value={sort} onChange={({ target }) => setSort(target.value)}>
            <option value="id">Theo số thứ tự</option>
            <option value="ascending">Mức độ: Dễ → Khó</option>
            <option value="descending">Mức độ: Khó → Dễ</option>
          </select>
        </label>
        <label>
          Tìm kiếm
          <input type="search" value={keyword} onChange={handleSearchChange} />
        </label>
      </div>
      <p role="status">Có {visibleQuestions.length} câu hỏi</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>STT</th><th>Mức độ</th><th>Loại</th><th>Câu hỏi</th></tr></thead>
          <tbody>
            {visibleQuestions.map(({ id, level, reserve, question }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{LEVELS[level]}</td>
                <td>{reserve ? 'Dự bị' : 'Chính thức'}</td>
                <td><Link to={`/questions/${id}`}>{question}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default QuestionBank;
