// Mock AI Client since we may not have an API key right now.
// In a real scenario, this would use @google/genai or anthropic sdk.

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const analyzeSyllabus = async (text) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing. Please check your .env file.");
  }

  // Truncate the text to ~40,000 characters to prevent API timeouts or 503s on massive PDFs
  const truncatedText = text.substring(0, 40000);

  const prompt = `You are an expert career consultant and industrial market analyst. I am providing you with the extracted text from an academic syllabus. 
  
Your task is to analyze this syllabus and map it directly to industry roles, discover skill gaps, and generate a customized learning roadmap.
  
Analyze the following syllabus text:
"""
${truncatedText}
"""

You MUST respond strictly with a valid JSON object, and absolutely nothing else. Do not include markdown formatting like \`\`\`json. The JSON must exactly match this structure:
{
  "roles": [
    {
      "role": "Job Title 1",
      "fitScore": 85, // Number between 0 and 100
      "matchedSkills": ["Skill 1", "Skill 2"], // Skills present in the syllabus
      "missingSkills": ["Skill 3", "Skill 4"]  // Skills industry demands for this role but are missing
    },
    // Add 2 more roles
  ],
  "demandScore": 92, // Number between 0 and 100, representing how hot these topics are in the current job market
  "roadmap": [
    {
      "skill": "Skill to learn",
      "resources": ["Specific Course Name 1", "Specific Book or Tutorial 2"]
    },
    // Add 2 more roadmap items corresponding to missing skills
  ],
  "topCompanies": ["Company 1", "Company 2", "Company 3", "Company 4"] // Top companies hiring for these roles
}`;

  try {
    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        break; // Success, break out of retry loop
      } catch (err) {
        if (err.status === 503 && retries > 1) {
          console.log('Gemini API 503 Error, retrying...');
          retries--;
          await new Promise(r => setTimeout(r, 2000)); // Wait 2s before retry
        } else {
          throw err;
        }
      }
    }

    const outputText = response.text;
    
    // Attempt to parse the response. Sometimes LLMs still wrap in markdown despite instructions.
    let jsonString = outputText;
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to analyze syllabus with AI.");
  }
};

module.exports = { analyzeSyllabus };
