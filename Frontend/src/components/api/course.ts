// api/course.ts
import { 
  Exam, Subject, Topic, Course, Module, Content, ContentVersion,
  CourseFormData, ModuleFormData, ContentFormData, QuizFormData,
  CourseStats, ContentStats, ApiResponse, PaginatedResponse,
  User, UserCourse
} from './types';



class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL+"/api";

    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`API Call: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, `API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Exam API
export const examApi = {
  getExams: (): Promise<Exam[]> => apiCall<Exam[]>('/exams'),
  getExam: (id: number): Promise<Exam> => apiCall<Exam>(`/exams/${id}`),
  createExam: (data: Partial<Exam>): Promise<Exam> => 
    apiCall<Exam>('/exams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateExam: (id: number, data: Partial<Exam>): Promise<Exam> =>
    apiCall<Exam>(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteExam: (id: number): Promise<void> =>
    apiCall<void>(`/exams/${id}`, {
      method: 'DELETE',
    }),
};

// Subject API
export const subjectApi = {
  getSubjects: (examId?: number): Promise<Subject[]> => {
    const params = examId ? `?exam_id=${examId}` : '';
    return apiCall<Subject[]>(`/subjects${params}`);
  },
  getSubject: (id: number): Promise<Subject> => apiCall<Subject>(`/subjects/${id}`),
  createSubject: (data: Partial<Subject>): Promise<Subject> => 
    apiCall<Subject>('/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSubject: (id: number, data: Partial<Subject>): Promise<Subject> =>
    apiCall<Subject>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSubject: (id: number): Promise<void> =>
    apiCall<void>(`/subjects/${id}`, {
      method: 'DELETE',
    }),
};

// Topic API
export const topicApi = {
  getTopics: (subjectId?: number): Promise<Topic[]> => {
    const params = subjectId ? `?subject_id=${subjectId}` : '';
    return apiCall<Topic[]>(`/topics${params}`);
  },
  getTopic: (id: number): Promise<Topic> => apiCall<Topic>(`/topics/${id}`),
  createTopic: (data: Partial<Topic>): Promise<Topic> => 
    apiCall<Topic>('/topics', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTopic: (id: number, data: Partial<Topic>): Promise<Topic> =>
    apiCall<Topic>(`/topics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTopic: (id: number): Promise<void> =>
    apiCall<void>(`/topics/${id}`, {
      method: 'DELETE',
    }),
};

// Course API
export const courseApi = {
  getCourses: (examType?: string): Promise<Course[]> => {
    const params = examType ? `?exam_type=${examType}` : '';
    return apiCall<Course[]>(`/courses${params}`);
  },
  getCourse: (id: number): Promise<Course> => apiCall<Course>(`/courses/${id}`),
  createCourse: (data: CourseFormData): Promise<Course> => 
    apiCall<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCourse: (id: number, data: Partial<CourseFormData>): Promise<Course> => 
    apiCall<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCourse: (id: number): Promise<void> => 
    apiCall<void>(`/courses/${id}`, {
      method: 'DELETE',
    }),
  getCourseStudents: (courseId: number): Promise<UserCourse[]> =>
    apiCall<UserCourse[]>(`/courses/${courseId}/students`),
  getPopularCourses: (limit?: number): Promise<Course[]> => {
    const params = limit ? `?limit=${limit}` : '';
    return apiCall<Course[]>(`/courses/popular${params}`);
  },
};

// Module API
export const moduleApi = {
  getModules: (courseId?: number): Promise<Module[]> => {
    const params = courseId ? `?course_id=${courseId}` : '';
    return apiCall<Module[]>(`/modules${params}`);
  },
  getModule: (id: number): Promise<Module> => apiCall<Module>(`/modules/${id}`),
  createModule: (data: ModuleFormData): Promise<Module> => 
    apiCall<Module>('/modules', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateModule: (id: number, data: Partial<ModuleFormData>): Promise<Module> => 
    apiCall<Module>(`/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteModule: (id: number): Promise<void> => 
    apiCall<void>(`/modules/${id}`, {
      method: 'DELETE',
    }),
};

// Content API
export const contentApi = {
  getContents: (moduleId?: number, courseId?: number): Promise<Content[]> => {
    const params = new URLSearchParams();
    if (moduleId) params.append('module_id', moduleId.toString());
    if (courseId) params.append('course_id', courseId.toString());
    const queryString = params.toString();
    return apiCall<Content[]>(`/contents${queryString ? `?${queryString}` : ''}`);
  },
  getContent: (id: number): Promise<Content> => apiCall<Content>(`/contents/${id}`),
  createContent: (data: ContentFormData | QuizFormData): Promise<Content> => 
    apiCall<Content>('/contents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateContent: (id: number, data: Partial<ContentFormData>): Promise<Content> => 
    apiCall<Content>(`/contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteContent: (id: number): Promise<void> => 
    apiCall<void>(`/contents/${id}`, {
      method: 'DELETE',
    }),
  getContentVersions: (contentId: number): Promise<ContentVersion[]> => 
    apiCall<ContentVersion[]>(`/contents/${contentId}/versions`),
  createContentVersion: (contentId: number, data: Partial<ContentVersion>): Promise<ContentVersion> => 
    apiCall<ContentVersion>(`/contents/${contentId}/versions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateContentVersion: (contentId: number, versionId: number, data: Partial<ContentVersion>): Promise<ContentVersion> => 
    apiCall<ContentVersion>(`/contents/${contentId}/versions/${versionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  incrementDownload: (contentId: number): Promise<{ message: string; downloads: number }> => 
    apiCall<{ message: string; downloads: number }>(`/contents/${contentId}/download`, {
      method: 'POST',
    }),
  uploadFile: async (file: File): Promise<{ file_url: string; file_size: string; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'File upload failed');
    }

    return await response.json();
  },
};

// User API
export const userApi = {
  getUsers: (): Promise<User[]> => apiCall<User[]>('/users'),
  getUser: (id: string): Promise<User> => apiCall<User>(`/users/${id}`),
  getUserCourses: (userId: string): Promise<UserCourse[]> => 
    apiCall<UserCourse[]>(`/users/${userId}/courses`),
  updateUser: (id: string, data: Partial<User>): Promise<User> =>
    apiCall<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// User Course Subscriptions API
export const userCourseApi = {
  getUserCourses: (userId?: string, courseId?: number): Promise<UserCourse[]> => {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (courseId) params.append('course_id', courseId.toString());
    const queryString = params.toString();
    return apiCall<UserCourse[]>(`/user-courses${queryString ? `?${queryString}` : ''}`);
  },
  createUserCourse: (data: Partial<UserCourse>): Promise<UserCourse> =>
    apiCall<UserCourse>('/user-courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateUserCourse: (id: number, data: Partial<UserCourse>): Promise<UserCourse> =>
    apiCall<UserCourse>(`/user-courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteUserCourse: (id: number): Promise<void> =>
    apiCall<void>(`/user-courses/${id}`, {
      method: 'DELETE',
    }),
};

// Stats API
export const statsApi = {
  getCourseStats: (): Promise<CourseStats> => apiCall<CourseStats>('/stats/courses'),
  getContentStats: (): Promise<ContentStats> => apiCall<ContentStats>('/stats/contents'),
  getUserStats: (): Promise<{ total_users: number; active_users: number; new_users_today: number }> =>
    apiCall('/stats/users'),
  getSubscriptionStats: (): Promise<{ total_revenue: number; active_subscriptions: number }> =>
    apiCall('/stats/subscriptions'),
};

export { ApiError };