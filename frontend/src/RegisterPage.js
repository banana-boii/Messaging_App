import React, {useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        // TODO: Call backend API to register
        console.loglog("Registering:", {username, password });

    };

    return(
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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