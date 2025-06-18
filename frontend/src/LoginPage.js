import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Login succefsul!");
            }else {
                alert("Invalid credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Error logging in.");
        }
        // TODO: Call backend API to login
        console.log("Logging in:", { email, password });
    };

    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Email: <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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