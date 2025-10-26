import { oracleGimmicks, curatedOracleQuestions } from '../constants';
import type { OracleResponse } from '../types';

/**
 * A gimmick-based oracle that provides pre-defined answers to questions about the portfolio.
 * It simulates an AI conversation without making any external API calls, ensuring reliability and speed.
 * @param {string} query The user's question.
 * @returns {Promise<OracleResponse>} An object containing the pre-defined response and suggested follow-up questions.
 */
export const askOracle = async (query: string): Promise<OracleResponse> => {
    const lowerCaseQuery = query.toLowerCase().trim();

    // 1. Check for a direct keyword match in the gimmicks database.
    for (const gimmick of oracleGimmicks) {
        for (const keyword of gimmick.keywords) {
            if (lowerCaseQuery.includes(keyword)) {
                // Return a promise to maintain the async signature, ensuring UI compatibility.
                return Promise.resolve({
                    answer: gimmick.answer,
                    followUpQuestions: gimmick.followUpQuestions || []
                });
            }
        }
    }

    // 2. If no keyword match is found, return a polite fallback message with curated questions
    //    to guide the user back to relevant topics.
    const fallbackResponse: OracleResponse = {
        answer: "That is an interesting query, but it falls beyond my current operational parameters. My core function is to provide insights into Rangga's professional capabilities and portfolio. Perhaps you would be interested in one of the following topics?",
        followUpQuestions: curatedOracleQuestions
    };

    return Promise.resolve(fallbackResponse);
};
