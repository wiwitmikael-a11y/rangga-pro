import { oracleGimmicks } from '../constants';
import type { OracleResponse } from '../types';

/**
 * Checks for a pre-defined answer based on keywords. This is a self-contained
 * gimmick engine with no external API calls.
 * @param {string} query The user's question.
 * @returns {Promise<OracleResponse>} An object containing the AI's response and suggested follow-up questions.
 */
export const askOracle = async (query: string): Promise<OracleResponse> => {
    const lowerCaseQuery = query.toLowerCase().trim();

    // 1. Gimmick Engine: Check for keyword matches.
    for (const gimmick of oracleGimmicks) {
        for (const keyword of gimmick.keywords) {
            if (lowerCaseQuery.includes(keyword)) {
                // Return a slight delay to simulate processing
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve({
                            answer: gimmick.answer,
                            followUpQuestions: gimmick.followUpQuestions || []
                        });
                    }, 300 + Math.random() * 400);
                });
            }
        }
    }

    // 2. Fallback: If no gimmick matched, return a polite, predefined response.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                answer: "That query is beyond my current operational parameters. My function is to provide analysis on Rangga Prayoga Hermawan's professional capabilities.",
                followUpQuestions: [
                    "What is your core philosophy?",
                    "Tell me about your background.",
                    "Show me your AI projects.",
                ]
            });
        }, 300 + Math.random() * 400);
    });
};