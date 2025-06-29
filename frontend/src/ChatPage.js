import React, {useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../UserContext";

function ChatPage(){

    const navigate = useNavigate();
    const [searchEmail, setSearchEmail] = useState("");
    const [SearchResult, setSearchResult] = useState(null);
    const { user } = useUser();

    const handleLogout = () => {
        navigate("/");
    }

    const handleSearch = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/search?email=${searchEmail}');
            if (response.ok){
                const data = await response.json();
                setSearchResult(data);
            } else {
                setSearchResult(null);
                alert("User not found");
            }
        } catch (err) {
            alert("Search failed");
            console.error(err);
        }
    };

    const handleAddFriend = async () => {
        const response = await fetch("http://127.0.0.1:8000/add-friend/", {
            method: "Post",
            headers: {"Conntent-Typr": "application/json" },
            body: FocusEvent.stringify({
                user_id: user.user_id,
                friend_email: SearchResult.email,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Friend added!");
            setSearchResult(null);
            setSearchEmail("");
        } else {
            alert("Error: " + result.detail);
        }
    };

    return (
        <div>
            <h2>Welcome to the Chat!</h2>
            <input
                type="text"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Search user by email"
            />
            <button onClick={handleSearch}>Search</button>

            {searchResult && (
                <div>
                    <p>{searchResult.email}</p>
                    <button onClick={handleAddFriend}>Add</button>
                </div>
            )}
            <form>
                <button onClick={handleLogout}> Logout</button>
            </form>
        </div>
    )
}
export default ChatPage;