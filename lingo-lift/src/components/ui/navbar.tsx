import { Link, useLocation } from "react-router-dom";
import { Button } from "./button";
import { ThemeToggle } from "./theme-toggle";
import { BookOpen, Home, Trophy, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  // Check login state (you can later move this to a context)
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  // Function to check if the current path is active
  const isActive = (path: string) => location.pathname === path;
  
  // Hide navbar on auth pages or if not logged in
  if (
    !isLoggedIn ||
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                VocabLearn
              </span>
            </Link>
          </div>

          {/* Menu Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="sm"
                className="hidden sm:flex"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            <Link to="/quiz">
              <Button
                variant={isActive("/quiz") ? "default" : "ghost"}
                size="sm"
                className="hidden sm:flex"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Quiz
              </Button>
            </Link>

            <Link to="/profile">
              <Button
                variant={isActive("/profile") ? "default" : "ghost"}
                size="sm"
                className="hidden sm:flex"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>

            {/* Mobile menu */}
            <div className="flex sm:hidden space-x-2">
              <Link to="/dashboard">
                <Button variant={isActive("/dashboard") ? "default" : "ghost"} size="icon">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/quiz">
                <Button variant={isActive("/quiz") ? "default" : "ghost"} size="icon">
                  <Trophy className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant={isActive("/profile") ? "default" : "ghost"} size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
