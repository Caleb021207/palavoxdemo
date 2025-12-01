// Demo stub - not used in carousel demo
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Certificate = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate('/analysis')}
        className="gap-2 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Analysis
      </Button>
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Certificate</h1>
        <p className="text-muted-foreground">This feature is not available in demo mode.</p>
      </div>
    </div>
  );
};

export default Certificate;
