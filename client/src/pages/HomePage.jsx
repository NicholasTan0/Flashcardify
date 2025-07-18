import "../stylesheets/Main.css";
import SetList from "../components/SetList";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../App";


export default function HomePage(){
    const [allSets, setAllSets] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/set/list`);
            if(response.data.success) setAllSets(response.data.sets);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchList();
    },[])

    return (
        <>
        <div className="main">
            <h2>All flashcard sets</h2>
            <SetList
                allSets={allSets}
            />
        </div>
        </>
    )
}