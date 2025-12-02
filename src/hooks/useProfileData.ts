// Demo mode - returns mock teacher profile with classroom data
export const useProfileData = () => {
  const demoUser = {
    id: 'demo-teacher-001',
    email: 'sarah.johnson@lincolnelementary.edu',
    created_at: '2024-08-15T10:00:00.000Z',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    role: 'authenticated'
  };

  const demoProfile = {
    id: 'demo-teacher-001',
    user_id: 'demo-teacher-001',
    display_name: 'Sarah Johnson',
    full_name: 'Sarah Johnson',
    role: 'teacher',
    avatar_url: null,
    email: 'sarah.johnson@lincolnelementary.edu',
    learning_goal: null,
    target_level: null,
    target_date: null,
    student_id: null,
    school_id: 'lincoln-elementary',
    graduation_year: null,
    grade_level_id: null,
    created_at: '2024-08-15T10:00:00.000Z',
    updated_at: '2024-08-15T10:00:00.000Z',
    school: {
      id: 'lincoln-elementary',
      name: 'Lincoln Elementary School',
      district_id: null,
      school_code: 'LIN-001',
      created_at: '2024-08-01T00:00:00.000Z',
      updated_at: '2024-08-01T00:00:00.000Z'
    },
    district_associations: []
  };

  return {
    user: demoUser,
    profile: demoProfile,
    isLoading: false,
    authError: false,
    debugInfo: { mode: 'demo', role: 'teacher' },
    fetchUserData: async () => {},
    refetchProfile: async () => {}
  };
};
