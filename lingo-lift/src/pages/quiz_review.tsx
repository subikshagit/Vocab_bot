import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { authRequest } from "@/contexts/authcontext";

interface AttemptedQuestion {
  id: number;
  question_text: string;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
}

interface QuizAttempt {
  id: number;
  score: number;
  total_questions: number;
  created_at: string;
  questions: AttemptedQuestion[];
}

const QuizReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const response = await authRequest(
          `http://localhost:8000/api/quiz-attempts/${id}/`
        );
        const data = await response.json();
        setAttempt(data);
        console.log("Quiz attempt data:", data);
      } catch (err) {
        console.error("Failed to fetch quiz attempt:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAttempt();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        Loading quiz review...
      </p>
    );
  }

  if (!attempt) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="shadow-lg bg-gradient-to-r from-purple-200 via-lavender-100 to-rose-100">
          <CardContent className="text-center py-8">
            <XCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <p className="text-lg text-rose-500 mb-4">Quiz attempt not found.</p>
            <Button
              onClick={() => navigate("/quiz-history")}
              variant="outline"
              className="border-violet-400 text-violet-600 hover:bg-violet-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quiz History
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accuracy = Math.round(
    (attempt.score / attempt.total_questions) * 100
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="shadow-lg bg-gradient-to-r from-purple-200 via-lavender-200 to-rose-200 hover:scale-105 transform transition-all duration-300">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-purple-800">
              Quiz Review
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-purple-800">
              Completed on{" "}
              {new Date(attempt.created_at).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Badge
            className={`text-lg px-4 py-2 rounded-full ${
              accuracy >= 80
                ? "bg-purple-600 text-white"
                : "bg-purple-500 text-white"
            }`}
          >
            {accuracy}%
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold text-purple-700">
                {attempt.score} Correct
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-600" />
              <span className="text-lg font-semibold text-rose-700">
                {attempt.total_questions - attempt.score} Incorrect
              </span>
            </div>
            <div className="text-lg font-semibold text-muted-foreground text-purple-600">
              Total: {attempt.total_questions} Questions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {attempt.questions.map((q, index) => (
          <Card
            key={q.id}
            className={`transition-all duration-300 transform hover:scale-105 
          ${            q.is_correct
              ? "border-green-300 bg-green-50"
              : "border-red-300 bg-lavender-200"
          }
        `}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-medium leading-relaxed flex items-center">
                  <span className="text-purple-700 mr-2 font-semibold">
                    Q{index + 1}.
                  </span>
                  <span className="text-purple-700">
                    {q.question_text}
                  </span>
                </CardTitle>
                {q.is_correct ? (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Your answer:
                  </span>
                  <Badge
                    className={
                      q.is_correct
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {q.selected_answer}
                  </Badge>
                </div>
                {!q.is_correct && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Correct answer:
                    </span>
                    <Badge className="bg-purple-200 text-purple-700 border border-green-400">
                      {q.correct_answer}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 pt-6">
        <Button
          onClick={() => navigate("/quiz-history")}
          variant="outline"
          size="lg"
          className="border-purple-500 text-purple-700 hover:bg-purple-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quiz History
        </Button>
        <Button
          onClick={() => navigate("/quiz")}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Take Another Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizReviewPage;
