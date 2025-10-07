import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { authRequest } from "@/contexts/authcontext";  // ✅ import your helper

const ReviewWords = () => {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL =  import.meta.env.VITE_BACKEND_API_URL;


  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await authRequest(`${API_URL}0/api/review-words/`, {
          method: "GET",
        });
        const data = await res.json();
        setWords(data);
      } catch (err) {
        console.error("Error fetching words:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  if (loading)
    return <div className="p-6 text-center">Loading your words...</div>;
  if (!words.length)
    return <div className="p-6 text-center">No words to review yet!</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center justify-center mb-6">
        <BookOpen className="h-7 w-7 mr-2 text-primary" /> Review Words
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((word, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Card className="p-6 h-40 flex flex-col justify-center items-center 
              shadow-xl rounded-2xl bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 text-white">
              <h2 className="text-2xl font-extrabold mb-2">{word.text}</h2>
              <p className="text-lg font-bold opacity-90">{word.meaning}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewWords;
