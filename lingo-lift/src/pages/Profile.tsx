import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authRequest } from "@/contexts/authcontext";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Avatar, AvatarFallback
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User, BookOpen, Trophy, Target, Calendar, TrendingUp, LogOut, Award,
  CheckCircle
} from "lucide-react";


interface ProfileData {
  name: string;
  email: string;
  joined_date: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await authRequest("http://localhost:8000/api/quiz/streak/");
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
        const response = await authRequest("http://localhost:8000/api/quiz/average-accuracy/");
        const data = await response.json();
        setAccuracy(data.accuracy);
      } catch (error) {
        console.error("Error fetching average accuracy:", error);
      }
    };

    fetchAccuracy();
  }, []);

  // ✅ Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authRequest("http://localhost:8000/api/auth/profile/");
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
    const fetchCount = async () => {
      try {
        const response = await authRequest("http://localhost:8000/api/learning-list/count/");
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error("Error fetching learning list count:", error);
      }
    };

    fetchCount();
  }, []);


  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      try {
        const response = await authRequest("http://localhost:8000/api/quiz/recent/");
        const data = await response.json();
        setRecentQuizzes(data);
      } catch (error) {
        console.error("Error fetching recent quizzes:", error);
      }
    };

    fetchRecentQuizzes();
  }, []);


  if (loading) return <div className="p-6 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-6 text-center">No profile found!</div>;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">

        {/* Profile Header */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl gradient-primary text-primary-foreground">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Member since{" "}
                      {new Date(profile.joined_date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grid: Horizontal Cards for Progress Metrics */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Words Learned */}
          <Card className="flex-1 shadow-xl rounded-2xl border border-gray-100 p-6 text-center">
            <CardHeader className="flex justify-center">
              <CardTitle className="flex items-center text-lg font-semibold">
                <TrendingUp className="h-6 w-6 mr-2 text-gradient-to-r from-indigo-500 to-purple-500" />
                Words Learned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-extrabold text-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-2">
                {count}
              </div>
              <p className="text-muted-foreground font-medium">Total words you've learned</p>
            </CardContent>
          </Card>

          {/* Day Streak */}
          <Card className="flex-1 shadow-xl rounded-2xl border border-gray-100 p-6 text-center">
            <CardHeader className="flex justify-center">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Trophy className="h-6 w-6 mr-2 text-gradient-to-r from-green-500 to-green-700" />
                Day Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-700 mb-2">{streak}</div>
              <p className="text-sm text-green-800 font-medium">Current streak of daily quizzes</p>
              <div className="mt-2 h-2 w-full bg-green-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(streak * 10, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Avg. Accuracy */}
          <Card className="flex-1 shadow-xl rounded-2xl border border-gray-100 p-6 text-center">
            <CardHeader className="flex justify-center">
              <CardTitle className="flex items-center text-lg font-semibold">
                <CheckCircle className="h-6 w-6 mr-2 text-gradient-to-r from-blue-500 to-blue-700" />
                Avg. Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-700 mb-2">{accuracy}%</div>
              <p className="text-sm text-blue-800 font-medium">Your average quiz accuracy</p>
              <div className="mt-2 h-2 w-full bg-blue-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg rounded-2xl border border-gray-100 bg-gradient-to-r from-gray-900 to-black text-white overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-white">
              <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your latest quiz performances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentQuizzes.length > 0 ? (
              recentQuizzes.slice(0, 3).map((quiz, index) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-800 bg-opacity-50 shadow-md"
                  // Adding a subtle animation for better user experience
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-200">
                      {new Date(quiz.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {quiz.score}/{quiz.total} correct
                    </p>
                  </div>
                  <Badge
                    className={`px-3 py-1 rounded-full font-medium text-white ${quiz.accuracy >= 80
                      ? "bg-gradient-to-r from-teal-500 to-green-500"
                      : "bg-orange-500"
                      }`}
                  >
                    {quiz.accuracy}%
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-800 italic text-center mt-2">
                No recent activity yet
              </p>
            )}
          </CardContent>
        </Card>


        {/* Full Quiz History */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quiz History</CardTitle>
            <CardDescription>Complete history of your quiz performances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <div className="flex justify-end">
                    <Link to="/quiz-history" className="text-primary hover:underline">
                      View Full Quiz History →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Profile;
