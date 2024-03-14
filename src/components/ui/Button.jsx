import React from 'react'

export default function Button({children, variant, onClick, width, height}) {

  const style = {
    width: width,
    height: height
  }

  return (
    <button className={`font-semibold py-4 px-7 rounded-lg btn-${variant}`}
        onClick={onClick} 
        style={style}
    >
        {children}
    </button>
  )
}
