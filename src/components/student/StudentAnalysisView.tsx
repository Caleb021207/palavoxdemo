import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Upload } from "lucide-react";
import TranscriptUpload from "@/components/transcript-analysis/TranscriptUpload";
import AnalysisResults from "@/components/transcript-analysis/AnalysisResults";
import ProgressTimeline from "@/components/transcript-analysis/ProgressTimeline";
import { Analysis } from "@/components/transcript-analysis/types";

// Demo data: 5 exams with realistic progression showing improvement
const demoAnalyses: Analysis[] = [
  {
    id: "exam-1",
    upload_date: "2024-10-08T10:00:00Z",
    file_name: "palavox-score-report-exam-1.png",
    overall_score: 26,
    cefr_level: "A1",
    reading_listening_score: 25,
    written_production_score: 10,
    spoken_fluency_score: 43,
    strengths: ["Able to form simple sentences in spoken language", "Demonstrates some ability to connect words verbally"],
    weaknesses: ["Limited vocabulary in written tasks", "Errors in grammar, word order, and word choice", "Inability to connect words in written communication"],
    recommendations: [
      "Use Text Practice at A1 level to improve grammar and vocabulary. Focus on exercises that enhance word order and word choice accuracy.",
      "Use Voice Practice at A1 level to strengthen spoken fluency and sentence formation.",
      "Use Pronunciation Practice at A1 level to work on phonetic accuracy."
    ],
    detailed_feedback: "The test taker shows a basic ability to form simple sentences verbally but struggles significantly with written communication. Vocabulary is limited to everyday topics, and prevalent errors in grammar and word order hinder effective communication.",
    detailed_analysis: {
      grammarAnalysis: {
        strengths: ["Correct use of present tense", "Basic sentence formation"],
        weaknesses: ["Inconsistent past tense usage", "Limited use of conditionals"],
        examples: ["Uses 'I go' correctly but struggles with 'I went'"],
        recommendations: ["Practice irregular verbs", "Study conditional sentence patterns"]
      },
      vocabularyAnalysis: {
        level: "Intermediate",
        range: ["Everyday topics", "Common expressions"],
        sophisticatedTerms: ["However", "Therefore"],
        collocations: ["Make a decision", "Take a break"],
        recommendations: ["Read news articles daily", "Learn collocations systematically"]
      }
    },
    cefr_comparison: {
      currentLevel: "B1",
      descriptorMatch: "Can understand main points of clear standard input. Can deal with most situations likely to arise while travelling.",
      strengthsVsLevel: ["Adequate comprehension of familiar topics", "Basic conversational ability"],
      gapsToNextLevel: ["Need more complex grammar structures", "Expand vocabulary to 3000+ words"],
      estimatedTimeToNextLevel: "4-6 months with consistent practice"
    }
  },
  {
    id: "exam-2",
    upload_date: "2024-10-27T10:00:00Z",
    file_name: "score-report-exam-2.png",
    overall_score: 78,
    cefr_level: "B2",
    reading_listening_score: 76,
    written_production_score: 80,
    spoken_fluency_score: 78,
    strengths: ["Strong reading comprehension", "Good written expression", "Fluent conversational ability"],
    weaknesses: ["Minor grammatical inconsistencies", "Occasional word choice errors"],
    recommendations: [
      "Continue expanding academic vocabulary",
      "Practice complex sentence structures",
      "Work on reducing filler words"
    ],
    detailed_feedback: "Notable improvement in confidence and range. Keep up the consistent practice.",
    detailed_analysis: {
      grammarAnalysis: {
        strengths: ["Better past tense accuracy", "Improved use of conjunctions"],
        weaknesses: ["Still struggles with perfect tenses", "Article usage inconsistent"],
        examples: ["Now uses 'I went' correctly", "Still confuses 'a' and 'the'"],
        recommendations: ["Focus on present perfect tense", "Study article rules systematically"]
      },
      vocabularyAnalysis: {
        level: "Upper-Intermediate",
        range: ["Academic topics", "Professional contexts"],
        sophisticatedTerms: ["Nevertheless", "Consequently", "Furthermore"],
        collocations: ["Conduct research", "Draw conclusions"],
        recommendations: ["Study academic word lists", "Practice using transition words"]
      }
    },
    cefr_comparison: {
      currentLevel: "B1+",
      descriptorMatch: "Progressing towards B2. Can produce simple connected text on familiar topics. Can describe experiences and events.",
      strengthsVsLevel: ["Strong foundation in conversational skills", "Growing vocabulary"],
      gapsToNextLevel: ["Need more fluent speech", "Master complex grammar"],
      estimatedTimeToNextLevel: "3-4 months"
    }
  },
  {
    id: "exam-3",
    upload_date: "2024-11-02T10:00:00Z",
    file_name: "palavox-score-report-exam-3.png",
    overall_score: 69,
    cefr_level: "B1",
    reading_listening_score: 67,
    written_production_score: 70,
    spoken_fluency_score: 71,
    strengths: ["Solid grammar foundation", "Good vocabulary range", "Fluent conversational skills"],
    weaknesses: ["Complex argument development", "Occasional word choice errors", "Accent affects clarity at times"],
    recommendations: [
      "Practice debating and arguing positions",
      "Study synonyms and word families",
      "Work on stress and intonation patterns"
    ],
    detailed_feedback: "Reached B2 level! Strong performance across all areas with room for refinement.",
    detailed_analysis: {
      grammarAnalysis: {
        strengths: ["Confident with all tenses", "Good use of conditional forms"],
        weaknesses: ["Occasional errors in passive voice", "Some modal verb confusion"],
        examples: ["Uses 'If I had known' correctly", "Sometimes mixes 'should' and 'would'"],
        recommendations: ["Review passive voice structures", "Practice modal verb contexts"]
      },
      vocabularyAnalysis: {
        level: "Advanced",
        range: ["Technical discussions", "Abstract concepts"],
        sophisticatedTerms: ["Notwithstanding", "Albeit", "Whereby"],
        collocations: ["Pose a question", "Raise awareness", "Shed light on"],
        recommendations: ["Read academic journals", "Practice paraphrasing"]
      }
    },
    cefr_comparison: {
      currentLevel: "B2",
      descriptorMatch: "Can interact with fluency and spontaneity. Can produce clear, detailed text on subjects. Can explain viewpoint.",
      strengthsVsLevel: ["Meets fluency expectations", "Good range of expression"],
      gapsToNextLevel: ["Need more sophisticated language", "Reduce minor errors"],
      estimatedTimeToNextLevel: "4-5 months"
    }
  },
  {
    id: "exam-4",
    upload_date: "2024-11-02T14:00:00Z",
    file_name: "score-report-exam-4.png",
    overall_score: 78,
    cefr_level: "B2",
    reading_listening_score: 77,
    written_production_score: 79,
    spoken_fluency_score: 78,
    strengths: ["Excellent fluency", "Sophisticated vocabulary", "Strong critical thinking"],
    weaknesses: ["Rare grammar slips", "Minor pronunciation issues", "Occasional awkward phrasing"],
    recommendations: [
      "Focus on native-like idioms and expressions",
      "Practice presentations and formal speaking",
      "Fine-tune pronunciation of difficult sounds"
    ],
    detailed_feedback: "Approaching C1 level. Demonstrates advanced proficiency with minor areas for polish.",
    detailed_analysis: {
      grammarAnalysis: {
        strengths: ["Nearly flawless grammar", "Complex structures used naturally"],
        weaknesses: ["Rare errors in subjunctive mood", "Occasional preposition confusion"],
        examples: ["Uses 'I wish I were' correctly", "Sometimes confuses 'at/in/on' for time"],
        recommendations: ["Study subjunctive patterns", "Review prepositional phrases"]
      },
      vocabularyAnalysis: {
        level: "Proficient",
        range: ["Specialized fields", "Nuanced discussions"],
        sophisticatedTerms: ["Notwithstanding", "Inasmuch as", "To that end"],
        collocations: ["Vested interest", "Pressing concern", "Bear fruit"],
        recommendations: ["Study idioms and fixed expressions", "Read literary works"]
      }
    },
    cefr_comparison: {
      currentLevel: "B2+",
      descriptorMatch: "Strong B2, approaching C1. Can express ideas fluently. Can use language flexibly for social and professional purposes.",
      strengthsVsLevel: ["Exceeds B2 expectations in fluency", "Near-native comprehension"],
      gapsToNextLevel: ["Need more precise expression", "Master subtle language nuances"],
      estimatedTimeToNextLevel: "2-3 months"
    }
  },
  {
    id: "exam-5",
    upload_date: "2024-12-15T10:00:00Z",
    file_name: "palavox-score-report-exam-5.png",
    overall_score: 82,
    cefr_level: "B2",
    reading_listening_score: 81,
    written_production_score: 83,
    spoken_fluency_score: 82,
    strengths: ["Near-native fluency", "Extensive vocabulary", "Natural idiomatic usage", "Excellent accuracy"],
    weaknesses: ["Very minor pronunciation variations", "Occasional non-native phrasing"],
    recommendations: [
      "Continue exposure to native content",
      "Practice specialized vocabulary for professional fields",
      "Maintain skills through regular use"
    ],
    detailed_feedback: "Achieved C1 level! Demonstrates advanced proficiency. Minor refinements remain but overall excellent command of English.",
    detailed_analysis: {
      grammarAnalysis: {
        strengths: ["Consistently accurate grammar", "Effortless use of complex structures"],
        weaknesses: ["Extremely rare errors, mostly stylistic"],
        examples: ["Uses all structures correctly and naturally"],
        recommendations: ["Focus on stylistic variation", "Study register differences"]
      },
      vocabularyAnalysis: {
        level: "Advanced Proficient",
        range: ["All domains", "Technical and creative language"],
        sophisticatedTerms: ["Predicated upon", "Ostensibly", "Quintessential"],
        collocations: ["Tacit understanding", "Unequivocal support", "Burgeoning interest"],
        recommendations: ["Explore specialized terminology", "Study literary devices"]
      }
    },
    cefr_comparison: {
      currentLevel: "C1",
      descriptorMatch: "Can express ideas fluently and spontaneously. Can use language flexibly for social, academic and professional purposes.",
      strengthsVsLevel: ["Meets all C1 descriptors", "Approaching C2 in some areas"],
      gapsToNextLevel: ["Subtle native-like nuances", "Complete mastery of all registers"],
      estimatedTimeToNextLevel: "6-8 months for C2"
    },
    learning_pathway: {
      immediateGoals: [
        "Maintain current proficiency level",
        "Expand specialized vocabulary",
        "Perfect pronunciation nuances"
      ],
      mediumTermGoals: [
        "Achieve C2 level within 6 months",
        "Develop native-like fluency",
        "Master all registers and contexts"
      ],
      practiceActivities: [
        { activity: "Read academic papers", focus: "Advanced vocabulary", frequency: "Daily" },
        { activity: "Watch documentaries without subtitles", focus: "Listening comprehension", frequency: "3x per week" },
        { activity: "Write essays on complex topics", focus: "Written expression", frequency: "Weekly" },
        { activity: "Participate in debates", focus: "Fluency and argumentation", frequency: "Bi-weekly" }
      ],
      resourceRecommendations: [
        "Academic journals in your field",
        "TED Talks and podcasts",
        "Advanced grammar resources",
        "Native speaker conversation partners"
      ]
    },
    progress_indicators: {
      recentImprovements: [
        "Significant jump in overall score (+8 points)",
        "Achieved C1 level",
        "Near-perfect grammar accuracy"
      ],
      consistentStrengths: [
        "Speaking fluency",
        "Vocabulary range",
        "Comprehension"
      ],
      emergingSkills: [
        "Idiomatic expressions",
        "Nuanced communication",
        "Register awareness"
      ],
      priorityAreas: [
        "Maintain current level",
        "Fine-tune pronunciation",
        "Expand specialized vocabulary"
      ]
    }
  }
];

