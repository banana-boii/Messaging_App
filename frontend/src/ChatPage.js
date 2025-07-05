import React, {useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "./UserContext";

function ChatPage(){

    const navigate = useNavigate();
    const [searchUsername, setSearchUsername] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            console.log("User object in ChatPage:", user);
            fetch (`http://127.0.0.1:8000/friends/${user.user_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Friends data received:", data);
                    setFriends(data);
                });      
        }
    }, [user]);

    const handleLogout = () => {
        navigate("/");
    }

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/search?username=${searchUsername}`);            
            if (response.ok){
                const data = await response.json();
                console.log("Search result:", data);
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
         if (!user) {
            alert("User not logged in!");
            return;
        }
        const response = await fetch("http://127.0.0.1:8000/add-friend/", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user.user_id,
                friend_username: searchResult.username,
            }),
        });
        //console.log("Add friend response:", response);

        const result = await response.json();
        console.log("Add friend result:", result);
        if (response.ok) {
            alert("Friend added!");
            setSearchResult(null);
            setSearchUsername("");
            fetch(`http://127.0.0.1:8000/friends/${user.user_id}`)
                .then(response => response.json())
                .then(data => setFriends(data));
        } else {
            alert("Error: " + (result.detail || JSON.stringify(result)));
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* sidebar */}
           <div style={{ width: "250px", background: "#f0f0f0", padding: "10px"}}>
                <h3>Friends</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {friends.map(f => (
                        <li
                            key={f.user_id}
                            style={{ padding: "8px", cursor: "pointer", background: selectedFriend && selectedFriend.user_id === f.user_id ? "#ddd" : "transparent"}}
                            onClick={() => setSelectedFriend(f)}
                        >
                            {f.username}
                        </li>
                    ))}
                </ul>
                <button onClick={handleLogout}>Logout</button>
           </div>
           <div style={{ flex: 1, padding: "20px" }}>
                <div>
                    <input
                        type="text"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        placeholder="Search usesr by email"
                    />
                    <button onClick={handleSearch}>Search</button>
                    {searchResult && (
                        <div>
                            <p>{searchResult.email}</p>
                            <button onClick={handleAddFriend}>Add</button>
                        </div>
                    )}
                </div>
                <hr />
                {selectedFriend ? (
                    <div>
                        <h2>Chat with {selectedFriend.username}</h2>
                        {/* Chat messages and input would go here */}
                    </div>
                ) : (
                    <div>
                        <h2>Select a friend to chat</h2>
                    </div>
                )}
           </div>
        </div>
    );
}
export default ChatPage;