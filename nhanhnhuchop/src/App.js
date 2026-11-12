import { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
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

  return (
    <Routes>
      <Route element={<Layout loading={loading} error={error} />}>
        <Route index element={<h2>Nhanh như chớp</h2>} />
        <Route path="play" element={<h2>Chơi</h2>} />
        <Route path="result" element={<h2>Kết quả</h2>} />
        <Route path="history" element={<h2>Lịch sử</h2>} />
        <Route path="questions" element={<QuestionBank questions={questions} />} />
        <Route path="questions/:id" element={<QuestionDetail questions={questions} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
