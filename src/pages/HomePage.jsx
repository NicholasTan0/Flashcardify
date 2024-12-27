import "../stylesheets/Main.css";
import SetList from "../components/SetList";
import { useEffect, useState } from "react";
import Artificial from "../components/Artificial";
import Gemini from "../components/Gemini";

export default function HomePage({ sets, setSets }){

    return (
        <div id="main">
            <Gemini></Gemini>
            <h2>All flashcard sets</h2>
            <SetList
                sets={sets}
            />
            <br></br>
            <button 
                className="deleteButton"
                onClick={()=> setSets([])
            }>DELETE ALL</button>
        </div>
    )
}