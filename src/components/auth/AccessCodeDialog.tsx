import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CORRECT_CODE = "PALAVOX2024"; // Change this to your desired access code

export const AccessCodeDialog = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already entered the code
    const hasAccess = localStorage.getItem("palavox_access");
    if (!hasAccess) {
      setOpen(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate checking (you could also call an API here)
    setTimeout(() => {
      if (code.toUpperCase() === CORRECT_CODE) {
        localStorage.setItem("palavox_access", "true");
        setOpen(false);
        toast({
          title: "Access Granted",
          description: "Welcome to Palavox Demo!",
        });
      } else {
        toast({
          title: "Invalid Code",
          description: "Please enter the correct access code",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl backdrop-blur-sm border border-primary/20">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Palavox Demo Access
            </span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter the access code to use the Palavox demo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter access code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-lg tracking-wider uppercase"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || code.length === 0}
          >
            {isLoading ? "Verifying..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
