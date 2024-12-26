import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Edit({ sets, setSets }){
    let navigate = useNavigate();

    const modal = useRef();

    const { id } = useParams();
    const numberId = Number(id);
    const set = !Number.isNaN(numberId) && sets.find((s) => s.id === numberId);

    const [cards, setCards] = useState(set.flashcards);
    const [title, setTitle] = useState(set.title);
    const [selectedImg, setSelectedImg] = useState(null);
    const [err, setErr] = useState(false);

    // useEffect(()=>{
    //     console.log("THIS ONE: ", cards);
    // },[cards]);

    function hasEmpty(card){
        return !(card.term?.trim() && (card.definition?.trim() || card.img));
    }

    const handleImageUpload = (index, event) => {
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
        }
        event.target.value = null;
    }

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

    const handleDeleteImg = (index) => {
        setCards(cards.map(card => card.index === index ? {...card, img: null} : card));
    }

    const handleSave = () => {
        let unfinished = cards.some(hasEmpty);
        setErr(unfinished);

        if(unfinished){
            alert("There are one or more missing terms/definitions. Please fill them in and try again.");
        } else{
            let updatedSets = sets.map(curSet => curSet.id === numberId ? {...curSet, title: title.length ? title : "Untitled Set", flashcards: cards} : curSet);
            setSets(updatedSets);
            navigate('/');
        }
    }

    return set ? (
        <div className="createContainer">
            <div className="headContainer">
                <button 
                    id="backButton"
                    onClick={()=>{navigate(`/${id}`)}}
                >
                    ← Back
                </button>
                <br></br>
                <label id="titleLabel" htmlFor="title">Title</label>
                <input 
                    id="title"
                    placeholder="Enter a title"
                    value={title}
                    onChange={handleTitle}>
                </input>
                <label id="diagramLabel" htmlFor="diagram">+ Add a diagram</label>
                <input id="diagram" type="file"></input>
            </div>
            <ul>
                {cards.map((card, index) => {
                    return <li className="card" key={`id${index}`}>
                        <div className="cardContainer">
                            <div className="idx">{index + 1}</div>
                            <div className="termContainer">
                                <div className="inputContainer">
                                    <textarea
                                        placeholder="Enter term"
                                        value={card.term}
                                        onChange={(e) => handleInputChange(card.index, "term", e.target.value)}
                                    />
                                </div>
                                <span style={{color: `${err && !card.term?.trim() ? "#FF725B" : ""}`}}>TERM</span>
                            </div>
                            <div className="definitionContainer">
                                
                                    <div className="inputContainer">
                                        <textarea
                                            placeholder="Enter definition"
                                            value={card.definition}
                                            onChange={(e) => handleInputChange(card.index, "definition", e.target.value)}
                                        />
                                        <div className="imgContainer">
                                            <div className="imgPreview">
                                                <img 
                                                    src={card.img}
                                                    style={{display: card.img ? "block" : "none"}}
                                                    onClick={()=>{
                                                        setSelectedImg({idx: card.index, src: card.img});
                                                        modal.current.showModal();
                                                    }}
                                                />
                                            </div>
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
                                    </div>
                                    <span style={{color: `${err && !(card.definition?.trim() || card.img) ? "#FF725B" : ""}`}}>DEFINITION</span>
                            </div>
                            <button onClick={() => deleteCard(index)} className={cards.length === 1 ? 'not-allowed' : 'allowed'} disabled={cards.length === 1} title="Delete this card" id="trash">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </button>
                        </div>
                        
                    </li>
                })}
                <div className="card addContainer">
                    <button id="addButton" onClick={addCard}>
                        <span>+ ADD CARD</span>
                    </button>
                </div>
                <dialog className="modal" ref={modal}>
                    <img 
                        src={selectedImg?.src}
                        id="viewImage"
                        onClick={()=>modal.current.close()}
                        style={{cursor: "zoom-out"}}
                    />
                    <div className="modalText">
                        <span>Click anywhere on the image to close.</span>
                        <p>OR</p>
                        <button className="deleteButton" onClick={()=>{handleDeleteImg(selectedImg.idx); modal.current.close()}}>Remove Image</button>
                    </div>
                </dialog>
            </ul>
            <div className="createSetContainer"><button onClick={handleSave} 
                id="createSetButton">Save</button></div>
        </div>
    ) : (
        <div className="no-set">
            <h2>This set was either deleted or does not exist. Sorry!</h2>
            <Link to="/">Home</Link>
        </div>
    );
}