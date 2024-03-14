import React from 'react'
import Logo from '../../assets/EduAI.png';
import Button from '../../components/ui/Button';

import { FaFacebook, FaGitlab, FaGithub, FaTelegramPlane, FaInstagram, FaFigma, FaAngleUp } from "react-icons/fa";

const SocialData = [
    {
        icon: FaFacebook,
        link: 'https://www.facebook.com'
    },
    {
        icon: FaGitlab,
        link: 'https://www.gitlab.com'
    },
    {
        icon: FaGithub,
        link: 'https://www.github.com'
    },
    {
        icon: FaTelegramPlane,
        link: 'https://www.telegram.com'
    },
    {
        icon: FaInstagram,
        link: 'https://www.instagram.com'
    },
    {
        icon: FaFigma,
        link: 'https://www.figma.com'
    },
]


const SocialButton = ({icon, link}) => (
    <button className='w-6 h-6 rounded-full shadow-md bg-white hover:bg-slate-200 text-black flex justify-center items-center' onClick={() => {
        window.open(link)
    }}>
        {React.createElement(icon)}
    </button>
)

const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  };

export default function Footer() {
  return (
    <div className='mt-5 pt-24 space-y-8'>
        <div className='space-y-10 flex flex-col justify-center items-center'>
            <div className='space-y-6'>
                <img src={Logo} alt="edu AI" className='mx-auto'/>
                <p className='text-sm'>High level experience in web design and development knowledge, producing quality work.</p>
            </div>
            <div className='space-y-6'>
                <div className='flex justify-center'>
                    <Button variant={'primary'}>Contact Us</Button>
                </div>
                <div className='flex gap-4 justify-center'>
                    {SocialData.map((social, index) => (
                        <SocialButton key={index} {...social} />
                    ))}
                </div>
            </div>
        </div>
        
        <div className='footer-gradient px-10 py-3 flex justify-between items-center text-slate-800 text-xs font-light w-full bg-black'>
            <p>© 2021 All Rights Reserved</p>
            <button className='w-8 h-8 rounded-full border border-slate-800 text-slate-800 flex justify-center items-center hover:bg-slate-800 hover:text-white' onClick={scrollToTop}>
                <FaAngleUp />
            </button>
        </div>
    </div>
  )
}
