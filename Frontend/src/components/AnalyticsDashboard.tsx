import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useAnalytics } from "./hooks/useAnalytics";
import { ErrorServer, ErrorNoInternet, GenericError } from "./ui/ErrorStates";
export function AnalyticsDashboard() {
  const {
    userStats,
    courseStats,
    contentStats,
    subscriptionStats,
    enrollmentData,
    coursePerformance,
    deviceUsage,
    engagementData,
    loading,
    error,
    formatCurrency
  } = useAnalytics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>
                  <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted/20 animate-pulse rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

   if (error) {
    const errorMessage = error.toString().toLowerCase();
    
    if (errorMessage.includes('failed to fetch') || 
        errorMessage.includes('network') || 
        errorMessage.includes('offline')) {
      return <ErrorNoInternet />;
    }
    
    if (errorMessage.includes('500') || 
        errorMessage.includes('server') || 
        errorMessage.includes('internal')) {
      return <ErrorServer />;
    }
    
    return (
      <GenericError 
        title="Analytics Data Unavailable"
        description={error}
        onRetry={() => window.location.reload()}
        showHomeButton={true}
      />
    );
  }
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userStats?.total_users.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-green-600">
              +{Math.floor((userStats?.new_users_today || 0) / (userStats?.total_users || 1) * 100)}% today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Course Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {courseStats?.average_completion_rate.toFixed(0)}%
            </div>
            <p className="text-xs text-green-600">
              +{Math.floor((courseStats?.average_completion_rate || 0) * 0.05)}% vs last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userStats?.active_users.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-green-600">
              {Math.floor((userStats?.active_users || 0) / (userStats?.total_users || 1) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(subscriptionStats?.total_revenue || 0)}
            </div>
            <p className="text-xs text-green-600">
              +{Math.floor((subscriptionStats?.total_revenue || 0) * 0.08 / 1000)}% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment vs Completion Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="enrollments" 
                  stroke="var(--chart-1)" 
                  strokeWidth={2}
                  name="Enrollments"
                  dot={{ fill: "var(--chart-1)", r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completions" 
                  stroke="var(--chart-2)" 
                  strokeWidth={2}
                  name="Completions"
                  dot={{ fill: "var(--chart-2)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exam Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {deviceUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {deviceUsage.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursePerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value, name) => [
                    name === 'completion' ? `${value}%` : value,
                    name === 'completion' ? 'Completion Rate' : name === 'students' ? 'Students' : 'Rating'
                  ]}
                />
                <Bar 
                  dataKey="completion" 
                  fill="var(--chart-3)"
                  radius={[4, 4, 0, 0]}
                  name="Completion Rate"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="videoViews" 
                  stroke="var(--chart-4)" 
                  strokeWidth={2}
                  name="Content Downloads"
                  dot={{ fill: "var(--chart-4)", r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="forumPosts" 
                  stroke="var(--chart-5)" 
                  strokeWidth={2}
                  name="Active Users"
                  dot={{ fill: "var(--chart-5)", r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="assignments" 
                  stroke="var(--chart-1)" 
                  strokeWidth={2}
                  name="Course Progress"
                  dot={{ fill: "var(--chart-1)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Content:</span>
                <span className="font-medium">{contentStats?.total_content || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Downloads:</span>
                <span className="font-medium">{contentStats?.total_downloads?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage Used:</span>
                <span className="font-medium">{contentStats?.storage_used || '0 GB'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Courses:</span>
                <span className="font-medium">{courseStats?.total_courses || 0}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-muted-foreground">Total Enrollments:</span>
                <span className="font-medium">{courseStats?.total_students?.toLocaleString() || 0}</span>
              </div> */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Subscriptions:</span>
                <span className="font-medium">{subscriptionStats?.active_subscriptions?.toLocaleString() || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">New Users Today:</span>
                <span className="font-medium text-green-600">{userStats?.new_users_today || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Users:</span>
                <span className="font-medium">{userStats?.active_users || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completion Rate:</span>
                <span className="font-medium">{courseStats?.average_completion_rate?.toFixed(1) || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}