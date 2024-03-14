import React from 'react'

export default function Rectangle({height, color, top}) {

    const rectangleStyle = {
        height: height,
        width: '100%',
        backgroundColor: color,
        position: 'absolute',
        top: top,
        zIndex: -1,
    }

  return (
    <div style={rectangleStyle}></div>
  )
}
