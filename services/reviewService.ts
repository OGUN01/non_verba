interface ReviewData {
    rating: number | null;
    comment: string;
    timestamp?: string;
}

interface SaveReviewResponse {
    success: boolean;
    message?: string;
    error?: string;
}

interface GetReviewsResponse {
    success: boolean;
    reviews: Record<number, ReviewData>;
    error?: string;
}

/**
 * Save a review to Vercel KV storage
 */
export const saveReview = async (
    topic: string,
    difficulty: string,
    questionIndex: number,
    rating: number | null,
    comment: string
): Promise<SaveReviewResponse> => {
    try {
        const response = await fetch('/api/reviews/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic,
                difficulty,
                questionIndex,
                rating,
                comment
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to save review');
        }

        return data;

    } catch (error) {
        console.error('Error saving review:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

/**
 * Get all reviews for a specific topic and difficulty
 */
export const getReviews = async (
    topic: string,
    difficulty: string
): Promise<GetReviewsResponse> => {
    try {
        const params = new URLSearchParams({
            topic,
            difficulty
        });

        const response = await fetch(`/api/reviews/get?${params.toString()}`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch reviews');
        }

        return data;

    } catch (error) {
        console.error('Error fetching reviews:', error);
        return {
            success: false,
            reviews: {},
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

/**
 * Get a single review for a specific question
 */
export const getReview = async (
    topic: string,
    difficulty: string,
    questionIndex: number
): Promise<ReviewData | null> => {
    try {
        const response = await getReviews(topic, difficulty);

        if (response.success && response.reviews[questionIndex]) {
            return response.reviews[questionIndex];
        }

        return null;

    } catch (error) {
        console.error('Error fetching review:', error);
        return null;
    }
};
