import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { mockCars, mockDealers } from './src/mockData';

// Initialize the Express router
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini API Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI search suggestions will fall back to mock analysis.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoints
app.get('/api/cars', (req, res) => {
  res.json({ cars: mockCars, dealers: mockDealers });
});

// AI Search Suggestion Endpoint with JSON Schema
app.post('/api/search-ai', async (req, res) => {
  const { query } = req.body;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required and must be a string' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant offline fallback for development when API key is not supplied
    console.log("Gemini API Client offline. Emulating AI smart search matching logic.");
    const lowerQuery = query.toLowerCase();
    const recommendations = mockCars.map(car => {
      let score = 50;
      let whyItFits = "Excellent high-performance luxury machine matching your interest in peak motoring.";
      
      if (lowerQuery.includes(car.brand.toLowerCase())) {
        score += 30;
        whyItFits = `Direct match for ${car.brand}'s signature performance engineering and styling.`;
      }
      if (lowerQuery.includes(car.fuelType.toLowerCase()) || (lowerQuery.includes('electric') && car.fuelType === 'Electric')) {
        score += 20;
        whyItFits = `Fulfills your preference for a high-efficiency ${car.fuelType} propulsion system.`;
      }
      if (lowerQuery.includes('fast') || lowerQuery.includes('speed') || lowerQuery.includes('track') || lowerQuery.includes('sport')) {
        if (car.category === 'Supercar' || car.category === 'Hypercar') {
          score += 15;
          whyItFits = `Matches your speed desires with a devastating 0-60mph score of ${car.specifications.acceleration}.`;
        }
      }

      return {
        carId: car.id,
        brand: car.brand,
        model: car.model,
        whyItFits,
        matchScore: Math.min(score, 100)
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

    return res.json({
      recommendations,
      reasoningSummary: `**Simulated Assistant:** Showing matches for your query "${query}". Define your **GEMINI_API_KEY** in the AI Studio environment settings to enable the actual Gemini 3.5 AI neural recommendation engine!`,
      recommendedFilters: {
        brand: recommendations[0]?.brand || 'All',
        fuelType: query.toLowerCase().includes('electric') ? 'Electric' : 'All',
        maxPrice: -1,
        transmission: 'All'
      }
    });
  }

  // Define structured cars database summaries to send to Gemini
  const simplifiedCars = mockCars.map(car => ({
    id: car.id,
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: car.price,
    fuelType: car.fuelType,
    transmission: car.transmission,
    category: car.category,
    acceleration: car.specifications.acceleration,
    power: car.specifications.power,
    range: car.specifications.batteryRange || 'N/A',
    country: car.country
  }));

  try {
    const prompt = `
      You are an elite, highly knowledgeable automotive expert and matching guide for the "Premium Car Marketplace".
      A user gives the following personalized query: "${query}"

      Here are the available premium cars in the inventory:
      ${JSON.stringify(simplifiedCars, null, 2)}

      Analyze the user's intent, constraints (budget, vehicle type, country, style), and matching options.
      Highlight the top 3 best matching cars from the inventory. If the exact model they want doesn't exist, suggest the closest luxury equivalent from our inventory.

      Explain concisely 'whyItFits' in a friendly, sophisticated manner.
      Provide a markdown 'reasoningSummary' explaining the technical context and trade-offs.
      Define 'recommendedFilters' containing values matching our inventory properties to help update the UI filters automatically.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are the head premium car advisor. Respond exclusively with a valid JSON representation matching the requested schema.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoningSummary: {
              type: Type.STRING,
              description: "A summary in Markdown detailing the technical merits, performance profile, country of origin, and trade-offs of the matches."
            },
            recommendations: {
              type: Type.ARRAY,
              description: "The list of the top 3 recommended vehicles.",
              items: {
                type: Type.OBJECT,
                properties: {
                  carId: { type: Type.STRING, description: "The ID of the car (e.g. 'c1', 'c2') if matched with one of the premium inventory, or empty if general suggestion." },
                  brand: { type: Type.STRING },
                  model: { type: Type.STRING },
                  whyItFits: { type: Type.STRING, description: "A tailored, high-end 1-2 sentence description explaining why this perfectly hits their criteria." },
                  matchScore: { type: Type.INTEGER, description: "Dynamic match percentage from 0 to 100 based on user demands." }
                },
                required: ["brand", "model", "whyItFits", "matchScore"]
              }
            },
            recommendedFilters: {
              type: Type.OBJECT,
              description: "Suggested filters to apply directly to the user interface.",
              properties: {
                brand: { type: Type.STRING, description: "Suggested brand or 'All'" },
                fuelType: { type: Type.STRING, description: "Suggested fuelType or 'All'" },
                maxPrice: { type: Type.INTEGER, description: "Max budget limit or -1 for no restriction" },
                transmission: { type: Type.STRING, description: "Suggested Transmission or 'All'" }
              },
              required: ["brand", "fuelType", "maxPrice", "transmission"]
            }
          },
          required: ["recommendations", "reasoningSummary", "recommendedFilters"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "AI Generation error: " + err.message });
  }
});

// Side-by-Side Car Comparison AI Expert
app.post('/api/car-compare-ai', async (req, res) => {
  const { carAId, carBId } = req.body;
  if (!carAId || !carBId) {
    return res.status(400).json({ error: 'Two car IDs are required for side-by-side comparison.' });
  }

  const carA = mockCars.find(c => c.id === carAId);
  const carB = mockCars.find(c => c.id === carBId);

  if (!carA || !carB) {
    return res.status(404).json({ error: 'One or both of the specified cars could not be located in our inventory.' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      verdict: `A premium match comparison of **${carA.brand} ${carA.model}** and **${carB.brand} ${carB.model}**.`,
      analysisText: `**Simulated Expert Comparison:**\n\n- **${carA.brand} ${carA.model}** (${carA.year}) represents ${carA.country} style with its ${carA.specifications.engine} putting out ${carA.specifications.power}. Priced at $${carA.price.toLocaleString()}.\n- **${carB.brand} ${carB.model}** (${carB.year}) representing ${carB.country} focuses on ${carB.specifications.engine} with ${carB.specifications.power}. Priced at $${carB.price.toLocaleString()}.\n\n*To enable an immersive, smart, personalized comparison verdict generated dynamically using Porsche/Tesla-grade AI, please configure your **GEMINI_API_KEY** in your workspace Secrets configuration panel.*`
    });
  }

  try {
    const prompt = `
      You are the ultimate track and luxury car review expert.
      Complete a premium side-by-side comparison review of these two cars:
      
      CAR A:
      ${JSON.stringify(carA, null, 2)}

      CAR B:
      ${JSON.stringify(carB, null, 2)}

      Give a highly polished comparison details, detailing power dynamics, value retention, charging/refining properties, and target demographic.
      Return a JSON object containing keys 'analysisText' (formatted nicely in Markdown with elegant titles) and 'verdict' (a short summary sentence naming which car is superior in what area).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You represent the ultimate motorcar expert. Respond exclusively with a valid JSON representation.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysisText: { type: Type.STRING, description: "Detailed structural markdown analysis highlighting specific segments like Engineering, Driving Feel, Future Value and Technology." },
            verdict: { type: Type.STRING, description: "A elegant overall verdict summary declaring a clear winner for different kinds of owners." }
          },
          required: ["analysisText", "verdict"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini API Error in comparison:", err);
    res.status(500).json({ error: "Comparison generation error: " + err.message });
  }
});

// Initialize Vite and handle development vs production routes
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend build
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully. Listening at http://localhost:${PORT}`);
  });
}

startServer();
