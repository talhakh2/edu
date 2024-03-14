import { useState } from 'react'

import Checkmark from '../../assets/icons/Checkmark.png'
import Cancel from '../../assets/icons/Cancel.png'

const colors = ['#8EE0A140', '#53468140', '#39BFA840', '#3A7BC340']
const focusedColors = ['#8EE0A1', '#534681', '#39BFA8', '#3A7BC3']
const alphabet = ['A', 'B', 'C', 'D']

const ChoiceCard = ({ choice, index, onSelect, isSelected }) => (
    <div
        className={`p-[10px] rounded-lg w-full`}
        style={{
            backgroundColor: isSelected ? focusedColors[index] : colors[index],
            color : isSelected ? 'white' : 'black',
            cursor: 'pointer',
        }}
        onClick={() => onSelect(index)}
    >
        <p className='font-medium'>{alphabet[index]} {choice}</p>
    </div>
);

export default function QuizCard({ key, QuizItem, displayAnswer, setSelectedAnswer }) {
    const [selectedChoice, setSelectedChoice] = useState(null);

    const handleChoiceSelect = (choice) => {
        if(displayAnswer) return;
        setSelectedAnswer(key, choice);
        setSelectedChoice(choice);
    };

    QuizItem.options = QuizItem.options.slice(0, 4);

    return (
        <div className='bg-white space-y-4 p-5 rounded-2xl'>
            <div className='flex justify-between'>
                <h3 className='font-medium '>Question: {QuizItem.question}?</h3>
                <h3 className='text-gray-400'>{QuizItem.points} Points</h3>
            </div>
            {  
                QuizItem.options.map((choice, index) => (
                    <ChoiceCard
                        choice={choice}
                        index={index}
                        key={index}
                        onSelect={handleChoiceSelect}
                        isSelected={selectedChoice === index}
                    />
                ))
            }
            {displayAnswer && (
                <div className='flex gap-2 items-center'>
                    {
                        QuizItem.options[selectedChoice] === QuizItem.answer ? (
                            <img src={Checkmark} alt="Correct" className='h-5'/>
                        ) : ( <img src={Cancel} alt="Incorrect" className='h-5'/> )
                    }
                    <p className='font-semibold'>{QuizItem.answerExplanation || QuizItem.answer}</p>
                </div>
            )}
        </div>
    );
}