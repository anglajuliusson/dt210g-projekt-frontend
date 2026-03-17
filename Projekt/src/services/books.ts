import type { Book } from "../types/book.ts";

export async function searchBooks(query: string): Promise<Book[]> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Kunde inte hämta böcker.");
  }

  const data = await response.json();
  return data.items || [];
}