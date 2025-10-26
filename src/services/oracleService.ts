
import { oracleGimmicks, fallbackResponses, blockedKeywords } from '../constants';
import type { OracleResponse, OracleGimmick } from '../types';

// Simple language detection
const isIndonesian = (query: string): boolean => {
    // Check for common Indonesian interrogative words or context
    const indonesianRegex = /\b(apa|siapa|di mana|mengapa|bagaimana|jelaskan|tentang|pengalaman|proyek|anda|kamu)\b/i;
    return indonesianRegex.test(query);
};

// Function to get a random item from an array
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const askOracle = (query: string, discussedTopics: Set<string>): OracleResponse => {
    const lowerCaseQuery = query.toLowerCase();
    
    // 1. Content Moderation
    const hasBlockedKeyword = blockedKeywords.some(keyword => lowerCaseQuery.includes(keyword));
    if (hasBlockedKeyword) {
        const lang = isIndonesian(lowerCaseQuery) ? 'id' : 'en';
        return {
            text: getRandom(fallbackResponses.moderation[lang]),
            gimmickId: null,
        };
    }

    // 2. Language Detection
    const lang: 'id' | 'en' = isIndonesian(lowerCaseQuery) ? 'id' : 'en';

    // 3. Gimmick Matching
    let matchedGimmick: OracleGimmick | null = null;
    for (const gimmick of oracleGimmicks) {
        const keywords = gimmick[lang].keywords;
        if (keywords.some(keyword => lowerCaseQuery.includes(keyword))) {
            matchedGimmick = gimmick;
            break;
        }
    }

    // 4. Response Generation
    if (matchedGimmick) {
        const hasBeenDiscussed = discussedTopics.has(matchedGimmick.gimmickId);
        const content = matchedGimmick[lang];

        const answerArray = hasBeenDiscussed ? content.contextualAnswer : content.fullAnswer;
        const text = getRandom(answerArray);

        return {
            text,
            gimmickId: matchedGimmick.gimmickId,
            followUpQuestions: content.followUpQuestions,
            actionLink: content.actionLink,
        };
    }

    // 5. Fallback Response
    return {
        text: getRandom(fallbackResponses[lang]),
        gimmickId: null,
    };
};
