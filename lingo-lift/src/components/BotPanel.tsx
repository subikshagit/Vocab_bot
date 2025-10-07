// components/BotPanel.tsx
import BotPage from "@/pages/BotPage"; // your chatbot component
import { X } from "lucide-react";

interface BotPanelProps {
  open: boolean;
  onClose: () => void;
}

const BotPanel = ({ open, onClose }: BotPanelProps) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-gray-900 text-white shadow-2xl transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header with Close Button */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <h3 className="text-lg font-bold">📘 VocabGenie</h3>
        <button onClick={onClose}>
          <X className="h-6 w-6 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Chatbot Content */}
      <div className="h-[calc(100%-60px)] overflow-y-auto">
        <BotPage />
      </div>
    </div>
  );
};

export default BotPanel;
    