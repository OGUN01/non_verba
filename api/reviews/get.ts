import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { topic, difficulty } = req.query;

        // Validate required fields
        if (!topic || !difficulty) {
            return res.status(400).json({ error: 'Missing required query params: topic, difficulty' });
        }

        // Get all keys matching the pattern
        const pattern = `review:${topic}:${difficulty}:*`;
        const keys = await kv.keys(pattern);

        // Fetch all reviews for these keys
        const reviews: Record<number, { rating: number | null; comment: string; timestamp: string }> = {};

        for (const key of keys) {
            // Extract question index from key
            const parts = key.split(':');
            const questionIndex = parseInt(parts[3], 10);

            // Get review data
            const reviewData = await kv.get(key);

            if (reviewData) {
                reviews[questionIndex] = reviewData as { rating: number | null; comment: string; timestamp: string };
            }
        }

        return res.status(200).json({
            success: true,
            reviews
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({
            error: 'Failed to fetch reviews',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
