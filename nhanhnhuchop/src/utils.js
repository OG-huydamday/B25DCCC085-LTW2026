import { BONUS_PER_SECOND, POINTS, STARS } from './data';

export const calcPoints = ({ level }, timeLeft) => POINTS[level] + timeLeft * BONUS_PER_SECOND;
export const calcTotal = (answers) => answers.reduce((sum, { points }) => sum + points, 0);
export const countCorrect = (answers) => answers.filter(({ chosen, correct }) => chosen === correct).length;
export const getStars = (correctCount) => STARS.find(({ min }) => correctCount >= min);
export const formatStars = (stars) => `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`;
