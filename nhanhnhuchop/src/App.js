import { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import { getStars, sortHistory } from './utils';
import NotFound from './pages/NotFound';
import './App.css';

const HISTORY_KEY = 'ltw_chop_history';

const readHistory = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const App = () => {
  const [history, setHistory] = useState(readHistory);
  const [playerName, setPlayerName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuestions = async () => {
      try {
        const { data } = await axios.get('/data/questions.json', {
          signal: controller.signal,
        });
        if (!Array.isArray(data)) throw new Error('Dữ liệu câu hỏi không hợp lệ');
        if (!controller.signal.aborted) setQuestions(data);
      } catch (err) {
        if (!axios.isCancel(err) && !controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadQuestions();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const saveResult = ({ name, score, correctCount }) => {
    const now = new Date(Date.now());
    const record = {
      id: now.getTime(),
      name,
      score,
      correctCount,
      stars: getStars(correctCount).stars,
      playedAt: now.toLocaleString('vi-VN'),
    };
    setHistory((previous) => [...previous, record]);
  };

  const deleteResult = (id) => setHistory((previous) => previous.filter((item) => item.id !== id));
  const clearHistory = () => setHistory([]);
  const [record] = sortHistory(history);

  return (
    <Routes>
      <Route element={<Layout loading={loading} error={error} />}>
        <Route index element={<Home playerName={playerName} setPlayerName={setPlayerName} record={record} />} />
        <Route path="play" element={<Play playerName={playerName} questions={questions} onFinish={saveResult} />} />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History history={history} onDelete={deleteResult} onClear={clearHistory} />} />
        <Route path="questions" element={<QuestionBank questions={questions} />} />
        <Route path="questions/:id" element={<QuestionDetail questions={questions} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
