import { useEffect, useState, type CSSProperties } from "react";
import { Navigate } from "react-router-dom";
import type { Review } from "../interfaces/review";

const mainStyle: CSSProperties = {
  width: "100%",
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "2rem 1rem 3rem"
};

const titleStyle: CSSProperties = {
  fontSize: "2rem",
  color: "#2f3a2f",
  marginBottom: "2rem",
  textAlign: "center"
};

const sectionStyle: CSSProperties = {
  backgroundColor: "#f8f6f1",
  border: "1px solid #e4dfd4",
  borderRadius: "12px",
  padding: "1.5rem",
  marginBottom: "1.5rem"
};

const reviewCardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1rem",
  backgroundColor: "white"
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  marginTop: "0.35rem",
  marginBottom: "1rem",
  borderRadius: "5px",
  border: "1px solid #ccc",
  backgroundColor: "white",
  color: "#333"
};

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
};

const buttonStyle: CSSProperties = {
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "0.7em 1.5em",
  cursor: "pointer",
  marginRight: "0.75rem"
};

function AdminPage() {
  const token = localStorage.getItem("token"); // Hämtar JWT-token från localStorage

  const [reviews, setReviews] = useState<Review[]>([]); // State för att lagra användarens recensioner
  const [loading, setLoading] = useState(true); // State för laddningsstatus
  const [error, setError] = useState(""); // State för felmeddelande
  const [editingId, setEditingId] = useState<number | null>(null); // State för att hålla koll på vilken recension som redigeras
  
  // State för redigeringsformuläret
  const [editRating, setEditRating] = useState("");
  const [editText, setEditText] = useState("");

  // Körs när komponenten laddas, hämtar inloggade användarens recensioner
  useEffect(() => {
    async function fetchMyReviews() {
      try {
        setLoading(true);
        setError("");

        // GET-request till skyddad endpoint
        const response = await fetch("http://localhost:3000/reviews/my-reviews", {
          headers: {
            Authorization: `Bearer ${token}` // skickar med token för autentisering
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Kunde inte hämta recensioner.");
        }

        // Sparar recensionerna i state
        setReviews(data);
      } catch (err: any) {
        setError(err.message || "Något gick fel.");
      } finally {
        setLoading(false);
      }
    }

    // Kör endast om token finns (användare inloggad)
    if (token) {
      fetchMyReviews();
    }
  }, [token]);

  // Startar redigeringsläge för specifik recension
  const startEdit = (review: Review) => {
    setEditingId(review.id); // Sparar vilken recension som redigeras
    setEditRating(String(review.rating)); // Förifyller betyg
    setEditText(review.review_text); // Förifyller text
  };

  // Avbryter redigering och återställer state
  const cancelEdit = () => {
    setEditingId(null);
    setEditRating("");
    setEditText("");
  };

  // PUT-request
  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/my-reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // Kräver autentisering
        },
        body: JSON.stringify({
          rating: Number(editRating),
          review_text: editText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kunde inte uppdatera recensionen.");
      }

      // Uppdatera state lokalt utan att behöva ladda om sidan
      setReviews((prev) =>
        prev.map((review) =>
          review.id === id
            ? { ...review, rating: Number(editRating), review_text: editText }
            : review
        )
      );

      // Avslua redigeringsläge
      cancelEdit();
    } catch (err: any) {
      setError(err.message || "Något gick fel.");
    }
  };

  // DELETE-request
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/my-reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kunde inte radera recensionen.");
      }

      // Tar bort recensionen från state direkt
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (err: any) {
      setError(err.message || "Något gick fel.");
    }
  };

  // Om ingen token finns omredigeras användaren till login-sidan
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main style={mainStyle}>
      <h1 style={titleStyle}>Mina recensioner</h1>

      <div style={sectionStyle}>
        {loading && <p>Laddar recensioner...</p>}
        {error && <p style={{ color: "#a33333" }}>{error}</p>}
        {!loading && reviews.length === 0 && (
          <p>Du har ännu inte skrivit några recensioner.</p>
        )}

        {reviews.map((review) => (
          <article key={review.id} style={reviewCardStyle}>
            <h3>{review.book_title}</h3>

            {editingId === review.id ? (
              <>
                <label>Betyg (1–5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value)}
                  style={inputStyle}
                />

                <label>Recension</label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={textareaStyle}
                />

                <button
                  onClick={() => handleUpdate(review.id)}
                  style={{ ...buttonStyle, backgroundColor: "#4f6f52" }}
                >
                  Spara
                </button>

                <button
                  onClick={cancelEdit}
                  style={{ ...buttonStyle, backgroundColor: "crimson" }}
                >
                  Avbryt
                </button>
              </>
            ) : (
              <>
                <p style={{ margin: "0.75rem 0" }}><strong>Betyg:</strong> {review.rating}/5</p>
                <p style={{ margin: "0.75rem 0" }}>{review.review_text}</p>
                <p style={{ color: "#666", fontSize: "0.9rem", margin: "0.75rem 0" }}>
                  {new Date(review.created_at).toLocaleString("sv-SE")}
                </p>

                <button
                  onClick={() => startEdit(review)}
                  style={{ ...buttonStyle, backgroundColor: "#4f6f52" }}
                >
                  Redigera
                </button>

                <button
                  onClick={() => handleDelete(review.id)}
                  style={{ ...buttonStyle, backgroundColor: "crimson" }}
                >
                  Ta bort
                </button>
              </>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}

export default AdminPage;