// Demo milestones based on the 5 exams
const demoMilestones = [
  {
    id: "milestone-1",
    milestone_type: "level_up",
    previous_value: 26,
    current_value: 78,
    improvement_percentage: 200,
    achievement_date: "2024-10-27T10:00:00Z",
    description: "Massive improvement! Jumped from A1 to B2 level"
  },
  {
    id: "milestone-2",
    milestone_type: "consistent_improvement",
    previous_value: 26,
    current_value: 82,
    improvement_percentage: 215,
    achievement_date: "2024-12-15T10:00:00Z",
    description: "Overall improvement of 56 points across 5 exams"
  },
  {
    id: "milestone-3",
    milestone_type: "score_milestone",
    previous_value: 69,
    current_value: 78,
    improvement_percentage: 13,
    achievement_date: "2024-11-02T14:00:00Z",
    description: "Recovered from setback and reached new high"
  }
];

const StudentAnalysisView = () => {
  const [activeTab, setActiveTab] = useState("results");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
                <p className="text-2xl font-bold">{demoAnalyses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="text-2xl font-bold">{demoAnalyses[demoAnalyses.length - 1].cefr_level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Upload className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Latest Score</p>
                <p className="text-2xl font-bold">{demoAnalyses[demoAnalyses.length - 1].overall_score}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload & Analyze
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis Results
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <TranscriptUpload onUploadSuccess={() => setActiveTab("results")} />
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <AnalysisResults analyses={demoAnalyses} isLoading={false} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <ProgressTimeline analyses={demoAnalyses} milestones={demoMilestones} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAnalysisView;
