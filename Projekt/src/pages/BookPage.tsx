import { useEffect, useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import type { Book } from "../interfaces/book.ts";
import type { Review } from "../interfaces/review.ts";

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
    marginBottom: "2rem"
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
const sectionStyle: CSSProperties = {
  backgroundColor: "#f8f6f1",
  border: "1px solid #e4dfd4",
  borderRadius: "12px",
  padding: "1.5rem",
  marginBottom: "2rem"
}
const reviewCardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1rem",
  backgroundColor: "white"
}
const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  marginTop: "0.35rem",
  marginBottom: "1rem",
  borderRadius: "5px",
  border: "1px solid #ccc",
  backgroundColor: "white",
  color: "#333"
}
const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: "120px",
  padding: "0.6rem",
  marginTop: "0.35rem",
  marginBottom: "1rem",
  borderRadius: "5px",
  border: "1px solid #ccc",
  backgroundColor: "white",
  color: "#333",
  resize: "vertical"
}
const buttonStyle: CSSProperties = {
  color: "white",
  backgroundColor: "#4f6f52",
  border: "none",
  borderRadius: "5px",
  padding: "0.7em 1.5em",
  cursor: "pointer"
}

function BookPage() {
  // Hämtar bok-id från URL:en
  const { id } = useParams();

  // State frö bokdata, recensioner, laddning, fel och formlärfält
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");

  // Hämtar sparad JWT-token från localstorage
  const token = localStorage.getItem("token");

  // Hämtar vald bok från Google Books API
  useEffect(() => {
    async function fetchBook() {
      try {
        setLoadingBook(true);
        setError("");

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
      } finally {
        setLoadingBook(false);
      }
    }

    if (id) {
      fetchBook();
    }
  }, [id]);

  // Hämtar recensionerna för vald bok från backend
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoadingReviews(true);
        setReviewError("");

        const response = await fetch(`http://localhost:3000/reviews/book/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Kunde inte hämta recensioner.");
        }

        setReviews(data);
      } catch (err) {
        setReviewError("Något gick fel vid hämtning av recensioner.");
      } finally {
        setLoadingReviews(false);
      }
    }

    if (id) {
      fetchReviews();
    }
  }, [id]);

  // Hanterar formulärskickning för att skapa en ny recension
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kontrollerar att användaren är inloggad
    if (!token) {
      setReviewError("Du måste vara inloggad för att skriva en recension.");
      return;
    }

    if (!book) return;

    try {
      setReviewError("");

      const response = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          book_id: book.id,
          book_title: book.volumeInfo.title || "Ingen titel",
          rating: Number(rating),
          review_text: reviewText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kunde inte skapa recension.");
      }

      // Tömmer formuläret efter lyckad publicering
      setRating("");
      setReviewText("");

      // Hämtar recensionerna på nytt för att visa den nya direkt
      const reviewsResponse = await fetch(`http://localhost:3000/reviews/book/${id}`);
      const updatedReviews = await reviewsResponse.json();
      setReviews(updatedReviews);
    } catch (err: any) {
      setReviewError(err.message || "Något gick fel.");
    }
  };

  // Visa laddningsmeddelande medan bokdata hämtas
  if (loadingBook) {
    return <p style={searchMessageStyle}>Laddar bok...</p>;
  }

  // Visar felmeddelande om bokdata inte kunde hämtas
  if (error) {
    return <p style={{ ...searchMessageStyle, color: "#a33333" }}>{error}</p>;
  }

  // Visas om ingen bok hittas
  if (!book) {
    return <p style={searchMessageStyle}>Boken kunde inte hittas.</p>;
  }

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
                <p
                    style={descriptionStyle}
                    dangerouslySetInnerHTML={{
                        __html: info.description || "Ingen beskrivning tillgänglig."
                    }}
                ></p>
        </div>

        {/* Bokens recensioner */}
        <div style={sectionStyle}>
            <h3 style={{ marginBottom: "1rem" }}>Recensioner</h3>

            {loadingReviews && <p>Laddar recensioner...</p>}
            {reviewError && !reviews.length && (
            <p style={{ color: "#a33333" }}>{reviewError}</p>
            )}
            {!loadingReviews && reviews.length === 0 && (
            <p>Det finns ännu inga recensioner för denna bok.</p>
            )}

            {reviews.map((review) => (
            <article key={review.id} style={reviewCardStyle}>
                <p><strong>Betyg:</strong> {review.rating}/5</p>
                <p style={{ margin: "0.75rem 0" }}>{review.review_text}</p>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>{review.username}</p>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>{new Date(review.created_at).toLocaleString("sv-SE")}</p>
            </article>
            ))}
        </div>

        {/* Lägg till en ny recension */}
        <div style={sectionStyle}>
            <h3 style={{ marginBottom: "1rem" }}>Skriv en recension</h3>

            {!token ? (
            <p>
                Du måste vara <Link to="/login">inloggad</Link> för att skriva en recension.
            </p>
            ) : (
            <form onSubmit={handleSubmitReview}>
                <label>Betyg (1–5)</label>
                <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
                style={inputStyle}
                />

                <label>Recension</label>
                <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                style={textareaStyle}
                />

                {reviewError && (
                <p style={{ color: "#a33333", marginBottom: "1rem" }}>{reviewError}</p>
                )}

                <button type="submit" style={buttonStyle}>
                Publicera recension
                </button>
            </form>
            )}
        </div>
    </main>
  );
}

export default BookPage;