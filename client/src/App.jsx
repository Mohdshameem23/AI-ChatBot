import React, { useState, useEffect, useRef } from "react";
import { IoSparklesSharp } from "react-icons/io5";
import axios from "axios";
import ReadMore from "./component/ReadMore";
import VoiceInput from "./component/VoiceInput";
import "./App.css";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const chatEndRef = useRef(null);

  // Clean AI response
  const cleanResponse = (text) => {
    if (!text) return "";
    return text
      .replace(/[\*\_\~\`\•\-]/g, "")
      .replace(/\n\s*\n/g, "\n")
      .trim();
  };

  // Human-like speech output
  const speakText = (text) => {
    const lang = /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-US";
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = synth.getVoices();
    // Prefer Google voices for natural sound, fallback to first available
    utterance.voice = voices.find(v => v.lang === lang && v.name.includes("Google")) || voices[0];

    utterance.rate = 1;  // speed
    utterance.pitch = 1; // natural pitch
    synth.speak(utterance);
  };

  // Fetch AI response
  async function getData(query, lang) {
    try {
      const promptWithLang = lang === "hi-IN" ? "Respond in Hindi: " + query : query;
      const response = await axios.post("https://ai-chat-bot-pi-ten.vercel.app/generate", { prompt: promptWithLang });

      const cleanText = cleanResponse(response.data.output);

      setMessages((prev) => {
        const newMessages = prev.filter((msg) => !msg.loading);
        return [...newMessages, { text: cleanText, sender: "bot" }];
      });

      speakText(cleanText);
    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        const newMessages = prev.filter((msg) => !msg.loading);
        return [...newMessages, { text: "Oops! Something went wrong.", sender: "bot" }];
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSend = (message) => {
    const finalMessage = message || prompt;
    if (!finalMessage.trim()) return;

    // Auto-detect language
    const lang = /[\u0900-\u097F]/.test(finalMessage) ? "hi-IN" : "en-US";
    setLanguage(lang);

    setMessages((prev) => [...prev, { text: finalMessage, sender: "user" }]);
    setPrompt("");

    setMessages((prev) => [...prev, { text: "Bot is typing...", sender: "bot", loading: true }]);
    setLoading(true);

    getData(finalMessage, lang);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 flex flex-col bg-gradient-to-t from-pink-200 to-purple-50">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 opacity-40"></div>

        {/* Header */}
        <div className="relative z-10 flex flex-col items-center mb-6">
          <div className="text-purple-600 mb-2"><IoSparklesSharp size={30} /></div>
          <h1 className="text-2xl font-semibold text-gray-800">Ask our AI anything</h1>
        </div>

        {/* Suggestions */}
        <div className="relative z-10 w-full text-left mb-4">
          <h3 className="text-md text-gray-600 font-medium mb-3">Suggestions on what to ask Our AI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <button onClick={() => handleSend("What can I ask you to do?")} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl text-gray-700 cursor-pointer">What can I ask you to do?</button>
            <button onClick={() => handleSend("What is API?")} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl text-gray-700 cursor-pointer">What is API?</button>
            <button onClick={() => handleSend("Tell me a joke.")} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl text-gray-700 cursor-pointer">Tell me a joke.</button>
          </div>
        </div>

        {/* Chat Display */}
        <div className="relative z-10 w-full max-h-80 overflow-y-auto p-4 text-left no-scrollbar">
          {messages.length === 0 && <p className="text-gray-400 text-sm text-center">Start a conversation by selecting a suggestion or typing below.</p>}

          {messages.map((msg, index) => (
            <div key={index} className={`flex mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-sm break-words ${
                msg.sender === "user"
                  ? "bg-pink-300 text-gray-700 rounded-br-none"
                  : "bg-purple-200 text-gray-800 rounded-bl-none"
              }`}>
                {msg.loading ? "Bot is typing..." : msg.text.length > 300 ? <ReadMore text={msg.text} /> : msg.text}
              </div>
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>

        {/* Voice Input */}
        <VoiceInput value={prompt} onChange={setPrompt} onSend={handleSend} selectedLanguage={language} />
      </div>
    </div>
  );
};

export default App;
