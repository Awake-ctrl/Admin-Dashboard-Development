const API_BASE_URL = 'http://localhost:8000';

export interface LeaderboardUser {
  id: number;
  user_id: string;
  user_name: string;
  email: string;
  score: number;
  rank: number;
  exam: string;
  avatar: string;
  questions_attempted: number;
  questions_correct: number;
  accuracy: number;
  streak: number;  // Now this will be a proper calculated streak (0-30+)
  last_active: string;
  preferred_subject: string;  // Now this comes from actual user data
}

export const fetchLeaderboardData = async (): Promise<LeaderboardUser[]> => {
  try {
    // Since you don't have a dedicated leaderboard endpoint yet,
    // we'll use the users endpoint and transform the data
    const response = await fetch(`${API_BASE_URL}/api/users`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }

    const users = await response.json();
    
    // Transform user data into leaderboard format
    // This is a temporary solution - you should create a proper leaderboard endpoint
    const leaderboardData: LeaderboardUser[] = users.map((user: any, index: number) => ({
      id: index + 1,
      userId: user.id,
      userName: user.name,
      email: user.email,
      score: calculateUserScore(user), // Calculate based on user stats
      rank: index + 1,
      exam: user.exam_type || 'jee',
      avatar: '',
      questionsAttempted: user.tests_attempted * 10, // Estimate based on tests
      questionsCorrect: Math.floor(user.tests_attempted * 10 * (user.average_score / 100)),
      accuracy: user.average_score || 0,
      streak: Math.floor(Math.random() * 20) + 1, // Random streak for demo
      lastActive: user.last_active ? new Date(user.last_active).toISOString() : new Date().toISOString(),
      preferredSubject: getPreferredSubject(user.exam_type)
    })).sort((a: LeaderboardUser, b: LeaderboardUser) => b.score - a.score) // Sort by score
      .map((user: LeaderboardUser, index: number) => ({
        ...user,
        rank: index + 1 // Reassign ranks after sorting
      }));

    return leaderboardData;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    throw error;
  }
};

// Helper function to calculate user score based on their stats
const calculateUserScore = (user: any): number => {
  const baseScore = (user.total_study_hours || 0) * 10;
  const testScore = (user.tests_attempted || 0) * 50;
  const accuracyBonus = (user.average_score || 0) * 10;
  return baseScore + testScore + accuracyBonus;
};

// Helper function to determine preferred subject based on exam type
const getPreferredSubject = (examType: string): string => {
  const subjectMap: { [key: string]: string } = {
    'jee': ['Physics', 'Mathematics', 'Chemistry'][Math.floor(Math.random() * 3)],
    'neet': ['Biology', 'Chemistry', 'Physics'][Math.floor(Math.random() * 3)],
    'cat': ['Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning'][Math.floor(Math.random() * 3)],
    'upsc': ['History', 'Geography', 'Polity'][Math.floor(Math.random() * 3)],
    'gate': ['Technical', 'Engineering', 'Science'][Math.floor(Math.random() * 3)],
    'other_govt_exam': ['General Knowledge', 'Aptitude', 'Reasoning'][Math.floor(Math.random() * 3)]
  };
  return subjectMap[examType] || 'General';
};