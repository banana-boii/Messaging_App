import React, {useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "./UserContext";

function ChatPage(){

    const navigate = useNavigate();
    const [searchUsername, setSearchUsername] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user && selectedFriend) {
            console.log("User object in ChatPage:", user);
            fetch (`http://127.0.0.1:8000/messages/${user.user_id}/${selectedFriend.user_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Friends data received:", data);
                    setMessages(data.slice(-20));// Display last 20 messages
                });      
        }
    }, [user, selectedFriend]);

    useEffect(() => {
        if (user) {
            console.log("User object in ChatPage:", user);
            fetch (`http://127.0.0.1:8000/friends/${user.user_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Friends data received:", data);
                    setFriends(data);
                    if (data.length > 0) {
                        setSelectedFriend(data[0]); // Automatically select the first friend
                    }
                });      
        }
    }, [user]);

    const handleLogout = () => {
        navigate("/");
    }

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedFriend || !user) return;

        const response = await fetch("http://127.0.0.1:8000/send-message/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sender_id: user.user_id,
                receiver_id: selectedFriend.user_id,
                message: messageText
            })
        });

        if (response.ok) {
            setMessageText("");
            console.log("Message sent successfully");
        }else {
            const err = await response.json();
            alert("Error sending message: " + (err.detail || "Unknown error"));
            console.error("Error sending message:", err);
        }
    };

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
                        placeholder="Search user by username"
                    />
                    <button onClick={handleSearch}>Search</button>
                    {searchResult && (
                        <div>
                            <p>{searchResult.username}</p>
                            <button onClick={handleAddFriend}>Add</button>
                        </div>
                    )}
                </div>
                <hr />
                {selectedFriend ? (
                    <div style={{ paddingBottom: "70px" }}>
                        <div style={{ maxHeight: "60vh", overflowY: "auto", marginBottom: "10px" }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{
                                    textAlign: msg.sender_id == user.user_id ? "right":"left",
                                    margin: "5px 0"
                                }}>
                                    <span style={{
                                        display: "inline-block",
                                        background: msg.sender_id === user.user_id ? "#007bff" : "#eee",
                                        color: msg.sender_id === user.user_id ? "#fff" : "#333",
                                        borderRadius: "10px",
                                        padding: "6px 12px",
                                        maxwidth: "60%",
                                        wordBreak: "break-word"
                                    }}>
                                        {msg.content}
                                    </span>
                                </div>
                            ))}
                        </div>
                    
                    <div style={{ position: "fixed", bottom: 0, width: "100%", padding: "10px", backgroundColor: "#f9f9f9", display: "flex", alignItems: "center", borderTop: "1px solid #ccc", boxSizing: "border-box" }}>
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type your message..."
                            style={{ flexGrow: 1, width: "80%", padding: "8px", fontSize: "1rem", borderRadius: "5px", boder: "1px solid #ccc", backgroundColor: "#fff", marginRight: "10px", minWidth: 0 }}
                            />
                        <button onClick={handleSendMessage} style={{padding: "8px 16px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" ,whiteSpace: "nowrap"}}>Send</button>
                    </div>
                </div>
                ) : (
                    <div>
                        <h2>Select a friend to chat</h2>
                    </div>
                )}
           </div>
        </div>
         
    )
}
export default ChatPage;