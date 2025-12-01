
import React from "react";
import { MessageCircle } from "lucide-react";

const EmptyChatState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-foreground">
      <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mb-4">
        <MessageCircle className="h-12 w-12 text-primary" />
      </div>
      <p className="mb-2 text-lg font-medium">Start practicing English!</p>
      <p className="text-sm text-center text-muted-foreground max-w-md">
        Type your first message below to begin a conversation with your AI tutor
      </p>
    </div>
  );
};

export default EmptyChatState;
