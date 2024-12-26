import "../stylesheets/Main.css";
import SetList from "../components/SetList";

export default function HomePage({ sets, setSets }){
    return (
        <div id="main">
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