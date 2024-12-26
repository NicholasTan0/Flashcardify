import { useNavigate } from "react-router-dom";

export default function SetList({ sets }){
    let navigate = useNavigate();

    if(sets.length === 0) return <div>Nothing yet!</div>
    return (
        <div>
            <ul>
                {sets.map((item, index) => (
                    <li key={index} onClick={() => navigate(`/${item.id}`)} className="set">
                        <h2>{item.title}</h2>
                        <div>{item.flashcards.length} {item.flashcards.length === 1 ? "term" : "terms"}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}