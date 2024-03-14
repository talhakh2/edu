import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ children, onClose }) {
  
  const [isVisible, setIsVisible] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    const checkIfModalIsOutOfView = () => {
      if (modalRef.current) {
        const bounding = modalRef.current.getBoundingClientRect();
        
        if (bounding.top > window.innerHeight || bounding.bottom < 0) {
          setIsVisible(false);
          onClose();
        }
      }
    };

    if (isVisible) {
      window.addEventListener('scroll', checkIfModalIsOutOfView);
    }

    return () => {
      window.removeEventListener('scroll', checkIfModalIsOutOfView);
    };
  }, [isVisible, onClose]);

  return isVisible
    ? ReactDOM.createPortal(
        <div ref={modalRef}>{children}</div>,
        document.getElementById('modal')
      )
    : null;
}
