// Demo stub - not used in carousel demo
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const LessonPlayer = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => navigate('/learn')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Lesson Player</h2>
        <p className="text-muted-foreground">This feature is not available in demo mode.</p>
      </Card>
    </div>
  );
};

export default LessonPlayer;
