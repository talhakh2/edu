import Button from '../../components/ui/Button';
import Rectangle from "../../components/clips/Rectangle";

import Transcription from '../../assets/transcription.png'
import Summary from '../../assets/summary.png'
import Quiz from '../../assets/quiz.png'

import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ img, title, desc, index }) => (
    <div
      key={index}
      className={`p-5 space-y-4 w-80 h-80 text-left rounded-xl bg-white shadow-lg shadow-black ${
        title === 'Generate Quiz' ? 'mt-16 ' : 'mt-0' // Adjust spacing as needed
      }`}
    >
      <img src={img} alt={title} className='' />
      <h3 className='text-2xl font-bold'>{title}</h3>
      <p className='text-sm'>{desc}</p>
    </div>
  );
  


const ServiceData = [
    {
        title : 'Transcription',
        desc : 'Efficiently converts spoken words in your video into accurate and readable text. It provides a detailed and time-stamped transcript for easy reference and analysis.',
        img : Transcription
    }, 
    {
        title : 'Generate Quiz',
        desc : 'Transforms the transcript into engaging quizzes.Creates interactive assessments based on the video content, fostering user engagement and comprehension.',
        img : Quiz
    },
    {
        title : 'Summarize',
        desc : 'Condenses lengthy video content into concise summaries.Highlights key points, enabling quick understanding without watching the entire video.',
        img : Summary
    },
    
]

export default function Services() {

  const navigate = useNavigate();

  return (
    <div className='mt-96 overflow-hidden relative'>
      <Rectangle 
            height='446px'
            color='#8EE0A18F'
            top='42%'
        />
      <h2 className='text-4xl text-center font-bold mb-16'>Services</h2>
      <div className='flex flex-wrap justify-center gap-11 mb-20'>
        {ServiceData.map((service, index) => (
          <ServiceCard key={index} {...service} index={index} />
        ))}
      </div>
      <div className='mb-24 flex justify-center'>
        <Button variant={'primary'} onClick={() => {navigate('/transcription')}}>Test it out for free</Button>
      </div>
    </div>
  )
}
