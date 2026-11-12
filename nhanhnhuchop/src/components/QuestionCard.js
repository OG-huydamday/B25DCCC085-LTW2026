import { LETTERS, LEVELS } from '../data';
import AnswerButton from './AnswerButton';

const QuestionCard = ({ number, total, question, outcome, onChoose }) => (
  <section>
    <h2>Câu {number}/{total} · {LEVELS[question.level]}</h2>
    <p className="question-text">{question.question}</p>
    <div className="answer-grid">
      {question.options.map((option, index) => (
        <AnswerButton
          key={LETTERS[index]}
          index={index}
          option={option}
          revealed={Boolean(outcome)}
          correct={question.answer}
          chosen={outcome?.chosen}
          onChoose={onChoose}
        />
      ))}
    </div>
  </section>
);

export default QuestionCard;
