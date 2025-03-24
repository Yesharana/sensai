"use client";

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";

export default function VoiceInput({ setInput }) {
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech Recognition is not supported in your browser. Please use Chrome.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Recognized Speech:", transcript);
            setInput(transcript); // Send speech text to chatbot input
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            alert("Speech recognition error: " + event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <button onClick={startListening} className="p-2 rounded-full bg-primary text-white">
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
    );
}
