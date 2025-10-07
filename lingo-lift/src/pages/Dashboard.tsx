import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BookOpen, Trophy, Target, ArrowRight } from "lucide-react";
import {  authRequest} from "@/contexts/authcontext";
import BotPanel from "@/components/BotPanel";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [searchWord, setSearchWord] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [word, setWord] = useState(null);
  const [learningList, setLearningList] = useState([]);
  const [count, setCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [profile, setProfile] = useState({ name: "User" });
  const [loading, setLoading] = useState(true);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const navigate = useNavigate();
  const API_URL =  import.meta.env.VITE_BACKEND_API_URL;


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authRequest(`${API_URL}/api/auth/profile/`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/words/random`)
      .then(res => res.json())
      .then(data => setWord(data))
      .catch(err => setError("Error fetching word: " + err.message));
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await authRequest(`${API_URL}/api/learning-list/count/`);
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error("Error fetching learning list count:", error);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await authRequest(`${API_URL}/api/quiz/streak/`);
        const data = await response.json();
        setStreak(data.streak);
      } catch (error) {
        console.error("Error fetching streak:", error);
      }
    };
    fetchStreak();
  }, []);

  useEffect(() => {
    const fetchAccuracy = async () => {
      try {
        const response = await authRequest(`${API_URL}/api/quiz/average-accuracy/`);
        const data = await response.json();
        setAccuracy(data.accuracy);
      } catch (error) {
        console.error("Error fetching average accuracy:", error);
      }
    };
    fetchAccuracy();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const response = await authRequest(
        `${API_URL}/api/words/search/?q=${searchWord}`,
        { method: "GET" }
      );
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || "Something went wrong");
        setResult({ found: false });
        return;
      }
      setResult(data.found ? data : { found: false });
    } catch (err) {
      setError(err.message || "Network error, please try again!");
    }
  };

  const handleAddToLearning = async (wordId) => {
    setError("");
    try {
      const response = await authRequest(`${API_URL}/api/learning-list/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word_id: wordId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to add word");
        return;
      }
      alert(data.message || "Word added successfully!");
    } catch (err) {
      setError(err.message || "Network error, please try again!");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-primary bg-clip-text text-transparent">{profile.name}</span>
          </h1>
          <p className="text-muted-foreground text-lg">Ready to expand your vocabulary today?</p>
        </div>

        {/* Search Section */}
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Search className="h-5 w-5 mr-2 text-white" />
            Discover New Words
          </CardTitle>
          <CardDescription className="text-gray-300">
            Search for any word to learn its meaning, pronunciation, and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter a word to learn..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="pl-10 text-lg h-12 bg-gray-800 text-white border-gray-600 placeholder-gray-400"
              />
            </div>
            <Button type="submit" size="lg" className="px-8 bg-blue-600 hover:bg-blue-700 text-white">
              Search
            </Button>
          </form>
          {result && result.found && result.word && (
            <div className="mt-4 p-4 border border-gray-700 rounded-md bg-gray-900 text-white">
              <h3 className="text-xl font-bold text-blue-400">{result.word.text}</h3>
              <p className="mb-2">
                <span className="font-semibold text-green-400">Meaning:</span> {result.word.meaning}
              </p>
              <p>
                <span className="font-semibold text-yellow-400">Example:</span> {result.word.example}
              </p>
            </div>
          )}
          {result && !result.found && (
            <p className="mt-2 text-red-500">Word "{searchWord}" not found.</p>
          )}
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </CardContent>

        {/* Word of the Day */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-accent" />
                Word of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              {word ? (
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-primary mb-2">{word.text}</h3>
                  <p className="text-lg mb-2">
                    <span className="font-semibold">Definition:</span> {word.meaning}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Example:</span> {word.example}
                  </p>

                  <div className="space-y-4">
                    <Button
                      variant="accent"
                      className="w-full sm:w-auto"
                      onClick={() => handleAddToLearning(word.id)}
                    >
                      <Target className="h-4 w-4 mr-6" />
                      Add to Learning List
                    </Button>
                    <div >
                      <Link to="/learning-list">
                        <Button variant="accent" className="w-full sm:w-auto">
                          <BookOpen className="h-4 w-4 mr-4" />
                          Show My Learning List
                        </Button>
                      </Link>
                    </div>
                    <div>
                      {/* ✅ Redirect to Bot Page */}
                      <div className="flex">
                        {/* Main Dashboard Content */}
                        <div className="flex-1 p-6">
                          {/* your dashboard content here */}

                          {/* ✅ Open Bot Sidebar */}
                          <Button
                            onClick={() => navigate("/bot")}
                            className="flex justify-between items-center font-bold
            px-12 py-6 text-2xl
            bg-gradient-to-r from-purple-600 to-pink-500
            text-white hover:scale-105 hover:shadow-xl
            transition-transform duration-300 ease-in-out w-full max-w-md"
                          >
                            <div className="flex items-center">
                              <BookOpen className="h-8 w-8 mr-12 text-white center" />
                              Ask the Bot
                            </div>
                            <ArrowRight className="h-8 w-8 text-white" />
                          </Button>
                        </div>

                        {/* Sidebar Bot */}
                        <BotPanel open={isBotOpen} onClose={() => setIsBotOpen(false)} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/quiz">
                  <Button variant="card" className="w-full justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-accent" />
                      Start Quiz
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/review-words">
                  <Button variant="card" className="w-full justify-between">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                      Review Words
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Words Learned</span>
                    <span className="text-2xl font-bold text-primary">{count ?? "..."}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Quiz Streak</span>
                    <span className="text-2xl font-bold text-accent">{streak}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="text-2xl font-bold text-primary">{accuracy}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
