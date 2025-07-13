import "../stylesheets/Header.css";
import logo from "../images/flashcards.png";
import { Link, useNavigate } from "react-router-dom";

export default function Header(){
    let navigate = useNavigate();

    return(
        <header>
            <div>
                <Link to='/' id="logo">
                    <img src={logo}></img>
                    <span>Flashcardify</span>
                </Link>
            </div>
            <input id="searchbar" type="search" placeholder="Search for titles, tags, or users..."></input>
            <button onClick={()=>navigate('/create')} id="createButton">
                <span>+</span>
                Create
            </button>
        </header>
    )
}