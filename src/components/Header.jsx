import "../stylesheets/Header.css";
import logo from "../images/flashcards.png";

export default function Header({setPageView}){
    return(
        <>
            <div className="headerContainer">
                <div onClick={()=>{setPageView("main");}} id="logo">
                    <img src={logo}></img>
                    <div>Flashcardify</div>
                </div>
                <input id="searchbar" type="search" placeholder="Search..."></input>
                <button onClick={()=>setPageView("create")} id="createButton">+</button>
            </div>
        </>
    )
}