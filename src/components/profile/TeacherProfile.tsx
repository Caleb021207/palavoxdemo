import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Award, BookOpen, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Student {
  id: string;
  name: string;
  level: number;
  xp: number;
  totalXP: number;
  nextLevelXP: number;
  progressPercentage: number;
  streak: number;
  lessonsCompleted: number;
}

interface TeacherProfileProps {
  profile: any;
}

// Demo classroom data - 24 students at various levels
const demoStudents: Student[] = [
  { id: '1', name: 'Emma Rodriguez', level: 12, xp: 1450, totalXP: 15750, nextLevelXP: 2000, progressPercentage: 73, streak: 23, lessonsCompleted: 89 },
  { id: '2', name: 'Marcus Chen', level: 10, xp: 890, totalXP: 12340, nextLevelXP: 1800, progressPercentage: 49, streak: 15, lessonsCompleted: 67 },
  { id: '3', name: 'Sofia Martinez', level: 15, xp: 1820, totalXP: 21450, nextLevelXP: 2400, progressPercentage: 76, streak: 31, lessonsCompleted: 112 },
  { id: '4', name: 'Jamal Washington', level: 8, xp: 560, totalXP: 9240, nextLevelXP: 1500, progressPercentage: 37, streak: 12, lessonsCompleted: 54 },
  { id: '5', name: 'Aisha Patel', level: 11, xp: 1200, totalXP: 13890, nextLevelXP: 1900, progressPercentage: 63, streak: 19, lessonsCompleted: 78 },
  { id: '6', name: 'Carlos Hernandez', level: 9, xp: 720, totalXP: 10560, nextLevelXP: 1650, progressPercentage: 44, streak: 8, lessonsCompleted: 61 },
  { id: '7', name: 'Yuki Tanaka', level: 13, xp: 1600, totalXP: 17890, nextLevelXP: 2100, progressPercentage: 76, streak: 27, lessonsCompleted: 95 },
  { id: '8', name: 'Isabella Garcia', level: 7, xp: 430, totalXP: 7890, nextLevelXP: 1400, progressPercentage: 31, streak: 5, lessonsCompleted: 47 },
  { id: '9', name: 'Ahmed Hassan', level: 14, xp: 1750, totalXP: 19650, nextLevelXP: 2250, progressPercentage: 78, streak: 29, lessonsCompleted: 103 },
  { id: '10', name: 'Lily Nguyen', level: 10, xp: 950, totalXP: 12450, nextLevelXP: 1800, progressPercentage: 53, streak: 16, lessonsCompleted: 69 },
  { id: '11', name: 'Diego Santos', level: 6, xp: 340, totalXP: 6120, nextLevelXP: 1300, progressPercentage: 26, streak: 4, lessonsCompleted: 38 },
  { id: '12', name: 'Priya Kumar', level: 12, xp: 1380, totalXP: 15450, nextLevelXP: 2000, progressPercentage: 69, streak: 21, lessonsCompleted: 86 },
  { id: '13', name: 'Omar Abdullah', level: 9, xp: 680, totalXP: 10340, nextLevelXP: 1650, progressPercentage: 41, streak: 10, lessonsCompleted: 58 },
  { id: '14', name: 'Zoe Williams', level: 11, xp: 1150, totalXP: 13720, nextLevelXP: 1900, progressPercentage: 61, streak: 18, lessonsCompleted: 75 },
  { id: '15', name: 'Rafael Silva', level: 8, xp: 590, totalXP: 9450, nextLevelXP: 1500, progressPercentage: 39, streak: 11, lessonsCompleted: 56 },
  { id: '16', name: 'Mei Lin', level: 13, xp: 1550, totalXP: 17560, nextLevelXP: 2100, progressPercentage: 74, streak: 25, lessonsCompleted: 92 },
  { id: '17', name: 'David Kim', level: 7, xp: 480, totalXP: 8120, nextLevelXP: 1400, progressPercentage: 34, streak: 7, lessonsCompleted: 49 },
  { id: '18', name: 'Amara Johnson', level: 10, xp: 1020, totalXP: 12890, nextLevelXP: 1800, progressPercentage: 57, streak: 17, lessonsCompleted: 71 },
  { id: '19', name: 'Luca Romano', level: 14, xp: 1680, totalXP: 19120, nextLevelXP: 2250, progressPercentage: 75, streak: 28, lessonsCompleted: 100 },
  { id: '20', name: 'Fatima Ali', level: 9, xp: 750, totalXP: 10780, nextLevelXP: 1650, progressPercentage: 45, streak: 13, lessonsCompleted: 62 },
  { id: '21', name: 'Noah Thompson', level: 6, xp: 380, totalXP: 6450, nextLevelXP: 1300, progressPercentage: 29, streak: 6, lessonsCompleted: 41 },
  { id: '22', name: 'Sakura Yamamoto', level: 12, xp: 1420, totalXP: 15890, nextLevelXP: 2000, progressPercentage: 71, streak: 22, lessonsCompleted: 88 },
  { id: '23', name: 'Hassan Mohammed', level: 11, xp: 1100, totalXP: 13340, nextLevelXP: 1900, progressPercentage: 58, streak: 14, lessonsCompleted: 73 },
  { id: '24', name: 'Olivia Brown', level: 8, xp: 620, totalXP: 9670, nextLevelXP: 1500, progressPercentage: 41, streak: 9, lessonsCompleted: 57 }
];

const TeacherProfile = ({ profile }: TeacherProfileProps) => {
  // Calculate class statistics
  const avgLevel = Math.round(demoStudents.reduce((sum, s) => sum + s.level, 0) / demoStudents.length);
  const avgXP = Math.round(demoStudents.reduce((sum, s) => sum + s.totalXP, 0) / demoStudents.length);
  const totalLessons = demoStudents.reduce((sum, s) => sum + s.lessonsCompleted, 0);
  const topPerformers = demoStudents.filter(s => s.level >= 12).length;

  // Sort students by level (descending), then by XP
  const sortedStudents = [...demoStudents].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    return b.totalXP - a.totalXP;
  });

  return (
    <div className="space-y-6">
      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{demoStudents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active learners</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Average Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{avgLevel}</div>
            <p className="text-xs text-muted-foreground mt-1">Class average</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">{topPerformers}</div>
            <p className="text-xs text-muted-foreground mt-1">Level 12+</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-500" />
              Total Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{totalLessons}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed this year</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Roster */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            ESL Advanced - Period 3
          </CardTitle>
          <CardDescription>
            Lincoln Elementary School • 24 Students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col items-center justify-center min-w-[60px]">
                    <Badge 
                      variant="secondary" 
                      className="text-lg font-bold px-3 py-1"
                    >
                      {student.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground mt-1">Level</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-base">{student.name}</h4>
                      {student.streak > 20 && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {student.streak} day streak
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Progress value={student.progressPercentage} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground min-w-[80px] text-right">
                          {student.xp.toLocaleString()} / {student.nextLevelXP.toLocaleString()} XP
                        </span>
                      </div>
                      
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {student.totalXP.toLocaleString()} total XP
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {student.lessonsCompleted} lessons
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherProfile;
