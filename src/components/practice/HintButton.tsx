
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { HelpCircle, Volume2, Lightbulb } from "lucide-react";
import { useLocalization } from "@/context/LocalizationContext";
import type { Message } from "@/types/chat";
import { Separator } from "@/components/ui/separator";

interface HintButtonProps {
  targetLanguage: string;
  messages: Message[];
  className?: string;
}

export default function HintButton({ targetLanguage, messages, className }: HintButtonProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLocalization();
  
  // Demo example suggestions to show as static content
  const demoSuggestions = [
    {
      title: "Greetings and Responses",
      suggestions: [
        { phrase: "¡Hola! Estoy bien, gracias. ¿Y tú?", translation: "Hi! I'm good, thank you. And you?" },
        { phrase: "¡Hola! Todo bien por aquí, ¿y tú?", translation: "Hi! All good here, how about you?" },
        { phrase: "¡Hola! Me alegra verte. ¿Cómo has estado?", translation: "Hi! Glad to see you. How have you been?" }
      ]
    },
    {
      title: "Asking about the Other Person",
      suggestions: [
        { phrase: "¿Qué tal tu día?", translation: "How is your day going?" },
        { phrase: "¿Has hecho algo interesante últimamente?", translation: "Have you done anything interesting lately?" },
        { phrase: "¿Cómo va tu trabajo/estudio?", translation: "How is your work/studies going?" }
      ]
    },
    {
      title: "Continuing the Conversation",
      suggestions: [
        { phrase: "¿Te gustaría hacer algo este fin de semana?", translation: "Would you like to do something this weekend?" },
        { phrase: "¿Qué opinas sobre la situación actual?", translation: "What do you think about the current situation?" },
        { phrase: "Me gustaría saber más sobre ti.", translation: "I would like to know more about you." }
      ]
    }
  ];
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`px-6 py-6 text-lg ${className}`}
          size="lg"
        >
          <HelpCircle className="h-6 w-6 mr-3" />
          {t("getResponseSuggestions")}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0" 
        align="end" 
        alignOffset={-40}
        sideOffset={8}
      >
        {/* Feature Description Header */}
        <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-base">Response Suggestions</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            When students stall out in a conversation, they can click here to receive contextual response suggestions with translations in their native language.
          </p>
        </div>
        
        
        {/* Demo suggestions display */}
        <div className="p-2 max-h-[350px] overflow-y-auto">
          {demoSuggestions.map((category, idx) => (
            <div key={idx} className="mb-4">
              <h5 className="text-xs font-medium text-primary px-2 mb-2 uppercase tracking-wide">
                {category.title}
              </h5>
              <div className="space-y-1">
                {category.suggestions.map((suggestion, i) => (
                  <div 
                    key={i}
                    className="p-2.5 text-sm rounded-md bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="font-medium text-foreground">{suggestion.phrase}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 italic">{suggestion.translation}</div>
                  </div>
                ))}
              </div>
              {idx < demoSuggestions.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </div>
        
        {/* Footer note */}
        <div className="p-3 bg-muted/20 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Suggestions are AI-generated based on conversation context
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
