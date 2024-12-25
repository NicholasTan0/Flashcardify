import { useEffect, useState } from "react";
import "../stylesheets/Create.css";
import { useNavigate } from "react-router-dom";

export default function Create(){
    let navigate = useNavigate();

    const [cards, setCards] = useState([{index: 0, term: "", definition: "", img: null}]);
    const [title, setTitle] = useState("");

    useEffect(()=>{
        console.log(cards);
    },[cards]);

    const handleImageUpload = (index, event) => {
        console.log("index: ", index);
        const file = event.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result;
                setCards((prevCards) =>
                    prevCards.map((card) =>
                        card.index === index ? { ...card, img: base64Image } : card
                ));
            }
            reader.readAsDataURL(file);
            // const fileURL = URL.createObjectURL(file);
            // setCards((prevCards) =>
            //     prevCards.map((card) =>
            //         card.index === index ? { ...card, img: fileURL } : card
            // ));
        }
    }

    const handleInputChange = (index, field, value) => {
        console.log("index: ", index);
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
        <div className="createContainer">
            <div className="headContainer">
                <h2>Create a new flashcard set</h2>
                <label htmlFor="title">Title</label>
                <div style={{display: "flex"}}>
                    <input 
                        id="title"
                        placeholder="Enter a title"
                        value={title}
                        onChange={handleTitle}>
                    </input>
                </div>
            </div>
            <ul>
                {cards.map((card, index) => {
                    return <li className="card" key={card.index}>
                        <div className="cardContainer">
                            <div className="idx">{index + 1}</div>
                            <div className="termContainer">
                                <div className="inputContainer">
                                    <input
                                        id="term"
                                        type="text"
                                        placeholder="Enter term"
                                        value={card.term}
                                        onChange={(e) => handleInputChange(card.index, "term", e.target.value)}
                                    />
                                </div>
                                <label htmlFor="term">Term</label>
                            </div>
                            <div className="definitionContainer">
                                
                                    <div className="inputContainer">
                                        <input
                                            id="definition"
                                            type="text"
                                            placeholder="Enter definition"
                                            value={card.definition}
                                            onChange={(e) => handleInputChange(card.index, "definition", e.target.value)}
                                        />
                                        <img 
                                            src={card.img}
                                            style={{display: card.img ? "block" : "none"}}
                                        />
                                        <label title="Add image" htmlFor={`addImg${card.index}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 80c8.8 0 16 7.2 16 16l0 319.8-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3L48 96c0-8.8 7.2-16 16-16l384 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                                        </label>
                                        <input 
                                            id={`addImg${card.index}`} 
                                            type="file" 
                                            accept=".png, .jpg, .jpeg"
                                            onChange={(e) => handleImageUpload(card.index, e)}
                                        />
                                    </div>
                                <label htmlFor="definition">Definition</label>
                            </div>
                            <button className={cards.length === 1 ? 'bad' : 'good'} disabled={cards.length === 1} title="Delete this card" id="trash" onClick={() => deleteCard(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </button>
                        </div>
                    </li>
                })}
                <div className="addContainer"><button id="addButton" onClick={addCard}><span>+ ADD CARD</span></button></div>
            </ul>
            <div className="createSetContainer"><button onClick={()=>{
                    let newSet = {
                        id: Date.now(),
                        title: title.length ? title : "Untitled Set",
                        flashcards: cards,
                    };
                    let currentSets = JSON.parse(localStorage.getItem('SETS')) || [];
                    currentSets.push(newSet);
                    localStorage.setItem('SETS', JSON.stringify(currentSets));
                    navigate('/');
                }} 
                id="createSetButton">Create</button></div>
        </div>
    )
}