import { useEffect, useState, type CSSProperties } from "react";
import { useParams } from "react-router-dom";
import type { Book } from "../interfaces/book.ts";

const mainStyle = {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem 3rem"
}
const bookInfoStyle: CSSProperties = {
    backgroundColor: "#f8f6f1",
    border: "1px solid #e4dfd4",
    borderRadius: "12px",
    padding: "1rem",
    textAlign: "center",
}
const searchMessageStyle: CSSProperties = {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "2rem",
    marginTop: "2rem"
}
const titleStyle: CSSProperties = {
    fontSize: "2rem",
    color: "#2f3a2f",
    marginBottom: "2rem",
    marginTop: "2rem",
    textAlign: "center"
}
const authorStyle = {
    fontSize: "0.95rem",
    color: "#666",
    marginBottom: "1rem",
    minHeight: "2.5rem"
}
const imageStyle: CSSProperties = {
    width: "100%",
    maxWidth: "140px",
    height: "210px",
    objectFit: "cover",
    margin: "0 auto 1rem",
    display: "block",
    borderRadius: "6px",
    backgroundColor: "#ddd"
}
const descriptionStyle: CSSProperties = {
    maxWidth: "500px",
    width: "100%",
    textAlign: "left",
    margin: "2rem auto 2rem auto"
}

function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );

        if (!response.ok) {
          throw new Error("Kunde inte hämta boken.");
        }

        const data: Book = await response.json();
        setBook(data);
      } catch (err) {
        setError("Något gick fel vid hämtning av boken.");
      }
    }

    fetchBook();
  }, [id]);

  if (error) return <p style={{... searchMessageStyle, color: "#a33333"}}>{error}</p>;
  if (!book) return <p style={searchMessageStyle}>Laddar bok...</p>;

  const info = book.volumeInfo;

  return (
    <main style={mainStyle}>
        <div style={bookInfoStyle}>
            <h1 style={titleStyle}>{info.title || "Ingen titel"}</h1>
            <p style={authorStyle}>Författare: {info.authors?.join(", ") || "Okänd författare"}</p>
                <img
                    style={imageStyle}
                    src={info.imageLinks?.thumbnail || ""}
                    alt={info.title || "Bokomslag"}
                />
                <p style={descriptionStyle}>{info.description || "Ingen beskrivning tillgänglig."}</p>
      </div>
    </main>
  );
}

export default BookPage;