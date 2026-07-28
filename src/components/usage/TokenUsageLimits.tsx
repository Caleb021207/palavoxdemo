import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Infinity, Sparkles, Heart } from "lucide-react";

export const TokenUsageLimits = () => {
  return (
    <Card className="glass border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Infinity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Demo Mode
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Unlimited
                </Badge>
              </CardTitle>
              <CardDescription>No usage limits during demo</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm text-foreground font-medium">
                There are no usage limits for the demo version of our platform.
              </p>
              <p className="text-sm text-muted-foreground">
                We kindly ask that you use the AI models responsibly and only to learn about the platform's capabilities. 
                This helps us provide the best experience for all demo users.
              </p>

            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
