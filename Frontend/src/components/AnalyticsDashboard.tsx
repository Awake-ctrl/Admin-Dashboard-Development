import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const enrollmentData = [
  { name: "Jan", enrollments: 45, completions: 32 },
  { name: "Feb", enrollments: 52, completions: 38 },
  { name: "Mar", enrollments: 48, completions: 41 },
  { name: "Apr", enrollments: 61, completions: 45 },
  { name: "May", enrollments: 55, completions: 42 },
  { name: "Jun", enrollments: 67, completions: 50 },
];

const coursePerformance = [
  { name: "React Intro", students: 245, completion: 85, rating: 4.5 },
  { name: "Advanced JS", students: 189, completion: 92, rating: 4.2 },
  { name: "UI/UX Design", students: 156, completion: 45, rating: 4.0 },
  { name: "Data Science", students: 203, completion: 78, rating: 4.3 },
  { name: "ML Intro", students: 134, completion: 100, rating: 3.8 },
];

const deviceUsage = [
  { name: "Desktop", value: 65, color: "var(--chart-1)" },
  { name: "Mobile", value: 28, color: "var(--chart-2)" },
  { name: "Tablet", value: 7, color: "var(--chart-3)" },
];

const engagementData = [
  { name: "Week 1", videoViews: 1200, forumPosts: 45, assignments: 89 },
  { name: "Week 2", videoViews: 1150, forumPosts: 52, assignments: 92 },
  { name: "Week 3", videoViews: 1300, forumPosts: 38, assignments: 87 },
  { name: "Week 4", videoViews: 1180, forumPosts: 61, assignments: 95 },
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">2,847</div>
            <p className="text-xs text-green-600">+12% vs last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Course Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">78%</div>
            <p className="text-xs text-green-600">+5% vs last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">4.2/5</div>
            <p className="text-xs text-green-600">+0.3 vs last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">$54,321</div>
            <p className="text-xs text-green-600">+8% vs last month</p>
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
                />
                <Line 
                  type="monotone" 
                  dataKey="completions" 
                  stroke="var(--chart-2)" 
                  strokeWidth={2}
                  name="Completions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Usage Distribution</CardTitle>
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
                >
                  {deviceUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
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
                  name="completion"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
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
                  name="Video Views"
                />
                <Line 
                  type="monotone" 
                  dataKey="forumPosts" 
                  stroke="var(--chart-5)" 
                  strokeWidth={2}
                  name="Forum Posts"
                />
                <Line 
                  type="monotone" 
                  dataKey="assignments" 
                  stroke="var(--chart-1)" 
                  strokeWidth={2}
                  name="Assignments"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}