import React from 'react';

const Hexagon = ({top, left, width, height, rotation, background}) => {
  const hexagonStyle = {
    width: width,
    height: height,
    top: top,
    left: left,
    transform: `rotate(${rotation}deg)`,
    position: 'absolute',
    background: background,
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    zIndex: -1,
  };

  return (
    <div style={hexagonStyle}>
    </div>
  );
};

export default Hexagon;
