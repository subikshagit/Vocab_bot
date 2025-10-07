import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { authRequest } from "@/contexts/authcontext";
import { Button } from "@/components/ui/button";   // ✅ add button
import { useNavigate } from "react-router-dom";   // ✅ import navigate

const QuizHistory = () => {
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const navigate = useNavigate();  // ✅ setup navigation

  // fetch quiz summaries
  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      try {
        const response = await authRequest("http://localhost:8000/api/quiz/recent/");
        const data = await response.json();
        setRecentQuizzes(data);
        console.log("Recent quizzes from backend:", data);
      } catch (err) {
        console.error("Failed to fetch recent quizzes:", err);
      }
    };
    fetchRecentQuizzes();
  }, []);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Quiz History</CardTitle>
        <CardDescription>Complete history of your quiz performances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-smooth"
            >
              {/* Summary left */}
              <div className="flex items-center space-x-4">
                <div className="gradient-primary p-2 rounded-lg">
                  <Trophy className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">
                    Quiz on{" "}
                    {new Date(quiz.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {quiz.score} out of {quiz.total} questions correct
                  </p>
                </div>
              </div>

              {/* Right side: accuracy + button */}
              <div className="flex items-center space-x-3">
                <Badge
                  variant={quiz.accuracy >= 80 ? "default" : "secondary"}
                  className={quiz.accuracy >= 80 ? "gradient-accent" : ""}
                >
                  {quiz.accuracy}%
                </Badge>

                {/* ✅ Review button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/quiz-review/${quiz.id}`)}
                >
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizHistory;
