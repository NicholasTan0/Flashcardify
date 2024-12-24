import { NavLink, Link } from "react-router-dom";
import "../stylesheets/Main.css"
import logo from "../images/flashcards.png";

export default function NotFoundPage(){
    return (
        <div className="error-page">
            <Link to='/' id="logo">
                <img src={logo}></img>
                <div>Flashcardify</div>
            </Link>
            <div>This page isn't available. Sorry about that.</div>
            <NavLink to='/'>Home</NavLink>
        </div>
    )
}