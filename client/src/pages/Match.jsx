import "../stylesheets/Match.css"
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { backendURL } from "../App";

export default function Match(){
    const { id } = useParams();
    if (!/^[a-f0-9]{24}$/.test(id)) return <Navigate to={'/error'}/>;
    
    let navigate = useNavigate();

    const [startGame, setStartGame] = useState(false);
    const [currentSet, setCurrentSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pick1, setPick1] = useState(null);
    const [pick2, setPick2] = useState(null);
    const [matchArray, setMatchArray] = useState([]);
    const [doneArray, setDoneArray] = useState([]);
    const [wrong, setWrong] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalIdRef = useRef(null);
    const startTimeRef = useRef(null);
    const myMapRef = useRef(new Map());

    useEffect(()=>{
        startGame ? start() : stop();
    }, [startGame])

    useEffect(()=>{
        if(isRunning === true){
            intervalIdRef.current = setInterval(()=>{
                setElapsedTime(Date.now() - startTimeRef.current);
            },10);
        }

        return () => {
            clearInterval(intervalIdRef.current);
        }
    }, [isRunning])

    function start(){
        if(isRunning) return;
        setIsRunning(true);
        startTimeRef.current = Date.now() - elapsedTime;
    }

    function stop(){
        setIsRunning(false);
    }

    function reset(){
        setElapsedTime(0);
        setIsRunning(false);
    }

    function formatTime(){
        let seconds = Math.floor(elapsedTime/(1000) % 60);
        let milliseconds = Math.floor((elapsedTime % 1000) / 100);

        return `${seconds}.${milliseconds}`;
    }

    function shuffle(array) {
        for(let i = array.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const fetchSet = async () => {
        try {
            const response = await axios.post(`${backendURL}/api/set/single`, { id });
            if(response.data.success){
                setCurrentSet(response.data.set);
                gameFun(response.data.set.cards);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const gameFun = (arr) => {
        let random6 = shuffle(arr).slice(0,6);
        let myArr = []
        let myMap = new Map();
        for(const rand of random6){
            const termObj = {
                term: rand.term,
                termImg: rand.termImg,
            }
            const definitionObj = {
                definition: rand.definition,
                definitionImg: rand.definitionImg,
            }
            myArr.push((termObj));
            myArr.push((definitionObj));
            if(!myMap.has(JSON.stringify(termObj))){
                myMap.set(JSON.stringify(termObj), []);
            }
            myMap.get(JSON.stringify(termObj)).push(definitionObj);
        }
        myMapRef.current = myMap;
        let shuffled = shuffle(myArr);
        setMatchArray(shuffled);
    }

    useEffect(()=>{
        fetchSet();
        reset();
    },[])

    useEffect(()=>{
        if(pick2){
            if(myMapRef.current.get(JSON.stringify(pick2.item))?.some(obj => 
                (obj.term === pick1.item.term && obj.termImg === pick1.item.termImg) && (obj.definition === pick1.item.definition && obj.definitionImg === pick1.item.definitionImg)
            ) || myMapRef.current.get(JSON.stringify(pick1.item))?.some(obj => 
                (obj.term === pick2.item.term && obj.termImg === pick2.item.termImg) && (obj.definition === pick2.item.definition && obj.definitionImg === pick2.item.definitionImg)
            )){
                setDoneArray(prev => [...prev, pick1.index, pick2.index]);
                setTimeout(()=>{
                    setPick1(null);
                    setPick2(null);
                }, 200)
            }
            else{
                setWrong(true);
                setTimeout(()=>{
                    setPick1(null);
                    setPick2(null);
                    setWrong(false);
                }, 200)
            }
        }
    }, [pick2])

    useEffect(()=>{
        if(doneArray.length === matchArray.length){
            setStartGame(false);
        }
    }, [doneArray])
    

    if(loading) return (
        <div className="loading"></div>
    )

    if(!currentSet) return (
        <div className="no-set">
            <h2>This set was either deleted or does not exist. Sorry!</h2>
            <Link to="/">Home</Link>
        </div>
    )

    if(!startGame && !doneArray) return (
        <div className="main">
            <div className="closeButtonContainer">
                <button className="closeButton" title="Close" onClick={()=>{
                    navigate(`/${id}`);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
            </div>
            <div className="start-container">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
                </svg>
                <h1>Ready to play?</h1>
                <p>Match all the terms with their definitions as fast as you can.</p>
                <button onClick={()=>setStartGame(true)}>Start game</button>
            </div>
        </div>
    )

    return (
        <div className="main">
            <div className="match-header">
                <h2>{currentSet.title}</h2>
                <div className="stopwatch">
                    <div className="display">{formatTime()}</div>
                </div>
                <button className="closeButton" title="Close" onClick={()=>{
                    stop();
                    navigate(`/${id}`);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
            </div>
            {matchArray.length !== doneArray.length ? <div className="grid">
                {matchArray.map((item, index) => 
                    <div key={index} 
                    className={`c1 ${doneArray.includes(index) ? "hidden" : ""} ${(pick1?.index == index) || (pick2?.index == index) ? `selected ${wrong ? "wrong" : ""}` : ""}`}
                     onClick={()=>{
                                if(index == pick1?.index) setPick1(null);
                                else if(index == pick2?.index) setPick2(null);
                                else if(!pick1) setPick1({item, index});
                                else if(!pick2) setPick2({item, index});
                                else{
                                    setPick1(null);
                                    setPick2(null);
                                }
                        }}>
                        <div 
                             
                            style={item.termImg || item.definitionImg ? { backgroundImage: `url(${item.termImg || item.definitionImg})` } : {}}
                            className="item"
                        >
                        </div>
                        <div className="c2">
                            {item.term}
                            {item.definition}
                        </div>
                    </div>
                )}
            </div> : <div className="end-container">
                    <h2>Well done! Can you beat your score?</h2>
                    <button onClick={()=>{
                        reset();
                        setPick1(null);
                        setPick2(null);
                        setStartGame(true);
                        setDoneArray([]);
                        setMatchArray([]);
                        gameFun(currentSet.cards);
                    }}>Play again</button>
            </div>}
        </div>
    )
}