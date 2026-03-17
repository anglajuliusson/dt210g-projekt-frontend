import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchBooks } from "../services/books";
import type { Book } from "../types/book.ts";
import type { CSSProperties } from "react";

const mainStyle = {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem 3rem"
}
const titleStyle: CSSProperties = {
    fontSize: "2rem",
    color: "#2f3a2f",
    marginBottom: "2rem",
    textAlign: "center"
}
const searchMessageStyle: CSSProperties = {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "2rem"
}
const booksGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem"
}
const bookCardStyle: CSSProperties = {
    backgroundColor: "#f8f6f1",
    border: "1px solid #e4dfd4",
    borderRadius: "12px",
    padding: "1rem",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
}
const bookCardImageStyle: CSSProperties = {
    width: "100%",
    maxWidth: "140px",
    height: "210px",
    objectFit: "cover",
    margin: "0 auto 1rem",
    display: "block",
    borderRadius: "6px",
    backgroundColor: "#ddd"
}
const bookCardTitleStyle = {
    fontSize: "1.1rem",
    color: "#2f3a2f",
    marginBottom: "0.5rem",
    minHeight: "2.8rem"
}
const bookCardAuthorStyle = {
    fontSize: "0.95rem",
    color: "#666",
    marginBottom: "1rem",
    minHeight: "2.5rem"
}
const bookCardLinkStyle = {
    display: "inline-block",
    textDecoration: "none",
    backgroundColor: "#4f6f52",
    color: "white",
    padding: "0.65rem 1rem",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "background-color 0.2s ease"
}

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      if (!query) return;

      try {
        setLoading(true);
        setError("");

        const results = await searchBooks(query);
        setBooks(results);
      } catch (err) {
        setError("Något gick fel vid hämtning av böcker.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [query]);

  return (
    <main style={mainStyle} className="search-results-page">
      <h2 style={titleStyle} className="search-results-title">Sökresultat för: {query}</h2>

      {loading && <p style={searchMessageStyle}>Laddar böcker...</p>}
      {error && <p style={{... searchMessageStyle, color: "#a33333"}}>{error}</p>}

      {!loading && !error && books.length === 0 && (
        <p style={searchMessageStyle}>Inga böcker hittades.</p>
      )}

      <div style={booksGridStyle}>
        {books.map((book) => {
          const info = book.volumeInfo;

          return (
            <article key={book.id} style={bookCardStyle} className="book-card">
              <img
                style={bookCardImageStyle}
                src={info.imageLinks?.thumbnail || ""}
                alt={info.title || "Bokomslag"}
              />
              <h3 style={bookCardTitleStyle}>{info.title || "Ingen titel"}</h3>
              <p style={bookCardAuthorStyle}>{info.authors?.join(", ") || "Okänd författare"}</p>
              <Link style={bookCardLinkStyle} className="book-card-link" to={`/book/${book.id}`}>Läs mer</Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default SearchResultsPage;