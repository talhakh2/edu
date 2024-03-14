import React from 'react'
import Trapezoid from '../../components/clips/Trapezoid'
import g10 from '../../assets/g-10.png'
export default function About() {
  return (
    <div className='mt-16 py-[155px]  relative overflow-hidden flex justify-center items-center' id="about">
        <Trapezoid 
            color={'#534681'}
            height={'920px'}
            top={0}
        />
        <div>
            <img src={g10} alt="" />
        </div>
    </div>
  )
}
