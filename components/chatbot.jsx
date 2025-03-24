"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare, Send, X, Loader2, MinusCircle, Mic, MicOff } from "lucide-react";
import { FaSmile, FaThumbsUp, FaHeart } from "react-icons/fa";
import Image from "next/image";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello! I'm your career assistant. How can I help you today?" },
  ]);
  const [reactions, setReactions] = useState({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);

        // Handle specific errors
        if (event.error === "no-speech") {
          alert("No speech detected. Please try again.");
          setTimeout(() => {
            recognitionRef.current.start(); // Retry after a short delay
          }, 1000);
        } else if (event.error === "audio-capture") {
          alert("Microphone not found or access denied. Please check your microphone settings.");
        } else if (event.error === "network") {
          alert("Network error. Please check your internet connection and try again.");
        } else {
          alert("An error occurred with speech recognition. Please try again.");
        }
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "system", content: data.message }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "system", content: "Oops! Something went wrong. Try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addReaction = (index, emoji) => {
    setReactions((prev) => ({ ...prev, [index]: emoji }));
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 shadow-lg"
        variant={isOpen ? "destructive" : "default"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 md:w-96 shadow-xl border-2 z-50 flex flex-col h-96">
          {/* Header */}
          <CardHeader className="bg-primary text-primary-foreground py-2 px-4 flex flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <Image src="/2.jpg" alt="Chatbot Avatar" width={32} height={32} className="rounded-full" />
              </Avatar>
              <h3 className="font-medium">SensMate</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-primary-foreground hover:text-primary hover:bg-primary-foreground"
              onClick={() => setIsOpen(false)}
            >
              <MinusCircle size={16} />
            </Button>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} relative`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                  {reactions[index] && <span className="ml-2">{reactions[index]}</span>}
                </div>

                {/* Emoji reaction buttons */}
                {message.role !== "user" && (
                  <div className="absolute -bottom-5 left-2 flex space-x-2">
                    <button onClick={() => addReaction(index, "😊")}><FaSmile className="text-yellow-500" /></button>
                    <button onClick={() => addReaction(index, "👍")}><FaThumbsUp className="text-blue-500" /></button>
                    <button onClick={() => addReaction(index, "❤️")}><FaHeart className="text-red-500" /></button>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] p-3 rounded-lg bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Bot is typing...
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Field */}
          <CardFooter className="p-2 border-t">
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading || isListening}
                className="flex-1"
              />
              <Button
                type="button"
                size="icon"
                onClick={toggleListening}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
