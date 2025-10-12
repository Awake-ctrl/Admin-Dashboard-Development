import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Trophy, Medal, Award, TrendingUp, Users, Target, Crown, Star, RefreshCw } from "lucide-react";
import { fetchLeaderboardData, LeaderboardUser } from "./api/leaderboardAPi";

const examTypes = ["all", "jee", "neet", "cat", "upsc"];

export function LeaderboardManagement() {
  const [selectedExam, setSelectedExam] = useState("all");
  const [timeframe, setTimeframe] = useState("all-time");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLeaderboardData();
      setLeaderboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected timeframe
  const filterByTimeframe = (users: LeaderboardUser[], timeframe: string): LeaderboardUser[] => {
    const now = new Date();
    
    switch (timeframe) {
      case "today":
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return users.filter(user => new Date(user.lastActive) >= today);
      
      case "this-week":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0);
        return users.filter(user => new Date(user.lastActive) >= startOfWeek);
      
      case "this-month":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return users.filter(user => new Date(user.lastActive) >= startOfMonth);
      
      case "all-time":
      default:
        return users;
    }
  };

  // Apply both exam and timeframe filters
  const filteredData = leaderboardData
    .filter(user => selectedExam === "all" || user.exam === selectedExam)
    .filter(user => {
      if (timeframe === "all-time") return true;
      return filterByTimeframe([user], timeframe).length > 0;
    })
    // Recalculate ranks after filtering
    .sort((a, b) => b.score - a.score)
    .map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-yellow-600">Top 3</Badge>;
    } else if (rank <= 10) {
      return <Badge variant="secondary">Top 10</Badge>;
    } else if (rank <= 50) {
      return <Badge variant="outline">Top 50</Badge>;
    }
    return null;
  };

  const totalUsers = filteredData.length;
  const averageScore = filteredData.reduce((sum, user) => sum + user.score, 0) / totalUsers || 0;
  const topPerformerScore = filteredData[0]?.score || 0;
  const averageAccuracy = filteredData.reduce((sum, user) => sum + user.accuracy, 0) / totalUsers || 0;

  // Get timeframe description for display
  const getTimeframeDescription = () => {
    switch (timeframe) {
      case "today":
        return "Today's activity";
      case "this-week":
        return "This week's activity";
      case "this-month":
        return "This month's activity";
      case "all-time":
      default:
        return "All time performance";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="text-muted-foreground">Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-destructive">Error loading leaderboard</div>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={loadLeaderboardData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            {getTimeframeDescription()} • {filteredData.length} students
          </p>
        </div>
        <Button onClick={loadLeaderboardData} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {timeframe !== "all-time" ? `Active ${timeframe.replace('-', ' ')}` : 'On leaderboard'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Top Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{topPerformerScore.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredData[0]?.userName || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{Math.round(averageScore).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across filtered students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{averageAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Question accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard Filters</CardTitle>
          <CardDescription>
            Filter the leaderboard by exam type and timeframe • Showing {filteredData.length} students
          </CardDescription>
       </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="grid gap-2">
              <label className="text-sm">Exam Type</label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  <SelectItem value="jee">JEE Main & Advanced</SelectItem>
                  <SelectItem value="neet">NEET</SelectItem>
                  <SelectItem value="cat">CAT</SelectItem>
                  <SelectItem value="upsc">UPSC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="leaderboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          {/* Top 3 Podium */}
          {filteredData.length >= 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Performers - {getTimeframeDescription()}</CardTitle>
                <CardDescription>The highest scoring students in the selected timeframe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-end gap-8 py-8">
                  {/* 2nd Place */}
                  {filteredData[1] && (
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={filteredData[1].avatar} />
                        <AvatarFallback>{filteredData[1].userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Medal className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm">{filteredData[1].userName}</p>
                        <p className="text-xs text-muted-foreground">{filteredData[1].score.toLocaleString()} pts</p>
                      </div>
                      <div className="w-20 h-16 bg-gray-200 rounded-t-lg flex items-end justify-center pb-2">
                        <span className="text-2xl">2</span>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {filteredData[0] && (
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="w-20 h-20 ring-4 ring-yellow-400">
                        <AvatarImage src={filteredData[0].avatar} />
                        <AvatarFallback>{filteredData[0].userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Crown className="w-8 h-8 text-yellow-500" />
                        </div>
                        <p>{filteredData[0].userName}</p>
                        <p className="text-sm text-muted-foreground">{filteredData[0].score.toLocaleString()} pts</p>
                      </div>
                      <div className="w-24 h-20 bg-yellow-200 rounded-t-lg flex items-end justify-center pb-2">
                        <span className="text-3xl">1</span>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {filteredData[2] && (
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={filteredData[2].avatar} />
                        <AvatarFallback>{filteredData[2].userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Award className="w-6 h-6 text-amber-600" />
                        </div>
                        <p className="text-sm">{filteredData[2].userName}</p>
                        <p className="text-xs text-muted-foreground">{filteredData[2].score.toLocaleString()} pts</p>
                      </div>
                      <div className="w-20 h-12 bg-amber-200 rounded-t-lg flex items-end justify-center pb-2">
                        <span className="text-2xl">3</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Leaderboard - {getTimeframeDescription()}</CardTitle>
              <CardDescription>
                {filteredData.length} students ranked by their scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students found for the selected filters.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Streak</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((user) => (
                      <TableRow key={user.id} className={user.rank <= 3 ? "bg-muted/50" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRankIcon(user.rank)}
                            {getRankBadge(user.rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{user.userName}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.score.toLocaleString()} pts
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{user.accuracy}%</span>
                            <div className="w-12 h-2 bg-muted rounded-full">
                              <div 
                                className="h-2 bg-green-500 rounded-full" 
                                style={{ width: `${Math.min(user.accuracy, 100)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.questionsCorrect}/{user.questionsAttempted}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.streak >= 10 ? "default" : "outline"}>
                            {user.streak} day streak
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.preferredSubject}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            {new Date(user.lastActive).toLocaleDateString()}


                              <br />

                            <span className="text-xs">

                              {new Date(user.lastActive).toLocaleTimeString()}

                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>How scores are distributed across students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>2500+ (Excellent)</span>
                      <span>{filteredData.filter(u => u.score >= 2500).length} students</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(filteredData.filter(u => u.score >= 2500).length / totalUsers) * 100}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>2000-2499 (Good)</span>
                      <span>{filteredData.filter(u => u.score >= 2000 && u.score < 2500).length} students</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(filteredData.filter(u => u.score >= 2000 && u.score < 2500).length / totalUsers) * 100}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>1500-1999 (Average)</span>
                      <span>{filteredData.filter(u => u.score >= 1500 && u.score < 2000).length} students</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(filteredData.filter(u => u.score >= 1500 && u.score < 2000).length / totalUsers) * 100}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Below 1500</span>
                      <span>{filteredData.filter(u => u.score < 1500).length} students</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(filteredData.filter(u => u.score < 1500).length / totalUsers) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Preferences</CardTitle>
                <CardDescription>Most popular subjects among top performers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Physics", "Mathematics", "Chemistry", "Biology", "Quantitative Aptitude", "Verbal Ability", "History", "Geography"].map((subject) => {
                    const count = filteredData.filter(u => u.preferredSubject === subject).length;
                    const percentage = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
                    
                    return count > 0 ? (
                      <div key={subject} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{subject}</span>
                          <span>{count} students ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  High Achievers
                </CardTitle>
                <CardDescription>Students with exceptional performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredData.filter(u => u.score >= 2500).slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{user.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm">{user.userName}</div>
                        <div className="text-xs text-muted-foreground">{user.score} pts</div>
                      </div>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                  ))}
                  {filteredData.filter(u => u.score >= 2500).length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No high achievers found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Consistency Champions
                </CardTitle>
                <CardDescription>Longest learning streaks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredData.sort((a, b) => b.streak - a.streak).slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{user.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm">{user.userName}</div>
                        <div className="text-xs text-muted-foreground">{user.streak} day streak</div>
                      </div>
                      <Badge variant="secondary">{user.streak} days</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Accuracy Masters
                </CardTitle>
                <CardDescription>Highest question accuracy rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredData.sort((a, b) => b.accuracy - a.accuracy).slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{user.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm">{user.userName}</div>
                        <div className="text-xs text-muted-foreground">{user.accuracy}% accuracy</div>
                      </div>
                      <Badge variant="outline">{user.accuracy}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}