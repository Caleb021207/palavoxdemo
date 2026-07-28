import { ExtendedUserProfile } from '@/types/school';

export const generateDemoTeacherProfile = (): ExtendedUserProfile => {
  return {
    id: 'demo-teacher-id',
    display_name: 'Sarah Johnson',
    email: 'demo.teacher@palavox.com',
    avatar_url: null,
    learning_goal: '',
    target_level: 'C1',
    target_date: null,
    role: 'teacher',
    school_id: 'demo-school-id',
    student_id: null,
    graduation_year: null,
    grade_level_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    school: {
      id: 'demo-school-id',
      name: 'Lincoln Elementary School',
      district_id: 'demo-district-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    district_associations: [],
  };
};

export const generateDemoStudents = () => {
  const studentNames = [
    { name: 'Emma Rodriguez', email: 'emma.r@school.edu' },
    { name: 'Liam Chen', email: 'liam.c@school.edu' },
    { name: 'Sofia Martinez', email: 'sofia.m@school.edu' },
    { name: 'Noah Patel', email: 'noah.p@school.edu' },
    { name: 'Olivia Kim', email: 'olivia.k@school.edu' },
    { name: 'Ethan Nguyen', email: 'ethan.n@school.edu' },
    { name: 'Ava Thompson', email: 'ava.t@school.edu' },
    { name: 'Mason Garcia', email: 'mason.g@school.edu' },
    { name: 'Isabella Brown', email: 'isabella.b@school.edu' },
    { name: 'Lucas Johnson', email: 'lucas.j@school.edu' },
    { name: 'Mia Williams', email: 'mia.w@school.edu' },
    { name: 'James Anderson', email: 'james.a@school.edu' },
  ];

  return studentNames.map((student, index) => ({
    student_id: `demo-student-${index}`,
    student_name: student.name,
    student_email: student.email,
    class_id: 'demo-class-1',
    class_name: 'Spanish 101',
    overall_score: Math.round(55 + (index * 2.5) + Math.random() * 5),
    cefr_level: index < 4 ? 'A2' : index < 8 ? 'B1' : 'B2',
    upload_date: new Date(Date.now() - (11 - index) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    avg_grammar_accuracy: Math.round(52 + (index * 2.8) + Math.random() * 5),
    avg_conversation_complexity: Math.round(50 + (index * 3) + Math.random() * 5),
    last_activity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export const generateDemoMetrics = () => {
  // Rolling 9-week window ending this week, so the demo never looks stale
  const dates = Array.from({ length: 9 }, (_, index) => {
    const day = new Date(Date.now() - (8 - index) * 7 * 24 * 60 * 60 * 1000);
    return day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Linear improvement starting at 55% and ending at 82%
  const startScore = 55;
  const endScore = 82;
  const increment = (endScore - startScore) / (dates.length - 1);

  const scoreProgression = dates.map((date, index) => ({
    date,
    avgScore: Math.round(startScore + (increment * index)),
    count: 12,
  }));

  // Grammar trends with similar linear improvement
  const grammarStart = 52;
  const grammarEnd = 78;
  const grammarIncrement = (grammarEnd - grammarStart) / (dates.length - 1);

  const grammarTrends = dates.map((date, index) => ({
    date,
    avgGrammar: Math.round(grammarStart + (grammarIncrement * index)),
    count: 12,
  }));

  // Complexity trends
  const complexityStart = 50;
  const complexityEnd = 80;
  const complexityIncrement = (complexityEnd - complexityStart) / (dates.length - 1);

  const complexityTrends = dates.map((date, index) => ({
    date,
    avgComplexity: Math.round(complexityStart + (complexityIncrement * index)),
    count: 12,
  }));

  // Pronunciation trends
  const pronunciationStart = 58;
  const pronunciationEnd = 85;
  const pronunciationIncrement = (pronunciationEnd - pronunciationStart) / (dates.length - 1);

  const pronunciationTrends = dates.map((date, index) => ({
    date,
    avgPronunciation: Math.round(pronunciationStart + (pronunciationIncrement * index)),
    count: 12,
  }));

  return {
    scoreProgression,
    grammarTrends,
    complexityTrends,
    pronunciationTrends,
    totalStudents: 12,
    totalClasses: 1,
  };
};
