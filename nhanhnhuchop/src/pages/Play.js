import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';
import PowerUps from '../components/PowerUps';
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
  pointer: 0,
  replacement: null,
  paused: false,
  doubled: false,
  used: { swap: false, double: false, pause: false },
};

const directions = {
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
};

const movePointer = (pointer, [dy, dx]) => {
  const row = Math.floor(pointer / 2) + dy;
  const column = pointer % 2 + dx;
  if (row < 0 || row > 1 || column < 0 || column > 1) return pointer;
  return row * 2 + column;
};

const reveal = (game, original, chosen, timeLeft) => {
  const question = game.replacement ?? original;
  const correct = question.answer;
  const basePoints = chosen === correct ? calcPoints(question, timeLeft) : 0;
  const points = basePoints * (game.doubled ? 2 : 1);
  const answer = { id: question.id, originalId: original.id, chosen, correct, timeLeft, points };
  return { ...game, status: 'revealed', timeLeft, answers: [...game.answers, answer] };
};

const Game = ({ playerName, official, questions, onFinish }) => {
  const [game, setGame] = useState(initialGame);
  const navigate = useNavigate();
  const { status, index, timeLeft, answers, pointer, replacement, paused, doubled, used } = game;
  const original = official[index];
  const question = replacement ?? original;
  const score = calcTotal(answers);
  const correctCount = countCorrect(answers);
  const outcome = status === 'revealed' ? answers[index] : null;
  const reserve = questions.find((item) => item.reserve && item.level === original.level);

  const begin = useCallback(() => {
    setGame((current) => ({ ...current, status: 'answering' }));
  }, []);

  useEffect(() => {
    if (status !== 'answering' || paused) return undefined;

    const interval = setInterval(() => {
      setGame((current) => {
        if (current.status !== 'answering' || current.index !== index ||
            current.paused || current.replacement !== replacement) return current;
        const remaining = current.timeLeft - 1;
        if (remaining === 0) return reveal(current, original, null, 0);
        return { ...current, timeLeft: remaining };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, paused, index, replacement, original]);

  useEffect(() => {
    if (status !== 'revealed') return undefined;

    const timeout = setTimeout(() => {
      if (index === official.length - 1) {
        const result = { name: playerName, answers, score, correctCount };
        onFinish(result);
        navigate('/result', { replace: true, state: result });
        return;
      }

      setGame((current) => ({
        ...current,
        index: current.index + 1,
        timeLeft: TIME_PER_QUESTION,
        status: 'answering',
        pointer: 0,
        replacement: null,
        paused: false,
        doubled: false,
      }));
    }, 1500);

    return () => clearTimeout(timeout);
  }, [status, index, official.length, navigate, onFinish, playerName, answers, score, correctCount]);

  const choose = useCallback((chosen) => {
    setGame((current) => {
      if (current.status !== 'answering' || current.index !== index ||
          current.replacement !== replacement) return current;
      return reveal(current, original, chosen, timeLeft);
    });
  }, [index, original, replacement, timeLeft]);

  useEffect(() => {
    if (status !== 'answering') return undefined;

    const handleKey = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === 'Enter') {
        event.preventDefault();
        if (!event.repeat) choose(pointer);
        return;
      }

      const direction = directions[event.key];
      if (!direction) return;
      event.preventDefault();
      setGame((current) => {
        if (current.status !== 'answering' || current.index !== index) return current;
        const nextPointer = movePointer(current.pointer, direction);
        return current.pointer === nextPointer ? current : { ...current, pointer: nextPointer };
      });
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, index, choose, pointer]);

  useEffect(() => {
    if (status !== 'countdown') {
      document.title = `Câu ${index + 1}/${official.length} – đúng ${correctCount} câu`;
    }
  }, [status, index, official.length, correctCount]);

  useEffect(() => () => {
    document.title = 'Nhanh như chớp';
  }, []);

  const activatePower = (type, changes) => {
    setGame((current) => {
      if (current.status !== 'answering' || current.index !== index || current.used[type]) return current;
      return { ...current, ...changes, used: { ...current.used, [type]: true } };
    });
  };

  return (
    <div className="panel">
      {status === 'countdown' ? <Countdown onComplete={begin} /> : (
        <>
          <TimeBar timeLeft={timeLeft} paused={paused} />
          <QuestionCard number={index + 1} total={official.length} question={question}
            outcome={outcome} pointer={pointer} onChoose={choose} />
          <ScorePanel score={score} correctCount={correctCount} awarded={outcome?.points} />
          <PowerUps enabled={status === 'answering'} used={used} doubled={doubled} paused={paused}
            canSwap={Boolean(reserve)}
            onSwap={() => reserve && activatePower('swap', { replacement: reserve, timeLeft: TIME_PER_QUESTION, pointer: 0 })}
            onDouble={() => activatePower('double', { doubled: true })}
            onPause={() => activatePower('pause', { paused: true })}
          />
        </>
      )}
    </div>
  );
};

const Play = ({ playerName, questions, onFinish }) => {
  if (!playerName.trim()) return <Navigate to="/" replace />;
  const official = questions.filter(({ reserve }) => !reserve).sort((a, b) => a.id - b.id);
  return <Game playerName={playerName} official={official} questions={questions} onFinish={onFinish} />;
};

export default Play;
