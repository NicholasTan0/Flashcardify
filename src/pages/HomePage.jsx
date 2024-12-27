import "../stylesheets/Main.css";
import SetList from "../components/SetList";
import { useEffect, useState } from "react";
import Testing from "../components/experimental/Testing";

export default function HomePage({ sets, setSets }){

    return (
        <div id="main">
            <Testing></Testing>
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