
import { GoogleGenAI, Type, InlineDataPart } from "@google/genai";
import { Expense } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const processBill = async (imageFile: File, categories: string[]): Promise<Omit<Expense, 'id'>> => {
  const fileToGenerativePart = async (file: File): Promise<InlineDataPart> => {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to read file as data URL."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };
  
  const imagePart = await fileToGenerativePart(imageFile);

  const prompt = `Analyze the provided image of a receipt or bill. Extract the following information:
1. Vendor name
2. Total amount (as a number, without currency symbols)
3. Date of the transaction (in YYYY-MM-DD format)

After extracting the details, categorize the expense into one of the following user-defined categories: ${categories.join(', ')}.

The category should be the most logical fit based on the vendor and items (if visible).
Return the data in the specified JSON format.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vendor: {
              type: Type.STRING,
              description: 'The name of the store or vendor.',
            },
            amount: {
              type: Type.NUMBER,
              description: 'The total amount of the bill as a number.',
            },
            date: {
              type: Type.STRING,
              description: 'The date of the transaction in YYYY-MM-DD format.',
            },
            category: {
              type: Type.STRING,
              description: `The most appropriate category from the provided list: ${categories.join(', ')}`,
            },
          },
          required: ["vendor", "amount", "date", "category"],
        },
      },
    });

    const parsedJson = JSON.parse(response.text);

    return parsedJson as Omit<Expense, 'id'>;

  } catch (error) {
    console.error("Error processing bill with Gemini:", error);
    let errorMessage = "Failed to process bill. The AI model could not read the data.";
    if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};
