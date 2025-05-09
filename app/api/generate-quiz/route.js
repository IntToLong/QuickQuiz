import { GoogleGenAI } from '@google/genai';
import { prompt } from './prompt';
import { safeParseJSON, getRandomTemperature } from '@/util/validation';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req) {
	let { topic, complexity, quantity } = await req.json();
	console.log(typeof quantity);

	if (quantity > 20) {
		quantity = 20;
	}

	try {
		const response = await ai.models.generateContent({
			model: 'gemini-2.0-flash-lite',
			temperature: getRandomTemperature(),
			topP: 0.95,
			topK: 64,
			maxOutputTokens: 4096,
			responseMimeType: 'text/plain',
			contents: `Generate quiz - exactly ${
				quantity ?? 5
			} questions for the topic ${topic}, with a complexity level of ${
				complexity ?? 'novice'
			}. ${prompt} `,
		});

		const raw = response.text;
		console.log(raw);

		const result = safeParseJSON(raw, +quantity ?? 5);

		if (!result.valid) {
			return Response.json(
				{ error: 'Invalid format from AI: ' + result.error },
				{ status: 500 }
			);
		}

		return Response.json({ result: result.data }, { status: 200 });
	} catch (error) {
		console.error('Error generating quiz:', error);
		return Response.json({ error: 'Failed to generate quiz' }, { status: 500 });
	}
}
