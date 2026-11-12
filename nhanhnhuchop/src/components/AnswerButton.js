import { LETTERS } from '../data';

const AnswerButton = ({ index, option, revealed, pointed, correct, chosen, onChoose }) => {
  let className = 'answer';
  if (pointed) className += ' pointed';
  if (revealed && index === correct) className += ' correct';
  if (revealed && index === chosen && index !== correct) className += ' incorrect';

  return (
    <button type="button" className={className} disabled={revealed} onClick={() => onChoose(index)}>
      {LETTERS[index]}. {option}
    </button>
  );
};

export default AnswerButton;
