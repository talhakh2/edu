import React, { useState, useEffect } from 'react';

import Nav from "../../components/Nav";
import Hexagon from "../../components/clips/Hexagon";
import Button from "../../components/ui/Button";

import Select from 'react-select';

import SummaryIcon from '../../assets/icons/summary.svg';
import TranscriptionIcon from '../../assets/icons/transcript.svg';

import { extractYouTubeVideoId } from '../../utils/video-processing';
import { sendYoutubeUrlToServer, sendVideoFileToServer } from '../../api/api';

const options = [
    { value: 'transcript', label: 'Transcription' },
    { value: 'summary', label: 'Summary' }
];

// const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];

export default function Transcription() {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [videoUrl, setVideoUrl] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [embedVideoUrl, setEmbedVideoUrl] = useState('');
    const [resultData, setResultData] = useState('');


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

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            let data;
            if (videoUrl) {
                data = await sendYoutubeUrlToServer(videoUrl, selectedOption.value);
                // console.log(data)
            } else if (videoFile) {
                data = await sendVideoFileToServer(videoFile, selectedOption.value);
                // console.log(data)
            }

            setResultData(data[selectedOption.value]);
            console.log(data[selectedOption.value])

        } catch (error) {
            console.error('Error:', error);
        }
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
                top='300px'
                left='620px'
                rotation='80'
                background='#3A7BC3'
            />
            <Nav />
            <main className="mx-10 mt-40 text-left space-y-8">
                <h1 className="text-3xl font-bold">Generate transcript or Summary!</h1>
                <div className="py-5 px-8 rounded-lg space-y-4 bg-white/35 text-black w-1/3">
                    <h3 className="text-sm text-black">Provide a video link for transcription or summary.</h3>
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
                    <h3 className="text-sm text-black">Upload the video for transcription or a summary.</h3>
                    <input type="file" className="text-sm rounded-md w-full"
                        onChange={handleFileChange}
                        disabled={videoUrl.length > 0}
                    />
                </div>
                <div className="py-5 px-8 rounded-lg space-y-4 bg-white/35 text-black w-1/3">
                    <h3 className="text-sm text-black">Select your desired output.</h3>
                    <Select
                        options={options}
                        defaultValue={selectedOption}
                        onChange={setSelectedOption}
                        isSearchable={false}
                        menuPlacement="auto"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                border: 'none', 
                                padding: '0', // Reduce padding
                                color: 'black',
                                boxShadow: 'none',
                                width: '180px',
                                fontSize: '14px',
                            }),
                            menu: (provided) => ({
                                ...provided,
                                width: '180px',
                                fontSize: '14px',
                            })
                        }}
                    
                    />
                </div>
                <Button variant='primary' onClick={handleSubmit}>Analyze video</Button>
                <h1 className="text-3xl font-bold capitalize">AI {selectedOption.value}!</h1>
                <div className="w-1/2 shadow-md shadow-gray-400 p-6 bg-white rounded-lg space-y-8 min-h-96 ">
                    <div className="flex gap-1">
                        <img src={selectedOption.value === 'summary' ? SummaryIcon : TranscriptionIcon} alt="summary/transcription icon" />
                        <h4 className="capitalize font-medium">{selectedOption.value}</h4>
                    </div>
                    <p>
                        {resultData || `Your video's ${selectedOption.value} will appear here...`}
                    </p>
                </div>
            </main>
        </div>
    );
}
