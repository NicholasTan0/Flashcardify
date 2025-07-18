import "../stylesheets/Match.css"
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { backendURL } from "../App";

export default function Match(){
    const { id } = useParams();
    if (!/^[a-f0-9]{24}$/.test(id)) return <Navigate to={'/error'}/>;
    
    let navigate = useNavigate();

    const [currentSet, setCurrentSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pick1, setPick1] = useState(null);
    const [pick2, setPick2] = useState(null);
    const [matchArray, setMatchArray] = useState([]);
    const [doneArray, setDoneArray] = useState([]);
    const [wrong, setWrong] = useState(false);

    const myMapRef = useRef(new Map());

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
                let random6 = shuffle(response.data.set.cards).splice(0,6);
                let myArr = []
                let myMap = new Map();
                for(const rand of random6){
                    myArr.push(rand.term);
                    myArr.push(rand.definition);
                    
                    if(!myMap.has(rand.term)){
                        myMap.set(rand.term, []);
                    }
                    myMap.get(rand.term).push(rand.definition);
                }
                myMapRef.current = myMap;
                setMatchArray(shuffle(myArr));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchSet();
    },[])

    useEffect(()=>{
        if(pick2){
            if(myMapRef.current.get(pick2.item)?.includes(pick1.item) || myMapRef.current.get(pick1.item)?.includes(pick2.item)){
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
            <div className="match-header">
                <h2>{currentSet.title}</h2>
                <span>0:00</span>
                <button className="closeButton" title="Close" onClick={()=>navigate(`/${id}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
            </div>
            {matchArray.length !== doneArray.length ? <div className="grid">
                {matchArray.map((item, index) => 
                    <div key={index} className={`item ${doneArray.includes(index) ? "hidden" : ""} ${(pick1?.index == index) || (pick2?.index == index) ? `selected ${wrong ? "wrong" : ""}` : ""}`} onClick={()=>{
                        if(index == pick1?.index) setPick1(null);
                        else if(index == pick2?.index) setPick2(null);
                        else if(!pick1) setPick1({item, index});
                        else if(!pick2) setPick2({item, index});
                        else{
                            setPick1(null);
                            setPick2(null);
                        }
                    }}>
                        {item}
                    </div>
                )}
            </div> : <div>
                All done!
            </div>}
        </div>
    )
}