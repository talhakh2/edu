
function parseQuizData(text) {
  
  const questionBlocks = text.split(/\n(?=\d+\. )/).filter(Boolean);

  const questions = questionBlocks.map(block => {

    const lines = block.split('\n').filter(line => line.trim() !== '');
    const question = lines[0].trim();

    const options = lines.filter(line => line.trim().startsWith('-')).map(option => option.trim().slice(5));

    const correctAnswerLine = lines.find(line => line.includes('**Correct Answer:'));
    const explanationStartIndex = lines.findIndex(line => line.includes('Explanation:'));
    const explanation = lines.slice(explanationStartIndex).join(' ').replace('Explanation: ', '').trim();

    const correctAnswerMatch = correctAnswerLine.match(/\*\*Correct Answer: ([A-D])\)/);
    const answer = correctAnswerMatch ? correctAnswerMatch[1] : '';

    return { question, options, answer, explanation, points : 10 };
  });

  return questions;
}

export { parseQuizData };