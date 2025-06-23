import React, {useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/users/", {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                alert("Account created! You can now log in.");
                navigate("/");
            } else {
                const err = await response.json();
                alert("Registration failed: " + (err.detail || "Unknown error"));
            }
        } catch (err) {
            console.error("Error during registration:", err);
            alert("Something went wrong!");
        }
        // TODO: Call backend API to register
        console.log("Registering:", {email, password });

    };

    return(
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Create Account</button>
            </form>
                <p>
                    Already have an account?{" "}
                    <Link to="/">Login here</Link>
                </p>
        </div>
    );
}

export default RegisterPage;