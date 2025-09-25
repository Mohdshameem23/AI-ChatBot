import { useState, useEffect } from "react";
import { IoMicSharp, IoSendSharp } from "react-icons/io5";

const VoiceInput = ({ value, onChange, onSend }) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = false; // stops automatically after speech
    recog.interimResults = false; // only final results
    recog.lang = "en-US";

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(transcript);
      setListening(false);
    };

    recog.onend = () => setListening(false);

    setRecognition(recog);
  }, [onChange]);

  const handleMicClick = () => {
    if (!recognition)
      return alert("Your browser does not support Speech Recognition");
    setListening(true);
    recognition.start();
  };

  const handleSend = () => {
    if (!value.trim()) return;
    onSend();
  };

  return (
    <div className="relative w-full mt-4">
      <input
        type="text"
        placeholder="Ask me anything"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="w-full py-3 pl-6 pr-16 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-500"
      />
      {/* Microphone button */}
      <button
        onClick={handleMicClick}
        className={`absolute right-10 top-1/2 transform -translate-y-1/2 p-2 rounded-full cursor-pointer ${
          listening ? "text-red-500 animate-pulse" : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <IoMicSharp size={24} />
      </button>
      {/* Send button */}
      <button
        onClick={handleSend}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-gray-600 cursor-pointer hover:text-gray-800"
      >
        <IoSendSharp size={24} />
      </button>
    </div>
  );
};

export default VoiceInput;
