import "../stylesheets/Header.css";
import logo from "../images/flashcards.png";
import { Link, useNavigate } from "react-router-dom";

export default function Header({setPageView}){
    let navigate = useNavigate();

    return(
        <nav>
            <Link to='/' title="Flashcardify" id="logo">
                <img src={logo}></img>
                <div>Flashcardify</div>
            </Link>
            <input id="searchbar" type="search" placeholder="Search..."></input>
            <button onClick={()=>navigate('/create-set')} title="Create a new set" id="createButton">+</button>
        </nav>
    )
}