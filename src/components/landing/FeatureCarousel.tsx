import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Mic, 
  Volume2,
  Sparkles,
  Brain,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/context/LocalizationContext';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  gradient: string;
}

const FeatureCarousel = () => {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const CARD_WIDTH = 400; // Actual card width
  const GAP = 48; // gap-12 = 3rem = 48px
  const CARD_TOTAL_WIDTH = CARD_WIDTH + GAP; // Total space per card

  const features: Feature[] = [
    {
      id: 'practice',
      title: 'Text Practice',
      description: 'Students practice English reading and writing through AI-powered text conversations with instant feedback',
      icon: MessageSquare,
      route: '/practice',
      gradient: 'from-primary to-palavox-teal'
    },
    {
      id: 'unlimited-voice',
      title: 'Unlimited Voice Practice',
      description: 'Students engage in natural English voice conversations for immersive speaking and listening practice',
      icon: Mic,
      route: '/voice-chat',
      gradient: 'from-palavox-teal to-accent'
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation Practice',
      description: 'Students perfect their English pronunciation with AI-powered speech analysis and real-time feedback',
      icon: Volume2,
      route: '/pronunciation-practice',
      gradient: 'from-accent to-primary'
    },
    {
      id: 'advanced-conversation',
      title: 'Advanced Conversation',
      description: 'Students practice sophisticated English dialogues with Palavox Advanced AI for fluency development',
      icon: Sparkles,
      route: '/premium-voice-practice',
      gradient: 'from-primary to-accent'
    },
    {
      id: 'testing-progress',
      title: 'Testing & Progress',
      description: 'Students track their English learning journey with AI-powered assessments and detailed progress analytics',
      icon: Brain,
      route: '/analysis',
      gradient: 'from-palavox-teal to-primary'
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Students view their English learning achievements, earned certificates, and performance statistics',
      icon: User,
      route: '/profile',
      gradient: 'from-accent to-palavox-teal'
    }
  ];

  const paginate = (newDirection: number) => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = features.length - 1;
      if (newIndex >= features.length) newIndex = 0;
      return newIndex;
    });
  };

  // Auto-advance every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, hsl(var(--accent)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px, 40px 40px'
        }}
      />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
        className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" as const, delay: 2 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" as const, delay: 4 }}
        className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-palavox-teal/15 rounded-full blur-3xl"
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" as const }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-palavox-teal to-accent bg-clip-text text-transparent mb-4">
          Palavox Demo
        </h1>
        <p className="text-xl text-muted-foreground">
          Explore our language learning platform features
        </p>
      </motion.div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center overflow-hidden">
        {/* Sliding Track */}
        <motion.div
          className="flex gap-12 absolute"
          animate={{
            x: `calc(50% - ${CARD_WIDTH / 2}px - ${currentIndex * CARD_TOTAL_WIDTH}px)`
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.8
          }}
          style={{
            willChange: 'transform'
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const distanceFromCenter = Math.abs(index - currentIndex);
            const isCenter = index === currentIndex;
            const isAdjacent = distanceFromCenter === 1;
            
            // Visual hierarchy based on distance from center
            const scale = isCenter ? 1.1 : isAdjacent ? 0.9 : 0.75;
            const opacity = isCenter ? 1 : isAdjacent ? 0.6 : 0.3;
            const blur = isCenter ? 0 : isAdjacent ? 1 : 2;
            
            return (
              <motion.div
                key={feature.id}
                className="flex-shrink-0 w-[400px] cursor-pointer"
                onClick={() => navigate(feature.route)}
                animate={{
                  scale,
                  opacity,
                  filter: `blur(${blur}px)`
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                style={{
                  zIndex: isCenter ? 10 : 5 - distanceFromCenter
                }}
              >
                <motion.div 
                  className="bg-card border border-border rounded-3xl p-8 shadow-2xl"
                  animate={{
                    boxShadow: isCenter 
                      ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                      : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 mx-auto`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-center mb-6">
                    {feature.description}
                  </p>

                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="flex justify-center"
                    >
                      <Button
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(feature.route);
                        }}
                      >
                        Explore Feature
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 z-20 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 z-20 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex gap-2 mt-12 relative z-10">
        {features.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? 'bg-primary w-12' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-3'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureCarousel;
