import { useEffect, useState } from 'react';

const Countdown = ({ onComplete }) => {
  const [number, setNumber] = useState(3);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (number === 1) onComplete();
      else setNumber(number - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [number, onComplete]);

  return <p className="countdown" aria-live="polite">{number}</p>;
};

export default Countdown;
