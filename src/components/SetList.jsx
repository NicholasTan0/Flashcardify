import { useNavigate } from "react-router-dom";

export default function SetList(){
    let navigate = useNavigate();

    let sets = JSON.parse(localStorage.getItem('SETS')) || [];

    if(sets.length === 0) return <div>Nothing yet!</div>
    return (
        <div>
            <ul>
                {sets.map((item, index) => (
                    //TODO SET VIEW MAKE NEW USESTATE?
                    <li key={index} onClick={() => navigate(`/set/${item.id}`)} className="set">
                        <h2>{item.title}</h2>
                        <div>{item.flashcards.length} {item.flashcards.length === 1 ? "term" : "terms"}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}