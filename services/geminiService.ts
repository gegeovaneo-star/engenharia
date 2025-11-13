import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from '../utils/fileUtils';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

interface SuggestionParams {
  tipoEquipamento: string;
  marcaEquipamento: string;
  tipoComando: string;
  descricaoProblema: string;
  imagensProblema: File[];
}

export const getAiSuggestion = async ({
  tipoEquipamento,
  marcaEquipamento,
  tipoComando,
  descricaoProblema,
  imagensProblema
}: SuggestionParams): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';

    const textPart = {
      text: `Você é um engenheiro de suporte técnico sênior da Verticalparts, especializado em ${tipoEquipamento} da marca ${marcaEquipamento} com sistema de comando ${tipoComando}. Com base na descrição do problema e nas imagens fornecidas, sugira uma solução técnica detalhada, clara e prática. Se a solução não for clara, indique os próximos passos para diagnóstico.

Descrição do Problema: ${descricaoProblema}`
    };

    const imageParts = await Promise.all(
        imagensProblema.map(async (file) => {
            const base64Data = await fileToBase64(file);
            return {
                inlineData: {
                    mimeType: file.type,
                    data: base64Data,
                },
            };
        })
    );

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart, ...imageParts] },
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching AI suggestion:", error);
    if (error instanceof Error) {
        return `Erro ao obter sugestão da IA: ${error.message}`;
    }
    return "Erro desconhecido ao obter sugestão da IA.";
  }
};
