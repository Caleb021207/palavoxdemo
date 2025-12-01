// Demo stub - not used in carousel demo
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ClassMetrics = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate("/profile")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Profile
      </Button>
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Class Metrics</h1>
        <p className="text-muted-foreground">This feature is not available in demo mode.</p>
      </div>
    </div>
  );
};

export default ClassMetrics;
