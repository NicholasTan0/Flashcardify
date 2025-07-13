import { useNavigate } from "react-router-dom";

export default function SetList({ allSets }){
    let navigate = useNavigate();

    if(allSets.length === 0){
        return <div>Nothing to see here.</div>
    }

    return (
        <ul>
            {allSets.map((item, index) => (
                <li key={index} onClick={() => navigate(`/view/${item._id}`)} className="set">
                    <div>
                        <h2>{item.title}</h2>
                        <div>{item.cards.length} {item.cards.length === 1 ? "term" : "terms"}</div>
                    </div>
                    <img src={item.diagram}></img>
                </li>
            ))}
        </ul>
    )
}