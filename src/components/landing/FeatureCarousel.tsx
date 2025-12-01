import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Mic, 
  TrendingUp, 
  Award, 
  Users, 
  BarChart3,
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
  const [direction, setDirection] = useState(0);

  const features: Feature[] = [
    {
      id: 'text-practice',
      title: 'Text Practice',
      description: 'Practice reading and writing with AI-powered conversations',
      icon: MessageSquare,
      route: '/practice',
      gradient: 'from-primary to-palavox-teal'
    },
    {
      id: 'voice-practice',
      title: 'Advanced Voice',
      description: 'Natural voice conversations with Palavox Advanced Voice',
      icon: Mic,
      route: '/premium-voice',
      gradient: 'from-palavox-teal to-accent'
    },
    {
      id: 'teacher-dashboard',
      title: 'Teacher Dashboard',
      description: 'Monitor student progress and classroom metrics',
      icon: Users,
      route: '/teacher-classes',
      gradient: 'from-accent to-primary'
    },
    {
      id: 'progress',
      title: 'Progress Tracking',
      description: 'Track your language learning journey with detailed analytics',
      icon: TrendingUp,
      route: '/progress',
      gradient: 'from-primary to-accent'
    },
    {
      id: 'certificates',
      title: 'Certificates',
      description: 'Earn certificates to validate your language proficiency',
      icon: Award,
      route: '/certificates',
      gradient: 'from-palavox-teal to-primary'
    },
    {
      id: 'analytics',
      title: 'Transcript Analysis',
      description: 'AI-powered analysis of your speaking and writing',
      icon: BarChart3,
      route: '/transcript-analysis',
      gradient: 'from-accent to-palavox-teal'
    }
  ];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = features.length - 1;
      if (newIndex >= features.length) newIndex = 0;
      return newIndex;
    });
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45
    })
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = -1; i <= 1; i++) {
      let index = currentIndex + i;
      if (index < 0) index = features.length + index;
      if (index >= features.length) index = index - features.length;
      cards.push({ feature: features[index], offset: i });
    }
    return cards;
  };

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
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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
      <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center perspective-1000">
        <AnimatePresence initial={false} custom={direction}>
          {getVisibleCards().map(({ feature, offset }) => {
            const isCenter = offset === 0;
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={feature.id}
                custom={direction}
                variants={isCenter ? variants : undefined}
                initial={isCenter ? "enter" : undefined}
                animate="center"
                exit={isCenter ? "exit" : undefined}
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.6 }
                }}
                style={{
                  position: 'absolute',
                  x: offset * 400,
                  scale: isCenter ? 1 : 0.7,
                  opacity: isCenter ? 1 : 0.3,
                  zIndex: isCenter ? 10 : 5 - Math.abs(offset),
                  filter: isCenter ? 'none' : 'blur(2px)'
                }}
                className={`w-[400px] cursor-pointer ${isCenter ? '' : 'pointer-events-none'}`}
                onClick={() => isCenter && navigate(feature.route)}
              >
                <div className={`bg-card border border-border rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all ${isCenter ? 'hover:scale-105' : ''}`}>
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
                      transition={{ delay: 0.2 }}
                      className="flex justify-center"
                    >
                      <Button
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                        onClick={() => navigate(feature.route)}
                      >
                        Explore Feature
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

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
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary w-8' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
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
