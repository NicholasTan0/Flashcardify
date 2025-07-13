import { Link, useNavigate, useParams } from "react-router-dom";
import "../stylesheets/Set.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../App";

export default function Set(){
    const { id } = useParams();
    let navigate = useNavigate();

    const [currentSet, setCurrentSet] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [index, setIndex] = useState(0); 
    const [loading, setLoading] = useState(true);

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

    const handleDelete = async () => {
        if(window.confirm("Are you sure you want to delete this set?")){
            try {
                await axios.post(`${backendURL}/api/set/remove`, { id });
            } catch (error) {
                console.log(error);
            } finally {
                navigate('/');
            }
        }
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
            <h1>{currentSet?.title}</h1>
            <div className="title-container">
                
                <button id="editButton" onClick={()=>{navigate(`/edit/${id}`)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/></svg>
                    Edit
                </button>
                <button id="deleteButton" onClick={handleDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                    Delete
                </button>
                
            </div>
            <div className="flashcard-container">
                <div onClick={()=>{setIsFlipped(!isFlipped)}} className={`flashcard ${isFlipped ? 'flipped' : ''} `}>
                    <div className="card-front">
                        <div id="termText">{currentSet?.cards[index].term}</div>
                    </div>
                    <div className="card-back">
                        <div id="definitionText" style={{display: currentSet?.cards[index].definition ? "block" : "none"}}>{currentSet?.cards[index].definition}</div>
                        {currentSet?.cards[index].definitionImg && (
                            <img
                            src={currentSet?.cards[index].definitionImg}
                        />)}
                    </div>
                </div>
                <div className="arrowsContainer">
                    <button onClick={() => {setIsFlipped(false); setTimeout(()=>setIndex(index - 1), 50);}} disabled={!index}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg></button>
                    <span> {index + 1} / {currentSet?.cards.length} </span>
                    <button onClick={() => {setIsFlipped(false); setTimeout(()=>setIndex(index + 1), 50);}} disabled={(index + 1) === currentSet?.cards.length}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg></button>
                </div>
                <progress value={index+1} max={currentSet?.cards.length}></progress>
            </div>
        </div>
    )
}