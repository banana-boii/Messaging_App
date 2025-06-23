import React, {useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function ChatPage(){

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/");
    }
    return (
        <div>
            <h2>Welcome to the Chat!</h2>
            <form>
                <button onClick={handleLogout}> Logout</button>
            </form>
        </div>
    )
}
export default ChatPage;