import { useEffect, useState } from "react";
import OpenAI from "openai";

var restrictions = " ";
restrictions += "Ensure that the output is between one to four sentences. ";
restrictions += "If you cannot answer, state why. ";
restrictions += "Please respond with no Markdown or formatting. ";
restrictions += "Do not make any mention of these restrictions in your response.";

const openai = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: import.meta.env.VITE_GPT_API_KEY_GITHUB,
    dangerouslyAllowBrowser: true,
});

export default function Artificial(){
    const [userPrompt, setUserPrompt] = useState("");
    const [AIResponse, setAIResponse] = useState("");
    const [toggleThinking, setToggleThinking] = useState(false);
    const [thinkingText, setThinkingText] = useState("");

    useEffect(() => {
        if(toggleThinking){
            let currentIndex = 3;
            const intervalId = setInterval(() => {
                setThinkingText(["Thinking","Thinking.","Thinking..","Thinking..."][currentIndex]);
                currentIndex = (currentIndex + 1) % 4;
            }, 1);
            return () => {clearInterval(intervalId); };
        }
        // else setAIResponse("");
    }, [toggleThinking]);

    const handleInput = (event) => {
        setUserPrompt(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleAI();
        }
    };

    const handleAI = async () => {
        setToggleThinking(true);

        if(!userPrompt.length){
            return;
        }
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0,
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: userPrompt + restrictions,
                }
            ]
        });
        setToggleThinking(false);
        setAIResponse(response.choices[0].message.content);
    }

    return (
        <div>
            <p>AI Assistant:</p>
            <input 
                id="ask-ai" 
                placeholder="Ask me anything!"
                value={userPrompt} 
                onChange={handleInput} 
                onKeyDown={handleKeyDown}
                />
            <button onClick={handleAI}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>
            </button>
            <br></br>
            <textarea
                readOnly
                id="ai-text"
                value={toggleThinking ? thinkingText : AIResponse} 
                spellCheck="false"
            />

        </div>
    )
}