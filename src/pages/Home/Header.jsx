import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const words = ["Transcribe", "Summarize", "Quizify"];
    const [displayedText, setDisplayedText] = useState(words[0]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(700);

    useEffect(() => {
        let timer;
        if (isDeleting) {
            timer = setTimeout(() => {
                setDisplayedText(words[currentWordIndex].substring(0, displayedText.length - 1));
                setTypingSpeed(100);
            }, typingSpeed);
        } else {
            timer = setTimeout(() => {
                setDisplayedText(words[currentWordIndex].substring(0, displayedText.length + 1));
                setTypingSpeed(150);
            }, typingSpeed);
        }

        if (!isDeleting && displayedText === words[currentWordIndex]) {
            setIsDeleting(true);
            setTypingSpeed(200); // Wait a bit before starting to delete
        } else if (isDeleting && displayedText === '') {
            setIsDeleting(false);
            setCurrentWordIndex((currentWordIndex + 1) % words.length);
            setTypingSpeed(200);
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentWordIndex, words]);

    return (
        <header className="mx-10 mt-40 text-left space-y-14">
            <div className="space-y-8">
                <h1 className="text-5xl capitalize text-white font-bold">From video to wisdom</h1>
                <h1 className="text-5xl capitalize text-[#3A7BC3] font-bold">
                    {displayedText}
                    <span className="text-white">|</span>
                </h1>
                <p className="text-white font-bold max-w-96">Introducing our innovative AI-powered tool that effortlessly transforms your video content into valuable text-based resources.</p>
            </div>
            <Button variant='primary' onClick={() => navigate('/transcription')}>Test it out for free</Button>
        </header>
    );
}
