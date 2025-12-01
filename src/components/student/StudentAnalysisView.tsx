import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Upload } from "lucide-react";
import TranscriptUpload from "@/components/transcript-analysis/TranscriptUpload";
import AnalysisResults from "@/components/transcript-analysis/AnalysisResults";
import ProgressTimeline from "@/components/transcript-analysis/ProgressTimeline";
import { Analysis } from "@/components/transcript-analysis/types";

// Demo data: 4 exams matching the example
const demoAnalyses: Analysis[] = [
  {
    id: "exam-1",
    upload_date: "2024-10-08T10:00:00Z",
    file_name: "palavox-score-report-806f620d-d3fb-42d1-a89c-d9c91ff45814 (4).png",
    overall_score: 26,
    cefr_level: "A1",
    reading_listening_score: 25,
    written_production_score: 10,
    spoken_fluency_score: 43,
    strengths: ["Able to form simple sentences in spoken language", "Demonstrates some ability to connect words verbally"],
    weaknesses: ["Limited vocabulary in written tasks", "Errors in grammar, word order, and word choice", "Inability to connect words in written communication"],
    recommendations: [
      "Use Text Practice at A1 level to improve grammar and vocabulary. Focus on exercises that enhance word order and word choice accuracy. This will help build a foundation for better written communication.",
      "Use Voice Practice at A1 level to strengthen spoken fluency and sentence formation. Engage in short conversations to practice connecting words and forming simple sentences naturally.",
      "Use Pronunciation Practice at A1 level to work on phonetic accuracy. Focus on repeating high-frequency words to improve clarity and reduce pronunciation errors."
    ],
    detailed_feedback: "The test taker shows a basic ability to form simple sentences verbally but struggles significantly with written communication. Vocabulary is limited to everyday topics, and prevalent errors in grammar and word order hinder effective communication."
  },
  {
    id: "exam-2",
    upload_date: "2024-10-27T10:00:00Z",
    file_name: "score-report-Test-Student-2025-10-07 (1).png",
    overall_score: 78,
    cefr_level: "B2",
    reading_listening_score: 76,
    written_production_score: 79,
    spoken_fluency_score: 79,
    strengths: ["Strong reading comprehension", "Good written expression", "Fluent conversational ability"],
    weaknesses: ["Minor grammatical inconsistencies", "Occasional word choice errors"],
    recommendations: [
      "Continue expanding academic vocabulary",
      "Practice complex sentence structures",
      "Work on reducing filler words"
    ],
    detailed_feedback: "Excellent progress! Reached B2 level with strong performance across all skills."
  },
  {
    id: "exam-3",
    upload_date: "2024-11-02T10:00:00Z",
    file_name: "palavox-score-report-d95102ec-f071-41b7-a690-202f1555b04c.png",
    overall_score: 69,
    cefr_level: "B1",
    reading_listening_score: 68,
    written_production_score: 69,
    spoken_fluency_score: 70,
    strengths: ["Solid grammar foundation", "Good vocabulary range"],
    weaknesses: ["Some inconsistencies under pressure", "Occasional word choice errors"],
    recommendations: [
      "Practice under timed conditions",
      "Review grammar fundamentals",
      "Build confidence through regular practice"
    ],
    detailed_feedback: "Slight dip in performance but core skills remain strong. Focus on consistency."
  },
  {
    id: "exam-4",
    upload_date: "2024-11-02T14:00:00Z",
    file_name: "score-report-Test-Student-2025-10-07 (1).png",
    overall_score: 78,
    cefr_level: "B2",
    reading_listening_score: 77,
    written_production_score: 78,
    spoken_fluency_score: 79,
    strengths: ["Excellent fluency", "Strong vocabulary", "Confident communication"],
    weaknesses: ["Minor grammatical errors", "Occasional pronunciation issues"],
    recommendations: [
      "Continue regular practice",
      "Focus on advanced grammar structures",
      "Practice formal speaking"
    ],
    detailed_feedback: "Returned to B2 level! Consistent strong performance across all skills."
  }
];

// Demo milestones based on the 4 exams
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
    current_value: 78,
    improvement_percentage: 200,
    achievement_date: "2024-11-02T14:00:00Z",
    description: "Overall improvement of 52 points across 4 exams"
  },
  {
    id: "milestone-3",
    milestone_type: "score_milestone",
    previous_value: 69,
    current_value: 78,
    improvement_percentage: 13,
    achievement_date: "2024-11-02T14:00:00Z",
    description: "Recovered from setback and reached B2 again"
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
