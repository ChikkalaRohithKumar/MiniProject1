import { GoogleGenAI, Type } from "@google/genai";
import type { DiagnosisResponse } from '../types';

const KVASIR_CLASSES = [
    "dyed-lifted-polyps",
    "dyed-resection-margins",
    "esophagitis",
    "normal-cecum",
    "normal-pylorus",
    "normal-z-line",
    "polyps",
    "ulcerative-colitis",
    "other-normal/diagnostic-categories"
];

export const analyzeImageWithGemini = async (
  imageDataBase64: string,
  mimeType: string
): Promise<DiagnosisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const textPrompt = `
    You are an expert Gastrointestinal AI Diagnostic System, simulating an advanced model that combines a Convolutional Neural Network (CNN) with an Adaptive Fuzzy Inference System (AFIS). Your task is to analyze the provided endoscopic image and generate a detailed, explainable diagnostic report.

    Follow these steps precisely:
    1.  **Image Analysis (CNN Simulation):** Analyze the visual features of the image, such as texture, color, shape, presence of inflammation, lesions, or other abnormalities.
    2.  **Classification:** Classify the image into one of the following categories from the Kvasir dataset: ${KVASIR_CLASSES.join(", ")}. Select the most likely category.
    3.  **Fuzzy Inference (AFIS Simulation):** Based on the extracted visual features, generate an explainable diagnosis. This involves creating:
        a.  A "fuzzy risk score" from 0 to 100, where 0 is no risk and 100 is critical risk.
        b.  A corresponding risk level ('Low', 'Moderate', 'High', 'Critical').
        c.  A set of 2-3 interpretable fuzzy rules in "IF... THEN..." format that logically justify your diagnosis. The 'IF' part should describe visual characteristics (e.g., 'texture is irregular', 'color is deep red'), and the 'THEN' part should be a conclusion (e.g., 'risk is high', 'polyps are likely'). Provide a brief rationale for each rule.
    4.  **Recommendations:** Provide a list of 2-3 concise, actionable clinical recommendations for a gastroenterologist based on your findings.
    5.  **Summary:** Provide a brief, one-sentence summary of the risk assessment.

    The final output MUST be a JSON object that strictly adheres to the provided schema.
  `;
  
  const imagePart = {
    inlineData: {
      data: imageDataBase64,
      mimeType: mimeType,
    },
  };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, {text: textPrompt}]},
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING, description: `One of: ${KVASIR_CLASSES.join(", ")}` },
            confidence: { type: Type.NUMBER, description: "Confidence score for the diagnosis (0-100)." },
            riskScore: { type: Type.NUMBER, description: "Fuzzy risk score (0-100)." },
            riskLevel: { type: Type.STRING, description: "One of: Low, Moderate, High, Critical." },
            summary: { type: Type.STRING, description: "A brief, one-sentence summary of the risk." },
            fuzzyRules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  if: { type: Type.ARRAY, items: { type: Type.STRING } },
                  then: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "if", "then", "explanation"]
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["disease", "confidence", "riskScore", "riskLevel", "summary", "fuzzyRules", "recommendations"]
        }
      }
    });

    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);

    // Basic validation
    if (!parsedJson.disease || !KVASIR_CLASSES.includes(parsedJson.disease)) {
        throw new Error("Invalid 'disease' field in response.");
    }

    return parsedJson as DiagnosisResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI model.");
  }
};
