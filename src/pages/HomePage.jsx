import { useState } from "react";
import "../stylesheets/Main.css";
import SetList from "../components/SetList";

export default function HomePage(){

    return (
        <div id="main">
            <h2>All flashcard sets</h2>
            <SetList/>
            <br></br>
            <button onClick={()=> {
                localStorage.clear();
                window.location.reload();
            }}>DELETE ALL</button>
        </div>
    )
}

const homeLoader = () => {
    const sets = localStorage.getItem("SETS");
    return sets ? JSON.parse(sets) : [];
}