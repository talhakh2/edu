import React from 'react'

export default function Trapezoid({color, height, top}) {

    const trapezoidStyle = {
        width: '100%',
        height: height,
        position: 'absolute',
        top: top,
        background: color,
        clipPath : 'polygon(0 70%, 0 30%, 100% 0, 100% 100%)',
        zIndex: -1,
    }


  return (
    <div style={trapezoidStyle}></div>
  )
}
