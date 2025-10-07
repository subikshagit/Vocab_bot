import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { authRequest } from "@/contexts/authcontext";

const BotPage = () => {
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "bot",
      content:
        "👋 Hi! I’m VocabGenie. What word should I define for you today?",
    },
  ]);
  
  const [chatInput, setChatInput] = useState("");
  const [botLoading, setBotLoading] = useState(false);
  const [showBot, setShowBot] = useState(true);


  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, botLoading]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);

    const input = chatInput;
    setChatInput("");
    setBotLoading(true);

    try {
      const response = await authRequest(
        `http://localhost:8000/api/ai-definition/?word=${input}`
      );
      const data = await response.json();

      const botMessage = {
        role: "bot",
        content:
          data.definition ||
          "Error: " + (data.error || "Something went wrong"),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const botMessage = {
        role: "bot",
        content: "⚠️ Network error, please try again!",
      };
      setChatMessages((prev) => [...prev, botMessage]);
    } finally {
      setBotLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-xl border border-gray-700 rounded-2xl overflow-hidden bg-gray-900">
        {/* Bot Header */}
        <div className="bg-gray-800 text-white text-center py-3 border-b border-gray-700">
          <h2 className="text-2xl font-bold tracking-wide">📘 VocabGenie</h2>
          <p className="text-sm text-gray-400">Your AI Vocabulary Assistant</p>
        </div>


        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {msg.role === "bot" && (
                <div className="w-8 h-8 mr-2 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  🤖
                </div>
              )}
              <span
                className={`px-4 py-2 text-sm max-w-[70%] whitespace-pre-line fade-in 
                  ${msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-lg rounded-br-none shadow-lg"
                    : "bg-gradient-to-br from-gray-700 to-gray-600 text-white rounded-lg rounded-bl-none shadow-md"
                  }`}
              >
                {msg.content}
              </span>
              {msg.role === "user" && (
                <div className="w-8 h-8 ml-2 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                  🧑
                </div>
              )}
            </div>
          ))}

          {botLoading && (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="dot-pulse w-2 h-2 bg-white rounded-full"></div>
              <div className="dot-pulse w-2 h-2 bg-white rounded-full"></div>
              <div className="dot-pulse w-2 h-2 bg-white rounded-full"></div>
              Bot is typing...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex gap-2">
          <Input
            placeholder="Type your message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={botLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Send
          </Button>
        </div>
      </Card>

      {/* Extra Styles */}
      <style>{`
        .fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dot-pulse {
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default BotPage;
