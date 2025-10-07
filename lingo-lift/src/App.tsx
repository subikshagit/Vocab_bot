import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/ui/navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LearningList from "./pages/LearningList";
import ReviewWords from "./pages/review-words";
import QuizHistory from "./pages/QuizHistory";
import QuizReviewPage from "./pages/quiz_review";
import BotPage from "./pages/BotPage";
import ProtectedRoute from "./components/ProtectRoute";
import FrontPage from "./pages/FrontPage";


const queryClient = new QueryClient();

const App = () => ( 
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vocablearn-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/learning-list" element={<LearningList />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/review-words" element={<ReviewWords />} />
            <Route path="/quiz-history" element={<QuizHistory />} />
            <Route path="/quiz-review/:id" element={<QuizReviewPage />} />
            <Route path="/bot" element={<BotPage />} />
            <Route path="*" element={<NotFound />} />
            <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
          </Routes>
        </div>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
