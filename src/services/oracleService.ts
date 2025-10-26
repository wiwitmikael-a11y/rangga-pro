import { oracleGimmicks, curatedOracleQuestions, fallbackResponses } from '../constants';
import type { OracleResponse } from '../types';

/**
 * A stateful, bilingual, gimmick-based oracle that provides pre-defined answers.
 * It simulates an intelligent conversation by tracking discussed topics, detecting language,
 * and providing varied, contextual responses without any external API calls.
 * @param {string} query The user's question.
 * @param {Set<string>} discussedTopics A set of gimmick IDs that have already been discussed.
 * @returns {Promise<OracleResponse>} An object containing the response and metadata.
 */
export const askOracle = async (query: string, discussedTopics: Set<string>): Promise<OracleResponse> => {
    const lowerCaseQuery = query.toLowerCase().trim();

    // Simple language detection heuristic by checking for common Indonesian question words.
    const isIndonesianQuery = /\b(apa|siapa|bagaimana|jelaskan|di mana|tentang|pengalaman|anda)\b/.test(lowerCaseQuery);
    const lang: ('id' | 'en') = isIndonesianQuery ? 'id' : 'en';

    // Search through gimmicks based on detected language.
    for (const gimmick of oracleGimmicks) {
        const content = gimmick[lang];
        for (const keyword of content.keywords) {
            if (lowerCaseQuery.includes(keyword)) {
                // FIX: Use 'gimmickId' to access the unique identifier, as 'id' was renamed to resolve type conflicts.
                const isTopicDiscussed = discussedTopics.has(gimmick.gimmickId);
                const answerArray = isTopicDiscussed ? content.contextualAnswer : content.fullAnswer;
                
                // Pick a random answer variation to make the AI feel more dynamic.
                const randomAnswer = answerArray[Math.floor(Math.random() * answerArray.length)];

                return {
                    answer: randomAnswer,
                    followUpQuestions: content.followUpQuestions || [],
                    // FIX: Return 'gimmickId' as the identifier.
                    gimmickId: gimmick.gimmickId
                };
            }
        }
    }

    // If no keyword match is found, return a polite fallback message with curated questions
    // in the detected language to guide the user back to relevant topics.
    const fallbackContent = fallbackResponses[lang];
    return {
        answer: fallbackContent.answer,
        followUpQuestions: fallbackContent.followUpQuestions,
        gimmickId: null
    };
};