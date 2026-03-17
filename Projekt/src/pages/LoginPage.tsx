import { useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";

const mainStyle = {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem 3rem"
}
const inputStyle = {
    width: "100%", 
    padding: "0.5em", 
    backgroundColor: "#f8f6f1",
    border: "1px solid #e4dfd4",
    color: "rgb(56, 56, 56)",
    borderRadius: "5px",
    marginTop: "5px"
}

const buttonStyle = {
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "0.7em 1.5em",
    cursor: "pointer",
    maxWidth: "200px",
    width: "100%",
    display: "block",
    margin: "0 auto"
}
const titleStyle: CSSProperties = {
    fontSize: "2rem",
    color: "#2f3a2f",
    marginBottom: "2rem",
    textAlign: "center"
}

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const resp = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.message || "Fel användarnamn eller lösenord");
            }

            // Spara token
            localStorage.setItem("token", data.token);

            // Skicka användaren till admin
            navigate("/admin");

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <main style={mainStyle}>
            <h2 style={titleStyle}>Logga in</h2>
            <div className="login_form" style={{maxWidth: "400px", margin: "auto"}}>
                <form onSubmit={handleSubmit}>
                {error && <p style={{ color: "red", marginTop: "1em", marginBottom: "1em", textAlign: "center" }}>{error}</p>}
                    <div style={{ marginBottom: "1em" }}>
                        <label>Användarnamn:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "1em" }}>
                        <label>Lösenord:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <button type="submit" style={{...buttonStyle, backgroundColor: "crimson", marginBottom: "1rem"}}>Logga in</button>
                </form>
                <button style={{...buttonStyle, backgroundColor: "rgb(174, 16, 48)"}}>
                        <Link to="/register" style={{color: "white", textDecoration: "none"}}>Skapa konto</Link>
                </button>
            </div>
        </main>
    )
}

export default LoginPage;