import React from 'react'
import Working from '../../assets/working.png'


const getMarginLeft = (index) => {

    let middleIndex = Math.ceil(StepData.length / 2)
    if(index >= middleIndex) index = StepData.length - 1 - index

    return 50 + index * 50
}

const processText = (text) => {
    //everytime <br/> is found, add a new line
    return text.split('<br/>').map((line, index) => (
        <p key={index}>{line}</p>
    ))

}

const StepCard = ({index, text, color}) => {

    const style = {
        backgroundColor: color,
        marginLeft : getMarginLeft(index) + 'px'
    }

    let processedText = processText(text)

    return (
    <div className={`p-[10px] flex items-center gap-4 rounded-l-3xl w-fit`} key={index} style={style}>
        <div className='w-16 h-16 rounded-full bg-white shadow-md shadow-black font-bold text-3xl flex justify-center items-center'>{index+1}</div>
        <p>{processedText}</p>
    </div>
)}

const StepData = [
    {
        text : 'Upload a video file or<br/>paste a link.',
        color : '#3A7BC340'
    }, 
    {
        text : 'Tool extracts audio and uses AI to<br/>transcribe and summarize.',
        color : '#C0EECA'
    },
    {
        text : 'Select options to generate Transcript,<br/>Summary or Quiz.',
        color : '#53468140'
    },
    {
        text : 'View transcript or summary, and<br/>access generated quizzes.',
        color : '#39BFA840'
    },
    {
        text : 'Provide feedback for<br/>improvement.',
        color : '#C0EECA'
    }
]

export default function HowItWorks() {
  return (
    <div className='mt-14 mx-28'>
      <h2 className='text-4xl text-center font-bold mb-16 '>How It Works?</h2>
      <div className='flex justify-center gap-11'>
        <img src={Working} alt="tools of trade" className='w-1/2 object-contain' width={610} height={521} />
        <div className='flex-1'>
            <div className='flex flex-col gap-10'>
                {StepData.map((step, index) => (
                    <StepCard index={index} {...step} />
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
