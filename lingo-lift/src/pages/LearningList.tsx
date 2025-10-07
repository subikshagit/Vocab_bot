import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { authRequest } from "@/contexts/authcontext";


const LearningListPage = () => {
  const [learningList, setLearningList] = useState([]);
  const [error, setError] = useState("");
  const API_URL =  import.meta.env.VITE_BACKEND_API_URL;


  useEffect(() => {
    const fetchLearningList = async () => {
      try {
        const response = await authRequest(`${API_URL}/api/learning-list/view/`, {
          method: "GET",
        });
        const data = await response.json();
        setLearningList(data);
        console.log("Learning list from backend:", data);
        if (!response.ok) {
          setError(data.error || "Failed to fetch learning list");
          return;
        }

        setLearningList(data);
      } catch (err: any) {
        setError(err.message || "Network error, please try again!");
      }
    };

    fetchLearningList();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-accent" />
            My Learning List
          </CardTitle>
        </CardHeader>
      </Card>

      {error && <p className="text-red-500">{error}</p>}

      {learningList.length === 0 ? (
        <p className="text-muted-foreground">No words in your learning list yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningList.map((item: any) => (
            <Card key={item.id} className="shadow-card hover:shadow-lg transition rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  {item.word.text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <span className="font-semibold">Meaning:</span> {item.word.meaning}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Example:</span> {item.word.example}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningListPage;
