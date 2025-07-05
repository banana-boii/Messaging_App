import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "./UserContext";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser} = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login data:", data);
                alert("Login succefsul!");
                setUser({
                    user_id: data.user_id,
                    username: data.username
                });
                console.log("User object set in context:", { user_id: data.user_id, username: data.username });
                navigate("/chat");
            }else {
                alert("Invalid credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Error logging in.");
        }
        // TODO: Call backend API to login
        console.log("Logging in:", { username, password });
        
    };

    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Username: <br />
                    <input
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <br /><br />
                <label>
                    Password: <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />    
                </label>
                <br /><br />
                <button type="submit">Login</button>
            </form>
            <p>
                Dont't have an account?{" "}
                <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default LoginPage;