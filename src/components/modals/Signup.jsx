
import React from 'react'
import Button from '../ui/Button'
import Close from '../../assets/icons/close.svg'
import Modal from './Modal'

import { useState } from 'react'

export default function Signup({ onClose, onLogin }) {

    const initialState = {
        name: '',
        email: '',
        password: '',
        termsAndConditions: false
    }

    const [formData, setFormData] = useState(initialState)

    const handleSignup = () => {
        console.log(formData)

        //formData has been captured, now we can make a request to the server here
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }


  return (
    <Modal onClose={onClose}>
    <div className='absolute top-1/3 left-1/3 bg-white w-[32rem] border border-[#534681]  px-6 py-8 flex flex-col items-center z-30 rounded-3xl shadow-xl'>
        <div className='flex flex-col w-full items-center gap-2 mb-8'>
           <img src={Close} alt="close icon" className=' self-end cursor-pointer' onClick={onClose}/>
            <h1 className='text-2xl font-semibold'>Create An Account</h1>
        </div>
        <div className='space-y-6 w-full mb-8'>
            <div className='space-y-3 flex flex-col w-full'>
                <label htmlFor="name" className='text-sm '>Full Name</label>
                <input type="text" id="name" required  className='text-[#534681] text-sm rounded-lg p-3 border ' placeholder='Enter Your Full Name'
                value={formData.name}
                onChange={handleChange}
                />
            </div>

            <div className='space-y-3 flex flex-col w-full'>
                <label htmlFor="email" className='text-sm '>Email</label>
                <input type="email" id="email" required  className='text-[#534681] text-sm rounded-lg p-3 border ' placeholder='itshaghighi@yahoo.com'
                value={formData.email}
                onChange={handleChange}
                />
            </div>

            <div className='space-y-3 flex flex-col w-full'>
                <label htmlFor="pword" className='text-sm '>Password</label>
                <input type="password" id="password" required className='text-[#534681] text-sm rounded-lg p-3 border ' placeholder='Enter Your Password'
                value={formData.password}
                onChange={handleChange}
                />
            </div>

            <div className='flex justify-between '>
                <div className='text-black flex gap-1'>
                    <input type="checkbox" id="remember" className='rounded-lg p-5 border ' 
                        value={formData.termsAndConditions}
                        onChange={() => setFormData({...formData, termsAndConditions: !formData.termsAndConditions})}
                    />
                    <p>I agree with the <span className='text-[#534681] cursor-pointer'>Terms of services</span> and <span className='text-[#534681] cursor-pointer'>Privacy Policy</span></p>
                </div>
            </div>
        </div>
        <div className='flex flex-col justify-center items-center gap-10 w-full'>
            <Button variant={'primary'} width={'100%'} onClick={handleSignup}>
                <div className='text-lg font-semibold'>Login</div>
            </Button>
            <p>Already have an Account? <span className='text-[#534681] cursor-pointer' onClick={onLogin}>Log in</span></p>
        </div>
    </div>
    </Modal>
  )
}
