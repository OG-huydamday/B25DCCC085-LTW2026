import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';
import QuestionCard from '../components/QuestionCard';
import ScorePanel from '../components/ScorePanel';
import TimeBar from '../components/TimeBar';
import { TIME_PER_QUESTION } from '../data';
import { calcPoints, calcTotal, countCorrect } from '../utils';

const initialGame = {
  status: 'countdown',
  index: 0,
  timeLeft: TIME_PER_QUESTION,
  answers: [],
};

const reveal = (game, question, chosen, timeLeft) => {
  const correct = question.answer;
  const points = chosen === correct ? calcPoints(question, timeLeft) : 0;
  const answer = { id: question.id, chosen, correct, timeLeft, points };
  return { ...game, status: 'revealed', timeLeft, answers: [...game.answers, answer] };
};

const Game = ({ playerName, official }) => {
  const [game, setGame] = useState(initialGame);
  const navigate = useNavigate();
  const { status, index, timeLeft, answers } = game;
  const question = official[index];
  const score = calcTotal(answers);
  const correctCount = countCorrect(answers);
  const outcome = status === 'revealed' ? answers[index] : null;

  const begin = useCallback(() => {
    setGame((current) => ({ ...current, status: 'answering' }));
  }, []);

  useEffect(() => {
    if (status !== 'answering') return undefined;

    const interval = setInterval(() => {
      setGame((current) => {
        if (current.status !== 'answering' || current.index !== index) return current;
        const remaining = current.timeLeft - 1;
        if (remaining === 0) return reveal(current, question, null, 0);
        return { ...current, timeLeft: remaining };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, question, index]);

  useEffect(() => {
    if (status !== 'revealed') return undefined;

    const timeout = setTimeout(() => {
      if (index === official.length - 1) {
        navigate('/result', {
          replace: true,
          state: { name: playerName, answers, score, correctCount },
        });
        return;
      }

      setGame((current) => ({
        ...current,
        index: current.index + 1,
        timeLeft: TIME_PER_QUESTION,
        status: 'answering',
      }));
    }, 1500);

    return () => clearTimeout(timeout);
  }, [status, index, official.length, navigate, playerName, answers, score, correctCount]);

  const choose = (chosen) => {
    setGame((current) => {
      if (current.status !== 'answering' || current.index !== index) return current;
      return reveal(current, question, chosen, timeLeft);
    });
  };

  return (
    <div className="panel">
      {status === 'countdown' ? <Countdown onComplete={begin} /> : (
        <>
          <TimeBar timeLeft={timeLeft} />
          <QuestionCard number={index + 1} total={official.length} question={question} outcome={outcome} onChoose={choose} />
          <ScorePanel score={score} correctCount={correctCount} awarded={outcome?.points} />
        </>
      )}
    </div>
  );
};

const Play = ({ playerName, questions }) => {
  if (!playerName.trim()) return <Navigate to="/" replace />;
  const official = questions.filter(({ reserve }) => !reserve).sort((a, b) => a.id - b.id);
  return <Game playerName={playerName} official={official} />;
};

export default Play;
