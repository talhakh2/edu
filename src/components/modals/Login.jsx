import React from 'react'
import Button from '../ui/Button'
import Close from '../../assets/icons/close.svg'
import { useState } from 'react'

import Modal from './Modal'

export default function Login({ onClose, onSignup }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        console.log(email, password)

        //email and password have been captured, now we can make a request to the server here
    }



  return (

    <Modal onClose={onClose}>
    <div className='bg-white w-[32rem]  border border-[#534681] px-6 py-8 flex flex-col items-center z-30 rounded-3xl shadow-xl'>
        <div className='flex flex-col w-full items-center gap-2 mb-8'>
           <img src={Close} alt="close icon" className=' self-end cursor-pointer' onClick={onClose}/>
            <h1 className='text-2xl font-semibold'>Welcome Back</h1>
        </div>
        <div className='space-y-6 w-full mb-11'>
            <div className='space-y-3 flex flex-col w-full'>
                <label htmlFor="email" className='text-sm '>Email</label>
                <input type="email" id="email" required  className='text-[#534681] text-sm rounded-lg p-3 border ' placeholder='itshaghighi@yahoo.com'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                />
            </div>

            <div className='space-y-3 flex flex-col w-full'>
                <label htmlFor="pword" className='text-sm '>Password</label>
                <input type="password" id="pword" required className='text-[#534681] text-sm rounded-lg p-3 border ' placeholder='Enter Your Password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                />
            </div>

            <div className='flex justify-between '>
                <div className='text-black flex gap-1'>
                    <input type="checkbox" id="remember" className='rounded-lg p-5 border ' />
                    <p>Remember me</p>
                </div>
                <div className='cursor-pointer text-[#534681]'>Forget Password?</div>
            </div>
        </div>
        <div className='flex flex-col justify-center items-center gap-10 w-full'>
            <Button variant={'primary'} width={'100%'} onClick={handleLogin}>
                <div className='text-lg font-semibold'>Login</div>
            </Button>
            <p>Log in or <span className='text-[#534681] cursor-pointer' onClick={onSignup}>create an account</span></p>
        </div>
    </div>
    </Modal>
  )
}
