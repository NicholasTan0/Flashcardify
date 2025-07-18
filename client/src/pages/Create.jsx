import { useRef, useState } from "react";
import "../stylesheets/Create.css";
import { useBlocker, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendURL } from "../App";

export default function Create(){
    let navigate = useNavigate();

    const modal = useRef();

    const [cards, setCards] = useState([{
        index: 0, 
        term: "", 
        definition: "", 
        termImg: null, 
        termImgURL: null,
        definitionImg: null,
        definitionImgURL: null,
    }]);
    const [title, setTitle] = useState("");
    const [diagram, setDiagram] = useState(null);
    const [diagramURL, setDiagramURL] = useState(null);
    const [selectedImg, setSelectedImg] = useState(null);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);

    // useBlocker(() => {
    //     cards.forEach(card => {
    //         ['termImgURL', 'definitionImgURL']
    //             .forEach(field => {
    //                 const url = card[field];
    //                 if (url?.startsWith('blob:')) {
    //                     URL.revokeObjectURL(url);
    //                     console.log('Revoked:', url);
    //                 }
    //             });
    //         });
    //         return false;
    //     }
    // );

    function hasEmpty(card){
        return !((card.term?.trim() || card.termImg) && (card.definition?.trim() || card.definitionImg));
    }

    const handleDiagramUpload = (event) => {
        const file = event.target.files[0];
        if(file && file.size < (2*1000*1000)){
            setDiagram(file);
            if(diagramURL) URL.revokeObjectURL(diagramURL);
            const url = URL.createObjectURL(file);
            setDiagramURL(url);
        }
        event.target.value = null;
    }

    const handleDiagramDelete = () => {
        URL.revokeObjectURL(diagramURL);
        setDiagram(null);
        setDiagramURL(null);
    }

    const handleTermImageUpload = (index, event) => {
        const file = event.target.files[0];
        if(file && file.size < (2*1000*1000)){
            setCards((prevCards) =>
                prevCards.map((card) => {
                    if(card.index === index) {
                        if(card.termImgURL) URL.revokeObjectURL(card.termImgURL);
                        const url = URL.createObjectURL(file); 
                        return { ...card, termImg: file, termImgURL: url };
                    }
                    return card;
                })
            );
        }
        else alert(`File size too large.`);
        event.target.value = null;
    }

    const handleDefinitionImageUpload = (index, event) => {
        const file = event.target.files[0];
        if(file && file.size < (2*1000*1000)){
            setCards((prevCards) =>
                prevCards.map((card) => {
                    if(card.index === index) {
                        if(card.definitionImgURL) URL.revokeObjectURL(card.definitionImgURL); 
                        const url = URL.createObjectURL(file);
                        return { ...card, definitionImg: file, definitionImgURL: url };
                    }
                    return card;
                })
            );
        }
        else alert(`File size too large.`);
        event.target.value = null;
    }

    const handleTermInputChange = (index, value) => {
        setCards((prevCards) =>
            prevCards.map((card) =>
                card.index === index ? { ...card, term: value } : card
        ));
    };

    const handleDefinitionInputChange = (index, value) => {
        setCards((prevCards) =>
            prevCards.map((card) =>
                card.index === index ? { ...card, definition: value } : card
        ));
    };
    
    const addCard = () => {
        setCards([...cards, {index: cards.length, term: "", definition: "", termImg: null, termImgURL: null, definitionImg: null, definitionImgURL: null}])
    }

    const deleteCard = (index) => {
        setCards((prevCards) => {
            const deletedCard = prevCards.find((card) => card.index === index);
            if(deletedCard?.termImgURL) URL.revokeObjectURL(deletedCard.termImgURL);
            if(deletedCard?.definitionImgURL) URL.revokeObjectURL(deletedCard.definitionImgURL);
            return prevCards
                .filter((card) => card.index !== index)
                .map((card, newIndex) => ({ ...card, index: newIndex }));
        });
    };

    const handleTitle = (event) => {
        setTitle(event.target.value)
    };

    const handleDeleteTermImg = (index) => {
        setCards((prevCards) =>
            prevCards.map((card) => {
                if(card.index === index) {
                    if(card.termImgURL) URL.revokeObjectURL(card.termImgURL); 
                    return { ...card, termImg: null, termImgURL: null };
                }
                return card;
            })
        );
    };

    const handleDeleteDefinitionImg = (index) => {
        setCards((prevCards) =>
            prevCards.map((card) => {
                if(card.index === index) {
                    if(card.definitionImgURL) URL.revokeObjectURL(card.definitionImgURL); 
                    return { ...card, definitionImg: null, definitionImgURL: null };
                }
                return card;
            })
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let unfinished = cards.some(hasEmpty);
        setErr(unfinished);

        if(unfinished) return;

        try {
            const uploadedCards = await Promise.all(
                cards.map(async (card) => {
                    try {
                        const formData = new FormData();

                        formData.append("term", card.term);
                        formData.append("definition", card.definition);
                        if(card.termImg) formData.append("termImg", card.termImg);
                        if(card.definitionImg) formData.append("definitionImg", card.definitionImg);
                        
                        const response = await axios.post(`${backendURL}/api/card/add`, formData);
                        return response.data.card;
                    } catch (error) {
                        console.error("upload failed for one card: ", error);
                        return null;
                    }
                })
            );

            const formData = new FormData();

            formData.append("title", title);
            formData.append("diagram", diagram);
            formData.append("cards", JSON.stringify(uploadedCards
                .filter((card) => card !== null)
                .map(card => card._id)
            ));

            await axios.post(`${backendURL}/api/set/add`, formData);
        } catch (error) {
            console.error(error.message);
        } finally {
            navigate('/');
        }
    }

    return(
        <form className="main" onSubmit={handleSubmit}>
            <div className="headContainer">
                <h2>Create a new flashcard set</h2>
                <div className="titleContainer">
                    <label id="titleLabel" htmlFor="title">Title</label>
                    <input 
                        required
                        id="title"
                        placeholder="Enter a title"
                        value={title}
                        onChange={handleTitle}>
                    </input>
                </div>
                <label id="diagramLabel" htmlFor="diagram">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    <span>Add diagram</span>
                </label>
                <input id="diagram" type="file" accept=".png, .jpg, .jpeg" onChange={(e) => handleDiagramUpload(e)}></input>
                {diagram && <div className="imgPreview">
                    <div
                        role="img" 
                        style={{backgroundImage: `url(${diagramURL})`}}
                        onClick={handleDiagramDelete}
                    />
                </div>}
            </div>
            <ol>
                {cards.map((card, index) => {
                    return <li className="card" key={`id${index}`}>
                        <div className="cardContainer">
                            <div className="idx">{index + 1}</div>
                            <div className="termContainer">
                                <div className="inputContainer">
                                    <textarea
                                        required={!card.termImg}
                                        placeholder="Enter term"
                                        value={card.term}
                                        onChange={(e) => handleTermInputChange(card.index, e.target.value)}
                                    />
                                    <div className="imgContainer">
                                        {card.termImg ? <div className="imgPreview">
                                            <div
                                                role="img"
                                                style={{backgroundImage: `url(${card.termImgURL})`}}
                                                onClick={()=>{
                                                    setSelectedImg({idx: card.index, src: card.termImgURL, field: "term"});
                                                    modal.current.showModal();
                                                }}
                                            />
                                            </div> : <label title="Add image" htmlFor={`addTermImg${card.index}`}>
                                            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 80c8.8 0 16 7.2 16 16l0 319.8-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3L48 96c0-8.8 7.2-16 16-16l384 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg> 
                                        </label>}
                                        <input 
                                            id={`addTermImg${card.index}`} 
                                            type="file" 
                                            accept=".png, .jpg, .jpeg"
                                            onChange={(e) => handleTermImageUpload(card.index, e)}
                                        />
                                    </div>
                                </div>
                                <span style={{color: `${err && !(card.term?.trim() || card.termImg) ? "#FF725B" : ""}`}}>TERM</span>
                            </div>
                            <div className="definitionContainer">
                                <div className="inputContainer">
                                    <textarea
                                        required={!card.definitionImg}
                                        placeholder="Enter definition"
                                        value={card.definition}
                                        onChange={(e) => handleDefinitionInputChange(card.index, e.target.value)}
                                    />
                                    <div className="imgContainer">
                                        {card.definitionImg ? <div className="imgPreview">
                                            <div 
                                                role="img" 
                                                style={{backgroundImage: `url(${card.definitionImgURL})`}}
                                                onClick={()=>{
                                                    setSelectedImg({idx: card.index, src: card.definitionImgURL, field: "definition"});
                                                    modal.current.showModal();
                                                }}
                                            />
                                            </div> : <label title="Add image" htmlFor={`addDefinitionImg${card.index}`}>
                                            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 80c8.8 0 16 7.2 16 16l0 319.8-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3L48 96c0-8.8 7.2-16 16-16l384 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg> 
                                        </label>}
                                        <input 
                                            id={`addDefinitionImg${card.index}`} 
                                            type="file" 
                                            accept=".png, .jpg, .jpeg"
                                            onChange={(e) => handleDefinitionImageUpload(card.index, e)}
                                        />
                                    </div>
                                </div>
                                <span style={{color: `${err && !(card.definition?.trim() || card.definitionImg) ? "#FF725B" : ""}`}}>DEFINITION</span>
                            </div>
                            <button type="button" onClick={() => deleteCard(index)} className={cards.length === 1 ? 'not-allowed' : 'allowed'} disabled={cards.length === 1} title="Delete this card" id="trash">
                                <svg fill="var(--text)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </button>
                        </div>
                    </li>
                })}
                <button type="button" id="addButton" onClick={addCard}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg>
                        <span>ADD CARD</span>
                    </div>
                </button>
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
                        <button type="button" className="deleteButton" onClick={()=>{
                            selectedImg?.field === "term" ? handleDeleteTermImg(selectedImg.idx) : handleDeleteDefinitionImg(selectedImg.idx); 
                            modal.current.close();
                        }}>Remove Image</button>
                    </div>
                </dialog>
            </ol>
            <div className="createSetContainer">
                <button type="submit" className="formButton">Create</button>
            </div>
        </form>
    )
}