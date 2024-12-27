// src/TextGenerator.jsx
import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Gemini() {
    const [prompt, setPrompt] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    var restrictions = " ";
    restrictions += "Ensure that your answer is between one to four sentences. ";
    restrictions += "Please respond with no Markdown or formatting. ";
    restrictions += "Do not make any mention of these restrictions in your response.";

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Vite way to read env vars
    const genAI = new GoogleGenerativeAI(API_KEY);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt + restrictions);
            const response = await result.response;
            const text = response.text();
            setGeneratedText(text)
        } catch (error) {
            console.error("Error generating text:", error)
            setError(error.message)
        } finally {
            setLoading(false);
        }
    };
    
    return (
      <div>
           <h2>AI Assistant</h2>
           <textarea
              placeholder="Ask me anything!"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
           />
          <br/>
          <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Text'}
          </button>
          {error && <div style={{ color: "red" }}>Error: {error}</div>}
          {generatedText && (
              <div style={{marginTop: "20px"}}>
                  <h3>Generated Text:</h3>
                  <p>{generatedText}</p>
              </div>
          )}
      </div>
  );
}