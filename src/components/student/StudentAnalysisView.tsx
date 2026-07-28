import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Upload } from "lucide-react";
import TranscriptUpload from "@/components/transcript-analysis/TranscriptUpload";
import AnalysisResults from "@/components/transcript-analysis/AnalysisResults";
import ProgressTimeline from "@/components/transcript-analysis/ProgressTimeline";
import { Analysis } from "@/components/transcript-analysis/types";

// Demo data: 4 sample assessments for one student across the 2025-2026 school year
const demoAnalyses: Analysis[] = [
  {
    id: "exam-1",
    upload_date: "2025-09-12T10:00:00Z",
    file_name: "Emma Rodriguez — Fall Placement Assessment",
    overall_score: 26,
    cefr_level: "A1",
    reading_listening_score: 25,
    written_production_score: 10,
    spoken_fluency_score: 43,
    strengths: [
      "Recognizes common greetings and everyday classroom phrases",
      "Can introduce herself with short memorized sentences",
      "Understands simple questions when spoken slowly and clearly"
    ],
    weaknesses: [
      "Very limited vocabulary outside of a few familiar topics",
      "Written responses are incomplete and often single words",
      "Frequent basic grammar errors with verb forms and word order",
      "Struggles to follow speech at natural speed"
    ],
    recommendations: [
      "Use Text Practice at A1 level to build core vocabulary and simple present-tense sentences about daily routines.",
      "Use Voice Practice at A1 level to rehearse short introductions, greetings, and yes/no exchanges.",
      "Use Pronunciation Practice at A1 level to work on individual sounds and clear word-level articulation."
    ],
    detailed_feedback: "At this stage the student communicates with isolated words and memorized phrases on very familiar topics. Comprehension depends on slow, clear speech and repetition, and written production is still fragmentary. The priority is building a base of high-frequency vocabulary and simple sentence patterns."
  },
  {
    id: "exam-2",
    upload_date: "2025-11-14T10:00:00Z",
    file_name: "Emma Rodriguez — Fall Progress Check",
    overall_score: 52,
    cefr_level: "A2",
    reading_listening_score: 54,
    written_production_score: 48,
    spoken_fluency_score: 55,
    strengths: [
      "Handles routine exchanges about school, family, and free time",
      "Produces short connected sentences using present and simple past",
      "Understands the main point of short, clearly spoken messages"
    ],
    weaknesses: [
      "Runs out of vocabulary when topics move beyond daily life",
      "Errors with past tenses and prepositions interrupt meaning",
      "Speech is still hesitant with frequent pauses"
    ],
    recommendations: [
      "Use Text Practice at A2 level to consolidate past tenses and connectors like 'because', 'but', and 'then'.",
      "Use Voice Practice at A2 level to practice short role-plays such as ordering food or asking for directions.",
      "Use Pronunciation Practice at A2 level to work on word stress and sentence rhythm in short phrases."
    ],
    detailed_feedback: "Clear progress from the placement assessment. The student now manages simple, routine tasks and can describe familiar people and situations in a few linked sentences. Accuracy and fluency still break down under time pressure or when the topic is unfamiliar."
  },
  {
    id: "exam-3",
    upload_date: "2026-02-06T10:00:00Z",
    file_name: "Emma Rodriguez — Winter Progress Check",
    overall_score: 69,
    cefr_level: "B1",
    reading_listening_score: 68,
    written_production_score: 69,
    spoken_fluency_score: 70,
    strengths: [
      "Understands the main points of clear standard speech on familiar matters",
      "Writes simple connected text about experiences and plans",
      "Can explain opinions and give short reasons"
    ],
    weaknesses: [
      "Inconsistent accuracy in complex structures such as conditionals",
      "Vocabulary is thin outside of familiar and school-related topics",
      "Difficulty expressing abstract ideas without circumlocution"
    ],
    recommendations: [
      "Use Text Practice at B1 level to solidify conditionals, relative clauses, and topic-specific vocabulary.",
      "Use Voice Practice at B1 level to describe experiences and plans spontaneously and extend answers.",
      "Use Pronunciation Practice at B1 level to reduce first-language interference and improve sentence-level intonation."
    ],
    detailed_feedback: "The student has reached an independent-user threshold. She can deal with most situations likely to arise while travelling or in class, and can produce straightforward connected text on familiar subjects. Growth areas are grammatical consistency and vocabulary range for abstract topics."
  },
  {
    id: "exam-4",
    upload_date: "2026-05-15T10:00:00Z",
    file_name: "Emma Rodriguez — Spring Final Assessment",
    overall_score: 78,
    cefr_level: "B2",
    reading_listening_score: 77,
    written_production_score: 78,
    spoken_fluency_score: 79,
    strengths: [
      "Comprehends complex texts and discussions on both concrete and abstract topics",
      "Uses varied vocabulary appropriately across different contexts",
      "Speaks with enough fluency and coherence for sustained interaction",
      "Can present a clear, developed argument with supporting detail"
    ],
    weaknesses: [
      "Occasional errors in advanced grammatical structures",
      "Formal register and stylistic choices could be more consistent",
      "Some imprecision with specialized or academic vocabulary"
    ],
    recommendations: [
      "Use Text Practice at B2 level to master complex structures and formal writing such as reports and essays.",
      "Use Voice Practice at B2 level to debate abstract topics and express nuanced opinions confidently.",
      "Use Pronunciation Practice at B2 level to refine intonation, stress, and natural connected speech."
    ],
    detailed_feedback: "Strong end-of-year result. The student interacts with a degree of fluency and spontaneity that makes regular interaction with proficient speakers comfortable, and writes clear, detailed text on a range of subjects. Remaining work is refinement of register and precision rather than basic control."
  }
];

// Demo milestones based on the 4 assessments
const demoMilestones = [
  {
    id: "milestone-1",
    milestone_type: "level_up",
    previous_value: 26,
    current_value: 52,
    improvement_percentage: 100,
    achievement_date: "2025-11-14T10:00:00Z",
    description: "Moved from A1 to A2 during the fall term"
  },
  {
    id: "milestone-2",
    milestone_type: "level_up",
    previous_value: 52,
    current_value: 69,
    improvement_percentage: 33,
    achievement_date: "2026-02-06T10:00:00Z",
    description: "Reached B1 — independent user threshold"
  },
  {
    id: "milestone-3",
    milestone_type: "consistent_improvement",
    previous_value: 26,
    current_value: 78,
    improvement_percentage: 200,
    achievement_date: "2026-05-15T10:00:00Z",
    description: "Overall improvement of 52 points across four assessments, finishing at B2"
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
