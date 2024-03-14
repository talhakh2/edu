import React from 'react'
import Button from '../ui/Button'
import Close from '../../assets/icons/close.svg'

import Modal from './Modal'
import { useState } from 'react'

export default function ContactUs({ onClose }) {

    const initialState = {
        name: '',
        email: '',
        phone: '',
        message: ''
    }

    const [formData, setFormData] = useState(initialState)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = () => {
        console.log(formData)

        //formData has been captured, now we can make a request to the server here
    }

  return (
    <Modal onClose={onClose}>
    <div className='border border-[#534681] bg-white w-[32rem]  px-6 py-8 flex flex-col items-center z-30 rounded-3xl shadow-xl'>
        <div className='flex flex-col w-full items-center gap-2 mb-8'>
           <img src={Close} alt="close icon" className=' self-end cursor-pointer' onClick={onClose}/>
            <h1 className='text-2xl font-semibold'>Contact us</h1>
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
                <label htmlFor="phone" className='text-sm '>Phone Number</label>
                <input type="number" id="phone" required className='text-[#534681] text-sm rounded-lg p-3 border ' placeholder='Enter Your Phone Number'
                value={formData.phone}
                onChange={handleChange}
                />
            </div>

            <div className='space-y-3 flex flex-col w-full'>
                <label htmlFor="message" className='text-sm '>Message</label>
                <textarea id="message" required className='text-[#534681] text-sm rounded-lg p-3 border ' placeholder='Please Enter Your Message'
                value={formData.message}
                onChange={handleChange}
                />
            </div>


        </div>
        <div className='flex flex-col justify-center items-center gap-10 w-full'>
            <Button variant={'primary'} width={'100%'} onClick={handleSubmit}>
                <div className='text-lg font-semibold'>Submit</div>
            </Button>
        </div>
    </div>
    </Modal>
  )
}
