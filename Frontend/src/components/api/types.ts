// api/types.ts
export interface Exam {
  id: number;
  name: string;
  display_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: number;
  name: string;
  description: string;
  exam_id: number;
  topics_count: number;
  created_at: string;
  exam?: Exam;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  subject_id: number;
  user_count: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
  subject?: Subject;
}

export interface Course {
  id: number;
  title: string;
  credits?: number;
  description: string;
  exam_type: string;
  instructor: string;
  duration: string;
  enrolled_students: number;
  completion_rate: number;
  rating: number;
  status: string;
  last_updated: string;
  exam_id?: number;
  exam?: Exam;
  modules?: Module[];
  user_courses?: UserCourse[];
}

export interface Module {
  id: number;
  title: string;
  description: string;
  course_id: number;
  order_index: number;
  duration: string;
  lessons_count: number;
  created_at: string;
  course?: Course;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  module_id: number;
  order_index: number;
  duration: string;
  content_type: string;
  content_url: string;
  is_published: boolean;
  created_at: string;
  module?: Module;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  content_type: string;
  file_url: string;
  file_size: string;
  duration?: string;
  downloads: number;
  status: string;
  version: string;
  author: string;
  module_id?: number;
  course_id?: number;
  questions?: any[];
  created_at: string;
  updated_at: string;
  module?: Module;
  course?: Course;
  versions?: ContentVersion[];
}

export interface ContentVersion {
  id: number;
  content_id: number;
  version_number: string;
  changelog: string;
  file_url: string;
  file_size: string;
  author: string;
  status: string;
  created_at: string;
  content?: Content;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  exam_type?: string;
  subscription_status: string;
  subscription_plan: string;
  join_date: string;
  last_active: string;
  total_study_hours: number;
  tests_attempted: number;
  average_score: number;
  current_rank?: number;
  account_status: string;
  deletion_requested: boolean;
  deletion_request_date?: string;
  deletion_reason?: string;
  created_at: string;
  updated_at: string;
  user_courses?: UserCourse[];
}

export interface UserCourse {
  id: number;
  user_id: string;
  course_id: number;
  enrollment_date: string;
  progress: number;
  last_accessed: string;
  completion_status: string;
  created_at: string;
  updated_at: string;
  user?: User;
  course?: Course;
}

// Form Data Types
export interface CourseFormData {
  title: string;
  description: string;
  exam_type: string;
  instructor: string;
  duration: string;
  exam_id?: number;
  status?: string;
}

export interface ModuleFormData {
  title: string;
  description: string;
  course_id: number;
  order_index: number;
  duration: string;
}

export interface ContentFormData {
  title: string;
  description: string;
  content_type: string;
  file_url: string;
  file_size: string;
  duration?: string;
  author: string;
  module_id?: number;
  course_id?: number;
  status?: string;
  questions?: any[];
}

export interface QuizFormData {
  title: string;
  description: string;
  questions: QuizQuestion[];
  time_limit: number;
  passing_score: number;
  content_type: string;
  module_id?: number;
  course_id?: number;
  status?: string;
  duration?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

// Stats Types
export interface CourseStats {
  total_courses: number;
  total_students: number;
  average_completion_rate: number;
  total_revenue: number;
  popular_courses: Course[];
}

export interface ContentStats {
  total_content: number;
  total_downloads: number;
  storage_used: string;
  content_by_type: { type: string; count: number }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}