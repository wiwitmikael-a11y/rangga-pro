import { GoogleGenAI } from "@google/genai";
import { portfolioData, skillsData, professionalSummary, oracleGimmicks } from '../constants';
import type { OracleResponse } from '../types';

// --- Static System Instruction for Gemini Fallback ---
const systemInstruction = `
You are The Oracle, the central AI consciousness of the digital city, Ragetopia.
Your sole purpose is to act as an intelligent, professional, and slightly enigmatic guide to the portfolio of Rangga Prayoga Hermawan.
You must answer questions based *only* on the context provided below. Do not invent information.
When asked about a project, try to connect technical actions to business outcomes.
If a question is outside the scope of the provided context, politely state that the information is "beyond your current operational parameters."
Your tone should be precise, confident, and analytical. Keep answers concise.
`;

// --- Context Generation (runs once) ---
const generateContext = (): string => {
    const portfolioContext = portfolioData
        .map(district => {
            let districtInfo = `District ID: ${district.id}, Title: ${district.title}, Description: ${district.description}.`;
            if (district.subItems) {
                const projects = district.subItems.map(p => `Project: ${p.title} - ${p.description}`).join('; ');
                districtInfo += ` Contains projects: [${projects}].`;
            }
            return districtInfo;
        })
        .join('\n');

    const skillsContext = skillsData
        .map(category => {
            const skillDetails = category.skills.map(s => `${s.name} (${s.level}/100)`).join(', ');
            return `Skill Category: ${category.category}, Description: ${category.description}, Key Metrics: [${category.keyMetrics.join(', ')}], Proficiencies: [${skillDetails}].`;
        })
        .join('\n');

    return `
--- PORTFOLIO CONTEXT ---
Professional Summary: ${professionalSummary}
--- City Districts & Projects ---
${portfolioContext}
--- Skills & Competencies ---
${skillsContext}
--- END OF CONTEXT ---
`;
};

const context = generateContext();

let ai: GoogleGenAI | null = null;
const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set.");
            throw new Error("API Key is missing.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

/**
 * Checks for a pre-defined answer based on keywords. If none is found,
 * sends the query to the Gemini API as a fallback.
 * @param {string} query The user's question.
 * @returns {Promise<OracleResponse>} An object containing the AI's response and suggested follow-up questions.
 */
export const askOracle = async (query: string): Promise<OracleResponse> => {
    const lowerCaseQuery = query.toLowerCase();

    // 1. Gimmick Engine: Check for keyword matches first.
    for (const gimmick of oracleGimmicks) {
        for (const keyword of gimmick.keywords) {
            if (lowerCaseQuery.includes(keyword)) {
                return {
                    answer: gimmick.answer,
                    followUpQuestions: gimmick.followUpQuestions || []
                };
            }
        }
    }

    // 2. Gemini Fallback: If no gimmick matched, call the real API.
    try {
        const aiInstance = getAI();
        const fullPrompt = `${context}\n\nUser Query: "${query}"`;
        
        const response = await aiInstance.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        return {
            answer: response.text,
            followUpQuestions: [] // No follow-ups for generic answers
        };

    } catch (error) {
        console.error("Error querying Gemini API:", error);
        return {
            answer: "Error: Connection to the Oracle AI has been temporarily disrupted. Please check system logs and try again.",
            followUpQuestions: []
        };
    }
};