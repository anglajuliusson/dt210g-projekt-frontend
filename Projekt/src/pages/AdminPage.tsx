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
  const token = localStorage.getItem("token");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState("");
  const [editText, setEditText] = useState("");

  useEffect(() => {
    async function fetchMyReviews() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:3000/reviews/my-reviews", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Kunde inte hämta recensioner.");
        }

        setReviews(data);
      } catch (err: any) {
        setError(err.message || "Något gick fel.");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchMyReviews();
    }
  }, [token]);

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditRating(String(review.rating));
    setEditText(review.review_text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRating("");
    setEditText("");
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/my-reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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

      setReviews((prev) =>
        prev.map((review) =>
          review.id === id
            ? { ...review, rating: Number(editRating), review_text: editText }
            : review
        )
      );

      cancelEdit();
    } catch (err: any) {
      setError(err.message || "Något gick fel.");
    }
  };

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

      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (err: any) {
      setError(err.message || "Något gick fel.");
    }
  };

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