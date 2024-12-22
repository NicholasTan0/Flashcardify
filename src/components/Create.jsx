import { useEffect, useState } from "react";
import "../stylesheets/Create.css";

export default function Create({setPageView, addSet}){

    const [cards, setCards] = useState([{index: 0, term: "", definition: "", img: null}]);
    const [title, setTitle] = useState("");
    
    const handleInputChange = (index, field, value) => {
        setCards((prevCards) =>
            prevCards.map((card) =>
                card.index === index ? { ...card, [field]: value } : card
        ));
    };
    
    const addCard = () => {
        setCards([...cards, {index: cards.length, term: "", definition: "", img: null}])
    }

    const deleteCard = (index) => {
        
        setCards(cards => {
            return cards
            .filter((card) => card.index !== index)
            .map((card, newIndex) => ({...card, index: newIndex}));
        })  
    }

    const handleTitle = (event) => {
        setTitle(event.target.value)
    };

    return(
        <>
        <div className="createContainer">
            <div className="headContainer">
                <h2>Create a new flashcard set</h2>
                <label htmlFor="title">Title</label>
                <div style={{display: "flex"}}><input 
                id="title"
                placeholder="Enter a title"
                value={title}
                onChange={handleTitle}></input></div>
            </div>
            <ul>
                {cards.map((card, index) => {
                    return <li className="card" key={card.index}>
                        <div className="cardContainer">
                            <div className="idx">{index + 1}</div>
                            <div className="termContainer">
                                <input
                                    id="term"
                                    type="text"
                                    placeholder="Enter term"
                                    value={card.term}
                                    onChange={(e) => handleInputChange(card.index, "term", e.target.value)}
                                />
                                <label htmlFor="term">Term</label>
                            </div>
                            <div className="definitionContainer">
                                
                                    <input
                                        id="definition"
                                        type="text"
                                        placeholder="Enter definition"
                                        value={card.definition}
                                        onChange={(e) => handleInputChange(card.index, "definition", e.target.value)}
                                    />
                                    
                                
                                <label htmlFor="definition">Definition</label>
                            </div>
                            <button className={cards.length === 1 ? 'bad' : 'good'} disabled={cards.length === 1} title="Delete this card" id="trash" onClick={() => deleteCard(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </button>
                        </div>
                    </li>
                })}
                <div className="addContainer"><button id="addButton" onClick={addCard}><span>+ Add Card</span></button></div>
            </ul>
            <div className="createSetContainer"><button onClick={()=>{
                    let completeSet = {
                        title: title.length ? title : "Untitled Set",
                        flashcards: cards,
                    };
                    addSet(completeSet);
                    setPageView("main");
                }} 
                id="createSetButton">Create</button></div>
            <button onClick={()=> {
                // console.log(JSON.parse(localStorage.getItem("SETS")))
                localStorage.clear();
                window.location.reload();
            }}>CLEAR STORAGE</button>
        </div>

        </>
    )
}