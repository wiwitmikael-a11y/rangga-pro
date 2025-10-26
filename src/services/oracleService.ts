import { oracleGimmicks, fallbackResponses, blockedKeywords, moderationResponses } from '../constants';
import type { OracleResponse } from '../types';

/**
 * A stateful, bilingual, gimmick-based oracle that provides pre-defined answers.
 * It simulates an intelligent conversation by tracking discussed topics, detecting language,
 * providing varied, contextual responses, and filtering content without any external API calls.
 * @param {string} query The user's question.
 * @param {Set<string>} discussedTopics A set of gimmick IDs that have already been discussed.
 * @returns {Promise<OracleResponse>} An object containing the response and metadata.
 */
export const askOracle = async (query: string, discussedTopics: Set<string>): Promise<OracleResponse> => {
    const lowerCaseQuery = query.toLowerCase().trim();

    // --- Language Detection ---
    // More robust detection to differentiate between EN and ID, defaulting to EN.
    const isIndonesian = /\b(apa|siapa|bagaimana|jelaskan|di mana|tentang|pengalaman|anda|kamu|kenapa)\b/.test(lowerCaseQuery);
    const isEnglish = /\b(what|who|how|explain|where|about|experience|you|why)\b/.test(lowerCaseQuery);
    
    let lang: 'id' | 'en' = 'en'; // Default to English
    if (isIndonesian && !isEnglish) {
        lang = 'id';
    } else if (isEnglish && !isIndonesian) {
        lang = 'en';
    } else {
        // If both or neither, check for more Indonesian-specific words or stick to default
        if (isIndonesian) lang = 'id';
    }

    // --- Content Moderation ---
    for (const keyword of blockedKeywords) {
        if (lowerCaseQuery.includes(keyword)) {
            const moderationResponse = moderationResponses[lang];
            return {
                answer: moderationResponse.answer,
                followUpQuestions: moderationResponse.followUpQuestions,
                gimmickId: null,
                actionLink: undefined
            };
        }
    }

    // --- Gimmick Matching ---
    for (const gimmick of oracleGimmicks) {
        const content = gimmick[lang];
        for (const keyword of content.keywords) {
            if (lowerCaseQuery.includes(keyword)) {
                const isTopicDiscussed = discussedTopics.has(gimmick.gimmickId);
                const answerArray = isTopicDiscussed ? content.contextualAnswer : content.fullAnswer;
                
                const randomAnswer = answerArray[Math.floor(Math.random() * answerArray.length)];

                return {
                    answer: randomAnswer,
                    followUpQuestions: content.followUpQuestions || [],
                    gimmickId: gimmick.gimmickId,
                    actionLink: content.actionLink
                };
            }
        }
    }

    // --- Fallback Response ---
    const fallbackContent = fallbackResponses[lang];
    return {
        answer: fallbackContent.answer,
        followUpQuestions: fallbackContent.followUpQuestions,
        gimmickId: null,
        actionLink: undefined
    };
};