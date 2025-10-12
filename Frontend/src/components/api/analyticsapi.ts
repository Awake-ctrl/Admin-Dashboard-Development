// API service for analytics data
const API_BASE_URL = 'http://localhost:8000';

// Helper functions
const getMonthName = (monthString: string): string => {
  try {
    const monthNum = parseInt(monthString.split('-')[1]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1] || monthString;
  } catch {
    return monthString;
  }
};

const formatExamName = (examType: string): string => {
  const examMap: { [key: string]: string } = {
    'jee': 'JEE',
    'neet': 'NEET',
    'upsc': 'UPSC',
    'cat': 'CAT',
    'gate': 'GATE',
    'other_govt_exam': 'Other'
  };
  return examMap[examType] || examType;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Data transformation functions
export const transformEnrollmentData = (revenueData: any, courseStats: any): any[] => {
  return revenueData?.data ? revenueData.data.map((item: any, index: number) => ({
    name: item.month ? getMonthName(item.month) : `Month ${index + 1}`,
    enrollments: Math.floor((courseStats?.total_students || 0) / (revenueData.data.length || 1) * (index + 1)),
    completions: Math.floor(((courseStats?.total_students || 0) * (courseStats?.average_completion_rate || 0) / 100) / (revenueData.data.length || 1) * (index + 1))
  })) : [];
};

export const transformCoursePerformance = (courseStats: any): any[] => {
  return courseStats?.popular_courses ? courseStats.popular_courses.slice(0, 5).map((course: any) => ({
    name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
    students: course.enrolled_students,
    completion: course.completion_rate,
    rating: course.rating
  })) : [];
};

export const transformDeviceUsage = (userDemographics: any): any[] => {
  const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];
  return userDemographics?.demographics ? userDemographics.demographics.slice(0, 3).map((demo: any, index: number) => ({
    name: formatExamName(demo.exam_type),
    value: demo.percentage,
    color: COLORS[index % COLORS.length]
  })) : [];
};

export const transformEngagementData = (revenueData: any, contentStats: any, userStats: any, courseStats: any): any[] => {
  return revenueData?.data ? revenueData.data.slice(0, 4).map((item: any, index: number) => ({
    name: `Week ${index + 1}`,
    videoViews: Math.floor((contentStats?.total_downloads || 0) / 4 * (index + 1)),
    forumPosts: Math.floor((userStats?.total_users || 0) * 0.1 * (index + 1)),
    assignments: Math.floor((courseStats?.total_students || 0) * 0.8 * (index + 1))
  })) : [];
};

// API fetch functions
export const fetchAnalyticsData = async () => {
  try {
    const [
      usersRes,
      coursesRes,
      contentsRes,
      subscriptionsRes,
      demographicsRes,
      revenueRes
    ] = await Promise.all([
      fetch(`${API_BASE_URL}/api/stats/users`),
      fetch(`${API_BASE_URL}/api/stats/courses`),
      fetch(`${API_BASE_URL}/api/stats/contents`),
      fetch(`${API_BASE_URL}/api/stats/subscriptions`),
      fetch(`${API_BASE_URL}/api/analytics/user-demographics`),
      fetch(`${API_BASE_URL}/api/analytics/revenue?period=monthly`)
    ]);

    if (!usersRes.ok) throw new Error('Failed to fetch user stats');
    if (!coursesRes.ok) throw new Error('Failed to fetch course stats');
    if (!contentsRes.ok) throw new Error('Failed to fetch content stats');
    if (!subscriptionsRes.ok) throw new Error('Failed to fetch subscription stats');
    if (!demographicsRes.ok) throw new Error('Failed to fetch demographics');
    if (!revenueRes.ok) throw new Error('Failed to fetch revenue data');

    const usersData = await usersRes.json();
    const coursesData = await coursesRes.json();
    const contentsData = await contentsRes.json();
    const subscriptionsData = await subscriptionsRes.json();
    const demographicsData = await demographicsRes.json();
    const revenueData = await revenueRes.json();

    return {
      usersData,
      coursesData,
      contentsData,
      subscriptionsData,
      demographicsData,
      revenueData
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

// Export helper functions if needed elsewhere
export { formatCurrency };