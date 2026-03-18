import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const headerStyle = {
    padding: "1rem 2rem",
    borderBottom: "1px solid #ddd"
}
const divHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem"
}
const formStyle = {
    display: "flex",
    gap: "0.5rem",
    flex: "1",
    maxWidth: "500px"
}
const inputStyle = {
    flex: "1",
    padding: "0.6rem",
    border: "solid crimson",
    borderRadius: "5px"
}
const buttonStyle = {
    padding: "0.6rem 1rem",
    backgroundColor: "crimson",
    color: "white",
    border: "solid crimson",
    borderRadius: "5px"
}
const linkStyle = {
    textDecoration: "none",
    color: "black",
    gap: "1em"
}

function Header() {
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) return;

    navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
    setSearchTerm("");
  };

  return (
    <header style={headerStyle}>
      <div style={divHeaderStyle} className="header-container">
        <h1><Link to="/" style={{color: "crimson", textDecoration: "none"}}>Bokhyllan</Link></h1>

        <form onSubmit={handleSubmit} style={formStyle} className="header-search">
          <input
            type="text"
            placeholder="Sök efter böcker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Sök</button>
        </form>

        <div className="header-links">
            {/* Olika innehåll beroende på inloggad eller inte */}
            {!token ?  (
                // Om ej inloggad visas denna
                <Link to="/login" style={linkStyle}>Logga in</Link>
            ) : (
                <>
                {/* Om inloggad visas denna */}
                <Link to="/admin" style={linkStyle}>Mina recensioner</Link>
                <button onClick={handleLogout} style={{...buttonStyle, marginLeft: "1em"}}>Logga ut</button>
                </>
            )}
        </div>
      </div>
    </header>
  );
}

export default Header;