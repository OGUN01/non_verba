import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ReviewData {
    topic: string;
    difficulty: string;
    questionIndex: number;
    rating: number | null;
    comment: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { topic, difficulty, questionIndex, rating, comment } = req.body as ReviewData;

        // Validate required fields
        if (!topic || !difficulty || questionIndex === undefined) {
            return res.status(400).json({ error: 'Missing required fields: topic, difficulty, questionIndex' });
        }

        // Create unique key for this review
        const key = `review:${topic}:${difficulty}:${questionIndex}`;

        // Store review data in Vercel KV
        await kv.set(key, {
            rating,
            comment,
            timestamp: new Date().toISOString()
        });

        return res.status(200).json({
            success: true,
            message: 'Review saved successfully',
            key
        });

    } catch (error) {
        console.error('Error saving review:', error);
        return res.status(500).json({
            error: 'Failed to save review',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
