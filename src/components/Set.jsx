import { Link, useNavigate, useParams } from "react-router-dom";
import "../stylesheets/Set.css"
import { useState } from "react";

export default function Set(){
    // let navigate = useNavigate();
    const { id } = useParams();
    const numberId = Number(id);
    if(Number.isNaN(numberId)){
        return (
            <div className="no-set">
                <h2>This set was either deleted or does not exist. Sorry!</h2>
                <Link to='/'>Home</Link>
            </div>
        )
    }

    let currentSets = JSON.parse(localStorage.getItem('SETS')) || [];
    const set = currentSets.find((s) => s.id === numberId);
    if(!set){
        return (
            <div className="no-set">
                <h2>This set was either deleted or does not exist. Sorry!</h2>
                <Link to='/'>Home</Link>
            </div>
        )
    }

    const [isFlipped, setIsFlipped] = useState(false);
    const [index, setIndex] = useState(0); 

    return (
        <div id="main">
            <h1>{set.title}</h1>
            <div className="flashcard-container">
                <div onClick={()=>{setIsFlipped(!isFlipped)}} className={`flashcard ${isFlipped ? 'flipped' : ''} `}>
                    <div className="card-front">
                        <div id="termText">{set.flashcards[index].term}</div>
                    </div>
                    <div className="card-back">
                        <div id="definitionText" style={{display: set.flashcards[index].definition ? "block" : "none"}}>{set.flashcards[index].definition}</div>
                        {set.flashcards[index].img && (
                            <img
                            src={set.flashcards[index].img}
                            // style={{ width: "100px", height: "auto" }}
                        />)}
                    </div>
                </div>
                <div className="arrowsContainer">
                    <button onClick={() => {setIsFlipped(false); setTimeout(()=>setIndex(index - 1), 50);}} disabled={!index}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg></button>
                    <span> {index + 1} / {set.flashcards.length} </span>
                    <button onClick={() => {setIsFlipped(false); setTimeout(()=>setIndex(index + 1), 50);}} disabled={(index + 1) === set.flashcards.length}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg></button>
                </div>
            </div>
        </div>
    );
}