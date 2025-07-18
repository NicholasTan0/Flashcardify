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
    const [loading, setLoading] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);
    const [index, setIndex] = useState(0); 

    const fetchSet = async () => {
        try {
            const response = await axios.post(`${backendURL}/api/set/single`, { id });
            if(response.data.success) setCurrentSet(response.data.set);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
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
            <button className="closeButton" title="Close" onClick={()=>navigate(`/${id}`)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
            </button>
            <div className="flashcard-container">
                <div onClick={()=>{setIsFlipped(!isFlipped)}} className={`flashcard ${isFlipped ? 'flipped' : ''} `}>
                    <div className="card-front">
                        <div id="termText">{currentSet?.cards[index].term}</div>
                        {currentSet?.cards[index].termImg &&
                        <img src={currentSet?.cards[index].termImg}/>}
                    </div>
                    <div className="card-back">
                            <div id="definitionText">{currentSet?.cards[index].definition}</div>
                            {currentSet?.cards[index].definitionImg &&
                            <img src={currentSet?.cards[index].definitionImg}/>}
                    </div>
                </div>
                <div className="arrowsContainer">
                    <button onClick={() => {setIsFlipped(false); setTimeout(()=>setIndex(index - 1), 50);}} disabled={!index}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg></button>
                    <span> {index + 1} / {currentSet?.cards.length} </span>
                    <button onClick={() => {setIsFlipped(false); setTimeout(()=>setIndex(index + 1), 50);}} disabled={(index + 1) === currentSet?.cards.length}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg></button>
                </div>
                {(currentSet?.cards.length-1 !== 0) && <progress value={index} max={currentSet?.cards.length-1}></progress>}
            </div>
        </div>
    )
}