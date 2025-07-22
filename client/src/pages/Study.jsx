import "../stylesheets/Set.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { backendURL } from "../App";

export default function Study(){
    const { id } = useParams();
    if (!/^[a-f0-9]{24}$/.test(id)) return <Navigate to={'/error'}/>;
    
    let navigate = useNavigate();

    const [currentSet, setCurrentSet] = useState(null);
    const [currentCards, setCurrentCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);
    const [index, setIndex] = useState(0); 

    const handlePlay = (text) => {
        if(!text || !window.speechSynthesis) return;
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        console.log(voices)
        utterance.voice = voices.find(voice => voice.voiceURI === "Google US English");
        synth.speak(utterance);
    };

    useEffect(()=>{
        window.speechSynthesis.cancel();
    }, [isFlipped])

    const fetchSet = async () => {
        try {
            const response = await axios.post(`${backendURL}/api/set/single`, { id });
            if(response.data.success){
                setCurrentSet(response.data.set);
                setCurrentCards(response.data.set.cards);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        window.speechSynthesis.cancel();
        fetchSet();
    },[])

    function SM2(q, n, EF, I) {
        if(q >= 3){
            if (n === 0) I = 1;
            else if (n === 1) I = 6;
            else I = Math.round(I * EF);
            n += 1;
        } 
        else{
            n = 0;
            I = 1;
        }
        EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        if(EF < 1.3) EF = 1.3;
        return { n, EF, I };
    }

    function shuffle(array) {
        for(let i = array.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    if(loading) return (
        <div className="loading"></div>
    )

    if(!currentSet) return (
        <div className="no-set">
            <h2>This set was either deleted or does not exist. Sorry!</h2>
            <Link to="/">Home</Link>
        </div>
    )
 
    return (
        <div className="main">
            <div className="study-header">
                <div>
                    <h1>{currentSet?.title}</h1>
                    <span>{currentSet?.cards.length} terms</span>
                </div>
                <button className="closeButton" title="Close" onClick={()=>navigate(`/${id}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
            </div>
            <div className="flashcard-container">
                <div onClick={()=>{setIsFlipped(!isFlipped)}} className={`flashcard ${isFlipped ? 'flipped' : ''} `}>
                    <div className="card-front">
                        {currentCards[index].term?.length > 0 && <div id="termText">{currentCards[index].term}</div>}
                        {currentCards[index].termImg &&
                        <img src={currentCards[index].termImg}/>}
                    </div>
                    <div className="card-back">
                            {currentCards[index].definition?.length > 0 && <div id="definitionText">{currentCards[index].definition}</div>}
                            {currentCards[index].definitionImg &&
                            <img src={currentCards[index].definitionImg}/>}
                    </div>
                </div>
                <div className="under-container">
                    <button id="listen-button" title="Listen" disabled={!currentCards[index].term} onClick={()=>{
                        let text = (isFlipped ? currentCards[index].definition : currentCards[index].term)
                        handlePlay(text);}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
                            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
                            <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
                        </svg>
                    </button>
                    
                    <div className="arrowsContainer">
                        <button id="noButton" onClick={() => {setIsFlipped(false); setTimeout(()=>setIndex(index - 1), 100);}} disabled={!index}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                            <div>Still learning</div>
                        </button>
                        <span> {index + 1} / {currentCards.length} </span>
                        <button id="yesButton" onClick={() => {setIsFlipped(false); setTimeout(()=>setIndex(index + 1), 100);}} disabled={(index + 1) === currentCards.length}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                            </svg>
                            <div>Know it</div>
                        </button>
                    </div>
                    <button id="shuffle-button" title="Shuffle" onClick={()=>{
                        setIsFlipped(false);
                        setTimeout(()=>{
                            setCurrentCards(shuffle([...currentCards]));
                        }, 100);}}>
                        <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
                            <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
                        </svg>
                    </button>
                    
                </div>
                
                {(currentCards.length-1 !== 0) && <progress value={index} max={currentCards.length-1}></progress>}
            </div>
        </div>
    )
}