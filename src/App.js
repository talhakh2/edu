import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Transcription from './pages/Transcription';
export default function App() {
  // routing logic - route Home component to the root path

  return (
    <div className="App overflow-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/quiz' element={<Quiz/>}/>
        <Route path='/transcription' element={<Transcription/>}/>
      </Routes>

      <div id="modal" className='absolute top-1/3 left-1/3 z-30'></div>
    </div>
  );

}
