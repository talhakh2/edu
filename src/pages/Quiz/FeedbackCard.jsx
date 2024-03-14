import React from 'react'
import Feedback from '../../assets/icons/feedback.svg';

export default function FeedbackCard({feedback}) {
  return (
    <div className="w-2/5 shadow-md shadow-gray-400 p-6 bg-white rounded-lg space-y-8 h-96">
        <div className="flex gap-1">
            <img src={Feedback} alt="feedback icon" />
            <h4 className="capitalize font-medium">Feedback</h4>
        </div>
        <p>
            {feedback ? feedback : 'Your quiz\'s feedback will appear here...'}
        </p>
    </div>
  )
}
