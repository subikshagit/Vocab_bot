import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, ArrowRight, CheckCircle, XCircle, Link } from "lucide-react";
import { authRequest } from "@/contexts/authcontext";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [questions, setQuestions] = useState<any[]>([]); // store API response directly
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

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
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authRequest("http://localhost:8000/api/quiz-questions/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        // If authRequest already returns JSON → no need response.json()
        const data = Array.isArray(response) ? response : await response.json();

        console.log("Quiz questions from backend:", data);
        setQuestions(data);
      } catch (err: any) {
        console.error("Failed to fetch quiz:", err);
        setError(err?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const saveAttempt = async () => {
    try {
      const payload = {
        score: score,
        total_questions: questions.length,
        questions: questions.map((q) => ({
          question_text: q.question,                     // use actual key from API
          selected_answer: q.options[q.selectedAnswer],  // convert index → text
          correct_answer: q.options[q.correctAnswer],    // convert index → text
          is_correct: q.selectedAnswer === q.correctAnswer,
        })),

      };

      const response = await authRequest("http://localhost:8000/api/save-quiz-attempt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to save quiz attempt");
      }

      const data = await response.json();
      console.log("Quiz attempt saved!", data);

      // ✅ Navigate to review page
      navigate(`/quiz-review/${data.attempt_id}`);
    } catch (error: any) {
      console.error("Error saving attempt:", error.message || error);
    }
  };


  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    setQuestions((prev) =>
      prev.map((q, i) =>
        i === currentQuestion ? { ...q, selectedAnswer: answerIndex } : q
      )
    );

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore((s) => s + 1);
    }
  };


  const goToDashboard = () => {
    navigate("/dashboard"); // change "/dashboard" if your route is different
  };
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
      saveAttempt(); // Save attempt when quiz is complete
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizComplete(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading quiz...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;
  if (!questions.length) return <div className="min-h-screen flex items-center justify-center">No questions available</div>;

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (quizComplete) {
    saveAttempt();
    return (
      <div className="min-h-screen flex items-center justify-center px-4">

        <Card className="w-full max-w-md shadow-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="gradient-accent p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <Trophy className="h-10 w-10 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-muted-foreground">Great job on finishing the quiz</p>
              </div>
              <div className="bg-accent-light rounded-lg p-4">
                <p className="text-lg font-semibold">
                  Your Score: {score} out of {questions.length}
                </p>
                <p className="text-muted-foreground">
                  {Math.round((score / questions.length) * 100)}% Accuracy
                </p>
              </div>
              <div className="space-y-3">
                <Button onClick={resetQuiz} className="w-full">
                  Take Quiz Again
                </Button>

                <Button onClick={goToDashboard} variant="outline" className="w-full">
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Vocabulary Quiz</h1>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">{question.word}</div>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options.map((option: string, index: number) => {
                let buttonVariant: "outline" | "destructive" | "default" = "outline";
                let IconComponent: any = null;

                if (isAnswered) {
                  if (index === question.correctAnswer) {
                    buttonVariant = "default";
                    IconComponent = CheckCircle;
                  } else if (index === selectedAnswer && index !== question.correctAnswer) {
                    buttonVariant = "destructive";
                    IconComponent = XCircle;
                  }
                }

                return (
                  <Button
                    key={index}
                    variant={buttonVariant}
                    className={`w-full justify-start text-left h-auto p-4 ${selectedAnswer === index && !isAnswered ? "ring-2 ring-primary" : ""}`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option}</span>
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                    </div>
                  </Button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {selectedAnswer === question.correctAnswer ? (
                      <span className="text-accent font-medium">Correct! Well done!</span>
                    ) : (
                      <span className="text-destructive font-medium">
                        Incorrect. The answer is "{question.options[question.correctAnswer]}"
                      </span>
                    )}
                  </div>
                  <Button onClick={handleNextQuestion}>
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      "Finish Quiz"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
