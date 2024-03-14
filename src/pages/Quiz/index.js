import Nav from "../../components/Nav";
import Hexagon from "../../components/clips/Hexagon";
import Button from "../../components/ui/Button";

import { extractYouTubeVideoId } from '../../utils/video-processing';

import { useState, useEffect } from "react";
import { fetchQuizData } from "../../api/api";
import { parseQuizData } from "../../utils/quiz-processing";

import QuizCard from "./QuizCard";
import GradeCard from "./GradeCard";
import FeedbackCard from "./FeedbackCard";

import Fraw from "../../assets/fraw.png";
import g13 from "../../assets/g-13.png";

// const dummyQuizItem = {
//     question: "What is the capital of Nigeria",
//     points: 10,
//     options: [
//         "Lagos",
//         "Abuja",
//         "Kano",
//         "Ibadan"
//     ],
//     answer: "B"
// }

export default function Quiz() {

    const [videoUrl, setVideoUrl] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [embedVideoUrl, setEmbedVideoUrl] = useState('');
    const [quiz, setQuiz] = useState([]);

    const [finalize, setFinalize] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState([]); 
    const [percentage, setPercentage] = useState(0);

    const setSelectedAnswer = (index, answer) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[index] = answer;
        setSelectedAnswers(newAnswers);
    }

    const getPercentage = () => {
        const correctAnswers = quiz.filter((item, index) => item.answer === selectedAnswers[index]);
        const percentage = (correctAnswers.length / quiz.length) * 100;
        setPercentage(percentage);
    }

    useEffect(() => {
        if (videoUrl) {
            const videoId = extractYouTubeVideoId(videoUrl);
            if (videoId) {
                setEmbedVideoUrl(`https://www.youtube.com/embed/${videoId}`);
                setVideoFile(null); 
            } else {
                setEmbedVideoUrl(''); 
            }
        }
    }, [videoUrl]);

    const startQuiz = async () => {
        const quizData = await fetchQuizData(videoUrl);
        const quiz = parseQuizData(quizData.questions_text);
        setQuiz(quiz);
        console.log(quiz);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) setVideoFile(file) 
        else setVideoFile(null);
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setVideoUrl(url);
        if (url.trim()) setVideoFile(null);
    };

  return (
    <div className="relative overflow-x-hidden max-h-screen">
        <Hexagon 
            width='1158.45px'
            height='1542.14px'
            top='-307px'
            left='-490.12px'
            rotation='71'
            background='#39BFA8'
        />
        <Hexagon 
                width='1336.47px'
                height='1251.25px'
                top='40%'
                left='620px'
                rotation='80'
                background='#3A7BC3'
        />

        <Nav />
        <main className="mx-10 mt-40 text-left space-y-8">
        
            <h1 className="text-3xl font-bold">Generate quiz from the transcript!</h1>
            <div className="py-5 px-8 rounded-lg space-y-4 bg-white/35 text-black w-1/3">
                <h3 className="text-sm text-black">Provide a video link to generate quiz.</h3>
                <input type="text" placeholder="Enter Video URL" className="py-1 px-2 text-sm rounded-md w-full"
                    value={videoUrl}
                    onChange={handleUrlChange}
                    disabled={videoFile}
                />
            </div>
            {embedVideoUrl && (
                <iframe
                    width="35%"
                    height="250"
                    src={embedVideoUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video Preview"
                    className='rounded-lg '
                >  </iframe>
            )}
            <div className="py-5 px-8 rounded-lg space-y-4 bg-white/35 text-black w-1/3">
                <h3 className="text-sm text-black">Upload the video for quiz.</h3>
                <input type="file" className="text-sm rounded-md w-full"
                    onChange={handleFileChange}
                    disabled={videoUrl.length > 0}
                />
            </div>

            <Button variant='primary' onClick={startQuiz}>Start Quiz</Button>
            <h1 className="text-3xl font-bold">AI-Powered Quiz!</h1>

            {
                quiz ? quiz.map((item, index) => (
                    <QuizCard 
                        key={index}
                        QuizItem={item}
                        displayAnswer={finalize}
                        setSelectedAnswer={setSelectedAnswer}
                    />
                )) : <div className="w-1/2 shadow-md p-6 bg-white rounded-lg">Your video's quiz will appear here...</div>
            }

            <Button variant={'primary'} onClick={()=>{
                getPercentage();
                setFinalize(true);
            }}>Submit</Button>

            {finalize && <div className="flex justify-between">
                <GradeCard percentage/>
                <FeedbackCard feedback="You can do better next time"/>
                <div className="flex">
                    <img src={g13} alt="g13" className="h-52"/>
                    <img src={Fraw} alt="Fraw"/>    
                </div>
            </div>}
        </main>

    </div>
  )
}
