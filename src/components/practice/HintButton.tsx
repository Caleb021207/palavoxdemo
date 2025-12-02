
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
  
  // Demo example suggestions to show as static content (English above, Spanish below)
  const demoSuggestions = [
    {
      title: "Greetings and Responses",
      suggestions: [
        { english: "Hi! I'm good, thank you. And you?", spanish: "¡Hola! Estoy bien, gracias. ¿Y tú?" },
        { english: "Hi! All good here, how about you?", spanish: "¡Hola! Todo bien por aquí, ¿y tú?" },
        { english: "Hi! Glad to see you. How have you been?", spanish: "¡Hola! Me alegra verte. ¿Cómo has estado?" }
      ]
    },
    {
      title: "Asking about the Other Person",
      suggestions: [
        { english: "How is your day going?", spanish: "¿Qué tal tu día?" },
        { english: "Have you done anything interesting lately?", spanish: "¿Has hecho algo interesante últimamente?" },
        { english: "How is your work/studies going?", spanish: "¿Cómo va tu trabajo/estudio?" }
      ]
    },
    {
      title: "Continuing the Conversation",
      suggestions: [
        { english: "Would you like to do something this weekend?", spanish: "¿Te gustaría hacer algo este fin de semana?" },
        { english: "What do you think about the current situation?", spanish: "¿Qué opinas sobre la situación actual?" },
        { english: "I would like to know more about you.", spanish: "Me gustaría saber más sobre ti." }
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
                    <div className="font-medium text-foreground">{suggestion.english}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 italic">{suggestion.spanish}</div>
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
