import React, { useState, useEffect, useRef } from "react";
import { IoSparklesSharp } from "react-icons/io5";
import axios from "axios";
import ReadMore from "./component/ReadMore";
import VoiceInput from "./component/VoiceInput";
import "./App.css";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  async function getData(query) {
    try {
      const response = await axios.post("http://localhost:3000/generate", {
        prompt: query,
      });
      setMessages((prev) => [
        ...prev,
        { text: response.data.output, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Oops! Something went wrong. Please try again.",
          sender: "bot",
        },
      ]);
    }
  }

  const handleChange = (newPrompt = "What can I ask you to do?") => {
    setMessages((prev) => [...prev, { text: newPrompt, sender: "user" }]);
    getData(newPrompt);
  };

  const handleSend = () => {
    if (!prompt.trim()) return;
    setMessages((prev) => [...prev, { text: prompt, sender: "user" }]);
    getData(prompt);
    setPrompt("");
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
          <div className="text-purple-600 mb-2">
            <IoSparklesSharp size={30} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Ask our AI anything
          </h1>
        </div>

        {/* Suggestions */}
        <div className="relative z-10 w-full text-left mb-4">
          <h3 className="text-md text-gray-600 font-medium mb-3">
            Suggestions on what to ask Our AI
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleChange("What can I ask you to do?")}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl text-gray-700 cursor-pointer"
            >
              What can I ask you to do?
            </button>
            <button
              onClick={() => handleChange("What is API?")}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl text-gray-700 cursor-pointer"
            >
              What is API?
            </button>
            <button
              onClick={() => handleChange("Tell me a joke.")}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl text-gray-700 cursor-pointer"
            >
              Tell me a joke.
            </button>
          </div>
        </div>

        {/* Chat Display */}
        <div className="relative z-10 w-full max-h-80 overflow-y-auto p-4 text-left no-scrollbar">
          {messages.length === 0 && (
            <p className="text-gray-400 text-sm text-center">
              Start a conversation by selecting a suggestion or typing below.
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-sm break-words ${
                  msg.sender === "user"
                    ? "bg-pink-300 text-gray-700 rounded-br-none"
                    : "bg-purple-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text.length > 300 ? (
                  <ReadMore text={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Voice Input */}
        <VoiceInput
          value={prompt}
          onChange={setPrompt}
          onSend={handleSend}
        />
      </div>
    </div>
  );
};

export default App;
