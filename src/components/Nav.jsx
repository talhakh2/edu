import Logo from '../assets/EduAI.png';
import Button from './ui/Button';
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Select from 'react-select'

import Login from './modals/Login';
import Signup from './modals/Signup';
import ContactUs from './modals/ContactUs';


const options = [
  { value: '/transcription', label: 'Transcription' },
  { value: '/transcription', label: 'Summary' }
];


export default function Nav() {

  const navigate = useNavigate();
  const handleChange = (selectedOption) => {
      navigate(selectedOption.value);
  };

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);

  const closeAll = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowContactUs(false);
  }
  
  
  const openLogin = () => {
    closeAll();
    setShowLogin(true);
  }

  const openSignup = () => {
      closeAll();
      setShowSignup(true);
  }

  return (
    <div className='fixed inset-x-0 top-0 z-20 mt-7'>
      <div className='container min-w-[90vh] mx-auto py-4 px-10 border border-gray-300 bg-white rounded-xl shadow-md flex justify-between  items-center'>
        <img src={Logo} alt="edu AI" />
        <div className='flex gap-7 items-center'>
          <Button variant='link' onClick={() => navigate('/')}>Home</Button>
          <Select
            options={options}
            onChange={handleChange}
            placeholder="AI Powered Features"
            isSearchable={false}
            menuPlacement="auto"
            styles={{
              control: (provided) => ({
                ...provided,
                border: 'none', 
                padding: '0', // Reduce padding
                fontWeight: '600',
                color: 'black',
                boxShadow: 'none',
              }),
            }}
          />
          <div className='flex gap-3'>
            <Button variant='link' onClick={()=> navigate('/quiz')}>AI Generated Quiz</Button>
            <div className='tag py-[3px] px-[5px] rounded-2xl uppercase bg-[#8EE0A1] text-white font-semibold'>new</div>
          </div>
          <Button variant='link' onClick={() => document.getElementById('about').scrollIntoView()}>
              About Us
          </Button>
        </div>
        <div className="buttons flex gap-4">
          <Button variant={'primary'} onClick={()=>{closeAll(); setShowContactUs(true);}}>Contact Us</Button>
          <Button variant={'secondary'} onClick={()=>{closeAll(); setShowLogin(true);}}>SignUp/Log in</Button>
        </div>
      </div>


      {showContactUs && <ContactUs onClose={() => setShowContactUs(false)} />}
      {showLogin && <Login onSignup={openSignup} onClose={() => setShowLogin(false)} />}
      {showSignup && <Signup onLogin={openLogin} onClose={() => setShowSignup(false)} />}

    </div>
  );
}
