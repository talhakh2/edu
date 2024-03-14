import React from 'react'

export default function GradeCard({percentage}) {

    let success = percentage > 50? true: false;

    const containerStyle = {
        backgroundColor: success? '#8EE0A18F': '#F4433640',
    }

    const textStyle = {
        color: success? '#39BFA8': '#F44336'
    }

  return (
    <div className={`flex gap-1 justify-center items-center p-2 rounded-lg w-fit h-fit`} style={containerStyle}>
        <h4 className='font-semibold text-black'>Your Grade</h4>
        <h4 className='font-semibold' style={textStyle}>{percentage}%</h4>
    </div>
  )
}
