export interface Review {
    id: number;
    user_id: number;
    book_id: string;
    book_title: string;
    rating: number;
    review_text: string;
    created_at: string;
};