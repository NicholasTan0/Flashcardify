import { useEffect, useState } from "react";

export default function Tester(){
    const [word, setWord] = useState("");
    const [related, setRelated] = useState([]);

    var relatedArray = [];

    const foo = () => {
        let modifiedWord = word.trim().replace(/\s+/g, " ");
        fetch(`https://api.conceptnet.io/c/en/${modifiedWord.replace(/ /g, "_")}?offset=0&limit=500`)
        .then(response => response.json())
        .then(data => {
            relatedArray = [];
            for(let edge of data.edges) {
                if(relatedArray.length >= 10) break;

                if(edge["@id"].includes("RelatedTo") && edge.end.language === "en" && edge.end.label !== word && !relatedArray.includes(edge.end.label)) {
                    relatedArray.push(edge.end.label);
                }
            }
            setRelated(relatedArray);
            console.log("DONE...!");
        })
        .catch(error => console.error(error));
    }

    const handleInput = (event) => {
        setWord(event.target.value);
    }

    return (
        <div>
            <input value={word} onChange={handleInput}></input>
            <button onClick={foo}>Generate</button>
            <ol>
            {related.map((term, index)=>
                <li key={term + index}>
                    {term}
                </li>
            )}
            </ol>
        </div>
    )
}