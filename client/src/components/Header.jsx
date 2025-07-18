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
            {/* <input id="searchbar" type="search" placeholder="Search for titles, tags, or users..."></input> */}
            <button onClick={()=>navigate('/create')} id="createButton">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                </svg>
                <span>Create</span>
            </button>
        </header>
    )
}