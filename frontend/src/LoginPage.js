import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
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
                        type="text"
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