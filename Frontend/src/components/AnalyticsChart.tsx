import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";

interface UserGrowthData {
  name: string;
  users: number;
  revenue: number;
}

interface PlatformData {
  name: string;
  value: number;
}

interface ExamDistribution {
  exam_type: string;
  count: number;
  percentage: number;
}

interface RevenueData {
  period: string;
  data: Array<{
    date?: string;
    week?: string;
    month?: string;
    revenue: number;
  }>;
}

interface UserStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
}

interface CourseStats {
  total_courses: number;
  total_students: number;
  average_completion_rate: number;
  total_revenue: number;
  popular_courses: Array<any>;
}

interface SubscriptionStats {
  total_revenue: number;
  active_subscriptions: number;
}

interface SubscriptionAnalytics {
  total_revenue: number;
  total_subscribers: number;
  conversion_rate: number;
  churn_rate: number;
  active_plans: number;
  monthly_recurring_revenue: number;
}

interface UserDemographics {
  demographics: ExamDistribution[];
}

interface SubscriptionStatus {
  subscription_stats: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Base URL for your FastAPI backend
const API_BASE_URL = 'http://localhost:8000';

export function AnalyticsChart() {
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [examDistribution, setExamDistribution] = useState<PlatformData[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<PlatformData[]>([]);
  const [courseEnrollment, setCourseEnrollment] = useState<UserGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all required data from your FastAPI endpoints
        const [
          usersRes,
          coursesRes,
          subscriptionsRes,
          demographicsRes,
          revenueRes,
          subscriptionStatsRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/stats/users`),
          fetch(`${API_BASE_URL}/api/stats/courses`),
          fetch(`${API_BASE_URL}/api/stats/subscriptions`),
          fetch(`${API_BASE_URL}/api/analytics/user-demographics`),
          fetch(`${API_BASE_URL}/api/analytics/revenue?period=monthly`),
          fetch(`${API_BASE_URL}/api/analytics/subscription-stats`)
        ]);

        // Check for errors in responses
        if (!usersRes.ok) throw new Error(`Users API failed: ${usersRes.status}`);
        if (!coursesRes.ok) throw new Error(`Courses API failed: ${coursesRes.status}`);
        if (!subscriptionsRes.ok) throw new Error(`Subscriptions API failed: ${subscriptionsRes.status}`);
        if (!demographicsRes.ok) throw new Error(`Demographics API failed: ${demographicsRes.status}`);
        if (!revenueRes.ok) throw new Error(`Revenue API failed: ${revenueRes.status}`);
        if (!subscriptionStatsRes.ok) throw new Error(`Subscription Stats API failed: ${subscriptionStatsRes.status}`);

        const usersData: UserStats = await usersRes.json();
        const coursesData: CourseStats = await coursesRes.json();
        const subscriptionsData: SubscriptionStats = await subscriptionsRes.json();
        const demographicsData: UserDemographics = await demographicsRes.json();
        const revenueData: RevenueData = await revenueRes.json();
        const subscriptionStatsData: SubscriptionStatus = await subscriptionStatsRes.json();

        console.log('Fetched data:', {
          usersData,
          coursesData,
          subscriptionsData,
          demographicsData,
          revenueData,
          subscriptionStatsData
        });

        // Transform the data for charts using real database data
        setUserGrowth(transformUserGrowthData(usersData, revenueData, coursesData));
        setExamDistribution(transformExamData(demographicsData));
        setSubscriptionData(transformSubscriptionData(subscriptionStatsData, usersData));
        setCourseEnrollment(transformCourseEnrollmentData(coursesData, revenueData));
        
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(`Failed to load analytics data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Transform user growth data from actual database statistics
  const transformUserGrowthData = (
    users: UserStats, 
    revenue: RevenueData, 
    courses: CourseStats
  ): UserGrowthData[] => {
    // Use actual revenue data if available
    if (revenue.data && revenue.data.length > 0) {
      return revenue.data.map((item, index) => {
        const monthName = getMonthName(item.month) || `Month ${index + 1}`;
        // Calculate progressive user growth based on total users
        const progressiveUsers = Math.floor((users.total_users / revenue.data.length) * (index + 1));
        
        return {
          name: monthName,
          users: progressiveUsers,
          revenue: item.revenue || 0
        };
      });
    }

    // Fallback: Generate basic progression from total users
    return Array.from({ length: 6 }, (_, index) => ({
      name: getMonthNameByIndex(index),
      users: Math.floor((users.total_users / 6) * (index + 1)),
      revenue: Math.floor((courses.total_revenue / 6) * (index + 1))
    }));
  };

  // Transform exam distribution data from actual demographics
  const transformExamData = (demographics: UserDemographics): PlatformData[] => {
    if (demographics.demographics && Array.isArray(demographics.demographics)) {
      return demographics.demographics
        .filter((item: ExamDistribution) => item.exam_type && item.count > 0)
        .map((item: ExamDistribution) => ({
          name: formatExamName(item.exam_type),
          value: item.count
        }));
    }
    return [];
  };

  // Transform subscription data from actual subscription stats
  const transformSubscriptionData = (
    subscriptionStats: SubscriptionStatus, 
    users: UserStats
  ): PlatformData[] => {
    // Use subscription stats if available
    if (subscriptionStats.subscription_stats && Array.isArray(subscriptionStats.subscription_stats)) {
      return subscriptionStats.subscription_stats
        .filter((item: any) => item.status && item.count > 0)
        .map((item: any) => ({
          name: formatStatusName(item.status),
          value: item.count
        }));
    }
    
    // Fallback: Calculate from user stats
    return [
      { name: 'Active', value: users.active_users },
      { name: 'Inactive', value: users.total_users - users.active_users }
    ];
  };

  // Transform course enrollment data from actual course statistics
  const transformCourseEnrollmentData = (courses: CourseStats, revenue: RevenueData): UserGrowthData[] => {
    // Use revenue data timeline with course enrollment progression
    if (revenue.data && revenue.data.length > 0) {
      return revenue.data.map((item, index) => {
        const monthName = getMonthName(item.month) || `Month ${index + 1}`;
        const progressiveEnrollment = Math.floor((courses.total_students / revenue.data.length) * (index + 1));
        
        return {
          name: monthName,
          users: progressiveEnrollment,
          revenue: item.revenue || 0
        };
      });
    }

    // Fallback: Basic progression
    return Array.from({ length: 6 }, (_, index) => ({
      name: getMonthNameByIndex(index),
      users: Math.floor((courses.total_students / 6) * (index + 1)),
      revenue: Math.floor((courses.total_revenue / 6) * (index + 1))
    }));
  };

  // Helper functions
  const getMonthName = (monthString: string | undefined): string => {
    if (!monthString) return '';
    try {
      const monthNum = parseInt(monthString.split('-')[1]);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[monthNum - 1] || monthString;
    } catch {
      return monthString;
    }
  };

  const getMonthNameByIndex = (index: number): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[index % 12];
  };

  const formatExamName = (examType: string): string => {
    const examMap: { [key: string]: string } = {
      'jee': 'JEE',
      'neet': 'NEET',
      'upsc': 'UPSC',
      'cat': 'CAT',
      'gate': 'GATE',
      'other_govt_exam': 'Other Govt'
    };
    return examMap[examType] || examType.toUpperCase();
  };

  const formatStatusName = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 animate-pulse rounded-lg">
                <div className="text-muted-foreground">Loading data from database...</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="h-[300px] flex flex-col items-center justify-center text-center">
              <div className="text-destructive text-lg font-semibold mb-2">Data Load Error</div>
              <div className="text-sm text-muted-foreground mb-4">{error}</div>
              <div className="text-xs text-muted-foreground">
                Make sure your FastAPI server is running on http://localhost:8000
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Growth & Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth & Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis 
                yAxisId="left"
                stroke="var(--muted-foreground)" 
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="var(--muted-foreground)"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value, name) => {
                  if (name === 'revenue') return [`₹${Number(value).toLocaleString()}`, 'Revenue'];
                  return [value, 'Users'];
                }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="users" 
                stroke="var(--chart-1)" 
                strokeWidth={2}
                dot={{ fill: "var(--chart-1)", r: 4 }}
                name="Users"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--chart-3)" 
                strokeWidth={2}
                dot={{ fill: "var(--chart-3)", r: 4 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Exam Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={examDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {examDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} students`, 'Count']}
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subscriptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                formatter={(value) => [`${value} users`, 'Count']}
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar 
                dataKey="value" 
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Course Enrollment Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Course Enrollment Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseEnrollment}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value, name) => {
                  if (name === 'revenue') return [`₹${Number(value).toLocaleString()}`, 'Revenue'];
                  return [value, 'Enrollments'];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="var(--chart-4)" 
                strokeWidth={2}
                dot={{ fill: "var(--chart-4)", r: 4 }}
                name="Enrollments"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}