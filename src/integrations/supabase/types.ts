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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      daily_activity: {
        Row: {
          date: string
          flashcards_reviewed: number | null
          id: string
          questions_answered: number | null
          time_spent_minutes: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          date: string
          flashcards_reviewed?: number | null
          id?: string
          questions_answered?: number | null
          time_spent_minutes?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          date?: string
          flashcards_reviewed?: number | null
          id?: string
          questions_answered?: number | null
          time_spent_minutes?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      diagnostic_results: {
        Row: {
          answers: Json
          completed_at: string | null
          id: string
          performance_level: string
          score: number
          strong_topics: Json | null
          user_id: string
          weak_topics: Json | null
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          id?: string
          performance_level: string
          score: number
          strong_topics?: Json | null
          user_id: string
          weak_topics?: Json | null
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          id?: string
          performance_level?: string
          score?: number
          strong_topics?: Json | null
          user_id?: string
          weak_topics?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      question_attempts: {
        Row: {
          attempted_at: string | null
          id: string
          is_correct: boolean
          question_id: string
          selected_answer: string
          source: string
          time_spent_seconds: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          attempted_at?: string | null
          id?: string
          is_correct: boolean
          question_id: string
          selected_answer: string
          source: string
          time_spent_seconds?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          attempted_at?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_answer?: string
          source?: string
          time_spent_seconds?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          alternatives: Json
          correct_answer: string
          created_at: string | null
          difficulty_level: string
          explanation: string
          id: string
          question_text: string
          topic: string
        }
        Insert: {
          alternatives: Json
          correct_answer: string
          created_at?: string | null
          difficulty_level: string
          explanation: string
          id?: string
          question_text: string
          topic: string
        }
        Update: {
          alternatives?: Json
          correct_answer?: string
          created_at?: string | null
          difficulty_level?: string
          explanation?: string
          id?: string
          question_text?: string
          topic?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity: string | null
          longest_streak: number | null
          overall_accuracy: number | null
          questions_answered: number | null
          total_xp: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity?: string | null
          longest_streak?: number | null
          overall_accuracy?: number | null
          questions_answered?: number | null
          total_xp?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity?: string | null
          longest_streak?: number | null
          overall_accuracy?: number | null
          questions_answered?: number | null
          total_xp?: number | null
          user_id?: string
        }
        Relationships: []
      }
      topic_progress: {
        Row: {
          average_time: number | null
          current_accuracy: number | null
          diagnostic_accuracy: number | null
          id: string
          last_practiced: string | null
          questions_attempted: number | null
          questions_correct: number | null
          topic_name: string
          user_id: string
        }
        Insert: {
          average_time?: number | null
          current_accuracy?: number | null
          diagnostic_accuracy?: number | null
          id?: string
          last_practiced?: string | null
          questions_attempted?: number | null
          questions_correct?: number | null
          topic_name: string
          user_id: string
        }
        Update: {
          average_time?: number | null
          current_accuracy?: number | null
          diagnostic_accuracy?: number | null
          id?: string
          last_practiced?: string | null
          questions_attempted?: number | null
          questions_correct?: number | null
          topic_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "teacher"
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
    Enums: {
      app_role: ["student", "teacher"],
    },
  },
} as const
