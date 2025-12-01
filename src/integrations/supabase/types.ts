export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      access_code_attempts: {
        Row: {
          attempted_at: string | null
          code: string
          id: string
          user_id: string | null
        }
        Insert: {
          attempted_at?: string | null
          code: string
          id?: string
          user_id?: string | null
        }
        Update: {
          attempted_at?: string | null
          code?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      access_codes: {
        Row: {
          class_id: string | null
          code: string
          created_at: string | null
          expires_at: string | null
          id: string
        }
        Insert: {
          class_id?: string | null
          code: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
        }
        Update: {
          class_id?: string | null
          code?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_codes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_override_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      certification_attempts: {
        Row: {
          certification_type: string
          completed_at: string | null
          created_at: string | null
          id: string
          level: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          certification_type: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          level?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          certification_type?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          level?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      classes: {
        Row: {
          class_code: string | null
          created_at: string | null
          id: string
          name: string
          school_name: string | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          class_code?: string | null
          created_at?: string | null
          id?: string
          name: string
          school_name?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          class_code?: string | null
          created_at?: string | null
          id?: string
          name?: string
          school_name?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      compliance_status: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      data_breach_notifications: {
        Row: {
          affected_users: number | null
          breach_date: string
          created_at: string | null
          description: string | null
          id: string
          status: string | null
        }
        Insert: {
          affected_users?: number | null
          breach_date: string
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          affected_users?: number | null
          breach_date?: string
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
        }
        Relationships: []
      }
      data_export_requests: {
        Row: {
          completed_at: string | null
          id: string
          requested_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          requested_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          requested_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      district_settings: {
        Row: {
          created_at: string | null
          district_id: string | null
          id: string
          max_age: number | null
          min_age: number | null
          settings: Json | null
        }
        Insert: {
          created_at?: string | null
          district_id?: string | null
          id?: string
          max_age?: number | null
          min_age?: number | null
          settings?: Json | null
        }
        Update: {
          created_at?: string | null
          district_id?: string | null
          id?: string
          max_age?: number | null
          min_age?: number | null
          settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "district_settings_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "school_districts"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_data_access_audit: {
        Row: {
          access_type: string | null
          accessor_user_id: string | null
          created_at: string | null
          data_accessed: string | null
          data_category: string | null
          id: string
          purpose: string | null
          target_user_id: string | null
        }
        Insert: {
          access_type?: string | null
          accessor_user_id?: string | null
          created_at?: string | null
          data_accessed?: string | null
          data_category?: string | null
          id?: string
          purpose?: string | null
          target_user_id?: string | null
        }
        Update: {
          access_type?: string | null
          accessor_user_id?: string | null
          created_at?: string | null
          data_accessed?: string | null
          data_category?: string | null
          id?: string
          purpose?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      school_districts: {
        Row: {
          created_at: string | null
          id: string
          name: string
          region: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          region?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      student_enrollments: {
        Row: {
          class_id: string | null
          enrolled_at: string | null
          id: string
          student_id: string | null
        }
        Insert: {
          class_id?: string | null
          enrolled_at?: string | null
          id?: string
          student_id?: string | null
        }
        Update: {
          class_id?: string | null
          enrolled_at?: string | null
          id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      student_language_metrics: {
        Row: {
          class_id: string | null
          conversation_complexity: number | null
          created_at: string | null
          grammar_accuracy: number | null
          id: string
          pronunciation_score: number | null
          student_id: string | null
          updated_at: string | null
          vocabulary_score: number | null
        }
        Insert: {
          class_id?: string | null
          conversation_complexity?: number | null
          created_at?: string | null
          grammar_accuracy?: number | null
          id?: string
          pronunciation_score?: number | null
          student_id?: string | null
          updated_at?: string | null
          vocabulary_score?: number | null
        }
        Update: {
          class_id?: string | null
          conversation_complexity?: number | null
          created_at?: string | null
          grammar_accuracy?: number | null
          id?: string
          pronunciation_score?: number | null
          student_id?: string | null
          updated_at?: string | null
          vocabulary_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_language_metrics_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      student_metrics: {
        Row: {
          class_id: string | null
          id: string
          last_updated: string | null
          progress_percentage: number | null
          student_id: string | null
          test_score: number | null
        }
        Insert: {
          class_id?: string | null
          id?: string
          last_updated?: string | null
          progress_percentage?: number | null
          student_id?: string | null
          test_score?: number | null
        }
        Update: {
          class_id?: string | null
          id?: string
          last_updated?: string | null
          progress_percentage?: number | null
          student_id?: string | null
          test_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_metrics_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      student_usage_limits: {
        Row: {
          daily_limit: number | null
          id: string
          last_reset: string | null
          used_today: number | null
          user_id: string | null
        }
        Insert: {
          daily_limit?: number | null
          id?: string
          last_reset?: string | null
          used_today?: number | null
          user_id?: string | null
        }
        Update: {
          daily_limit?: number | null
          id?: string
          last_reset?: string | null
          used_today?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_access_code: { Args: { class_id: string }; Returns: string }
      process_access_code: {
        Args: { code_input: string; user_id_input: string }
        Returns: Json
      }
      recalculate_student_metrics: {
        Args: { student_id_input: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
