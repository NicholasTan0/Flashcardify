import "../stylesheets/Main.css";

export default function Main({sets, viewSet}){

    if(!sets.length) return(
        <>
        <h1>No flashcard sets yet. Create the first one!</h1>
        </>
    )
    else return(
        <>
            <ul id="main">
                {sets.map((item, index) => (
                    //TODO SET VIEW MAKE NEW USESTATE
                    <li key={index} onClick={() => viewSet(item)} className="set">
                        <h2>{item.title}</h2>
                        <div>{item.flashcards.length} {item.flashcards.length === 1 ? "term" : "terms"}</div>
                    </li>
                ))}
            </ul>
        </>
    )
}