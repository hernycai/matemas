import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'api_key' ? process.env.GOOGLE_API_KEY : null;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generarFeedbackPedagogico = async (pregunta, explicacionBase, opcionElegida) => {
    if (!genAI) {
        return explicacionBase;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            Sos un tutor de matemáticas para adultos.
            Un estudiante está resolviendo el siguiente problema: "${pregunta}"
            La explicación correcta es: "${explicacionBase}"
            El estudiante eligió esta opción incorrecta: "${opcionElegida}"

            Tu tarea es:
            1. No dar la respuesta correcta directamente de entrada.
            2. Analizar por qué esa opción es incorrecta basándote en la lógica matemática.
            3. Dar una pista o explicación breve (máximo 3 oraciones) con un tono alentador y profesional para adultos.
            4. Usar un lenguaje sencillo y cercano (español de Argentina).

            Respondé solo con el feedback pedagógico.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error al conectar con Gemini:', error);
        return explicacionBase;
    }
};
