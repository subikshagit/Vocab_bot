import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const FrontPage = () => {
  const navigate = useNavigate();

  // Common motion animation for all cards
  const cardVariants = {
    hover: { scale: 1.05, boxShadow: "0px 8px 20px rgba(128, 0, 128, 0.2)" },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-lavender-200 to-purple-50 text-gray-900 flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center h-screen text-center px-6 bg-gradient-to-br from-purple-300 via-lavender-200 to-purple-100">
        <h1 className="text-6xl font-extrabold mb-4 text-purple-800 drop-shadow-md">
          ✨ Vocab Learn
        </h1>
        <p className="text-xl mb-10 max-w-2xl text-purple-700 leading-relaxed">
          Elevate your English vocabulary with AI-powered explanations,
          pronunciation, and personalized learning techniques.
        </p>
        <div className="flex gap-6">
          <Button
            onClick={() => navigate("/login")}
            className="bg-purple-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-purple-800 transition-all"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            className="bg-white text-purple-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-purple-100 transition-all"
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* About Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-10 text-purple-700">
            🌸 Why Choose Vocab Learn?
          </h2>
          <p className="text-lg mb-12 leading-relaxed text-gray-700">
            <span className="font-semibold text-purple-700">Vocab Learn</span> is your
            personal AI-powered vocabulary coach. It transforms simple word learning
            into a meaningful, interactive experience — helping you master pronunciation,
            usage, and retention with science-backed learning methods.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div whileHover="hover" whileTap="tap" variants={cardVariants}>
              <Card className="bg-purple-50 shadow-md rounded-2xl transition-all">
                <CardHeader>
                  <CardTitle className="text-purple-800 text-xl">
                    📖 Learn Intelligently
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  Get AI-curated definitions and examples that explain words
                  deeply — so you don’t just memorize, you *understand*.
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2 */}
            <motion.div whileHover="hover" whileTap="tap" variants={cardVariants}>
              <Card className="bg-purple-50 shadow-md rounded-2xl transition-all">
                <CardHeader>
                  <CardTitle className="text-purple-800 text-xl">
                    🧠 Practice Smartly
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  Adaptive quizzes and flashcards train your brain to recall
                  words faster and retain them longer.
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3 */}
            <motion.div whileHover="hover" whileTap="tap" variants={cardVariants}>
              <Card className="bg-purple-50 shadow-md rounded-2xl transition-all">
                <CardHeader>
                  <CardTitle className="text-purple-800 text-xl">
                    📊 Track Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  Visualize your progress with streaks, daily goals, and
                  mastery stats — keep the motivation alive!
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-purple-50 to-lavender-100 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10 text-purple-700">
            💡 More About Vocab Learn
          </h2>
          <p className="text-lg mb-12 leading-relaxed text-gray-700">
            Designed for learners of all levels — whether you're preparing for
            exams or just polishing your language skills. Vocab Learn uses{" "}
            <span className="font-semibold text-purple-600">AI and data-driven
            learning</span> to personalize your journey, making vocabulary building
            feel fun and effortless.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 4 */}
            <motion.div whileHover="hover" whileTap="tap" variants={cardVariants}>
              <Card className="bg-white shadow-md rounded-2xl transition-all">
                <CardHeader>
                  <CardTitle className="text-purple-700 text-lg">
                    🎙️ Pronunciation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  Hear native pronunciations and practice alongside to perfect
                  your accent and clarity.
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 5 */}
            <motion.div whileHover="hover" whileTap="tap" variants={cardVariants}>
              <Card className="bg-white shadow-md rounded-2xl transition-all">
                <CardHeader>
                  <CardTitle className="text-purple-700 text-lg">
                    🧩 Contextual Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  Learn how words behave in real sentences through AI-generated
                  examples and contextual hints.
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 6 */}
            <motion.div whileHover="hover" whileTap="tap" variants={cardVariants}>
              <Card className="bg-white shadow-md rounded-2xl transition-all">
                <CardHeader>
                  <CardTitle className="text-purple-700 text-lg">
                    🌍 Community Learning
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  Join word challenges, leaderboards, and peer competitions to
                  learn collaboratively.
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-700 text-white text-center py-6 mt-auto">
        <p>© 2025 Vocab Learn. Built with 🩶 by passionate learners for learners.</p>
      </footer>
    </div>
  );
};

export default FrontPage;
