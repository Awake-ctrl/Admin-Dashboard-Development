import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MessageSquare, Clock, Users, TrendingUp, Brain, Eye, Download, Filter } from "lucide-react";

// Mock data based on your Session and Chat models
const sessions = [
  {
    id: 1,
    title: "Physics - Mechanics Problem Solving",
    tag: "physics_mechanics_001",
    userId: 1001,
    userName: "John Doe",
    userEmail: "john@example.com",
    timestamp: "2025-01-14T10:30:00Z",
    messageCount: 15,
    duration: 45, // minutes
    status: "completed",
    topics: ["Mechanics", "Newton's Laws"],
    tokenUsage: {
      openai: 2500,
      gemini: 1800
    }
  },
  {
    id: 2,
    title: "Chemistry - Organic Reactions",
    tag: "chemistry_organic_002",
    userId: 1002,
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    timestamp: "2025-01-14T09:15:00Z",
    messageCount: 23,
    duration: 62,
    status: "active",
    topics: ["Organic Chemistry", "Reactions"],
    tokenUsage: {
      openai: 3200,
      gemini: 2100
    }
  },
  {
    id: 3,
    title: "Mathematics - Calculus Integration",
    tag: "math_calculus_003",
    userId: 1003,
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    timestamp: "2025-01-14T08:45:00Z",
    messageCount: 8,
    duration: 28,
    status: "paused",
    topics: ["Calculus", "Integration"],
    tokenUsage: {
      openai: 1200,
      gemini: 900
    }
  }
];

const chatMessages = [
  {
    id: 1,
    sessionId: 1,
    role: "user",
    text: "Can you help me understand Newton's second law?",
    timestamp: "2025-01-14T10:30:00Z",
    like: false,
    dislike: false
  },
  {
    id: 2,
    sessionId: 1,
    role: "assistant",
    text: "Newton's second law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The formula is F = ma, where F is force, m is mass, and a is acceleration.",
    timestamp: "2025-01-14T10:31:00Z",
    like: true,
    dislike: false
  },
  {
    id: 3,
    sessionId: 1,
    role: "user",
    text: "Can you give me a practical example?",
    timestamp: "2025-01-14T10:32:00Z",
    like: false,
    dislike: false
  },
  {
    id: 4,
    sessionId: 1,
    role: "assistant",
    text: "Sure! Imagine pushing a shopping cart. If you push with more force (F), the cart accelerates more. If the cart is loaded with groceries (more mass m), you need more force to achieve the same acceleration. This demonstrates F = ma in everyday life.",
    timestamp: "2025-01-14T10:33:00Z",
    like: true,
    dislike: false
  }
];

export function SessionsManagement() {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "paused":
        return <Badge variant="outline">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredSessions = sessions.filter(session => 
    filterStatus === "all" || session.status === filterStatus
  );

  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s => s.status === "active").length;
  const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
  const totalTokens = sessions.reduce((sum, s) => sum + s.tokenUsage.openai + s.tokenUsage.gemini, 0);

  const viewSessionDetails = (session: any) => {
    setSelectedSession(session);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Students learning now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{Math.round(avgDuration)}m</div>
            <p className="text-xs text-muted-foreground">
              Per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Token Usage</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{(totalTokens / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground">
              AI tokens consumed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3>AI Learning Sessions</h3>
              <p className="text-muted-foreground">Monitor and manage student AI tutoring sessions</p>
            </div>
            <div className="flex gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Session Title</TableHead>
                    <TableHead>Topics</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="" />
                            <AvatarFallback>{session.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{session.userName}</div>
                            <div className="text-xs text-muted-foreground">{session.userEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{session.title}</div>
                        <div className="text-xs text-muted-foreground">{session.tag}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {session.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{session.duration}m</TableCell>
                      <TableCell>{session.messageCount}</TableCell>
                      <TableCell>{getStatusBadge(session.status)}</TableCell>
                      <TableCell>{new Date(session.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewSessionDetails(session)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>Complete history of all learning sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{session.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{session.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {session.userName} • {new Date(session.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <div>{session.messageCount} messages</div>
                        <div className="text-muted-foreground">{session.duration}m duration</div>
                      </div>
                      {getStatusBadge(session.status)}
                      <Button variant="outline" size="sm" onClick={() => viewSessionDetails(session)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage by Subject</CardTitle>
                <CardDescription>Session distribution across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Physics</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-chart-1 h-2 rounded-full" style={{ width: "45%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Mathematics</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-chart-2 h-2 rounded-full" style={{ width: "35%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Chemistry</span>
                      <span>20%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-chart-3 h-2 rounded-full" style={{ width: "20%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Usage Breakdown</CardTitle>
                <CardDescription>AI model token consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-1" />
                      <span>OpenAI</span>
                    </div>
                    <span>6.9k tokens</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-2" />
                      <span>Gemini</span>
                    </div>
                    <span>4.8k tokens</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Total Cost (Est.)</span>
                      <span>$2.34</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Session Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>
              {selectedSession?.title} - {selectedSession?.userName}
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student</Label>
                  <p>{selectedSession.userName} ({selectedSession.userEmail})</p>
                </div>
                <div>
                  <Label>Duration</Label>
                  <p>{selectedSession.duration} minutes</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedSession.status)}</div>
                </div>
                <div>
                  <Label>Token Usage</Label>
                  <p>OpenAI: {selectedSession.tokenUsage.openai}, Gemini: {selectedSession.tokenUsage.gemini}</p>
                </div>
              </div>
              
              <div>
                <Label>Chat Messages</Label>
                <ScrollArea className="h-64 w-full border rounded-md p-4 mt-2">
                  <div className="space-y-4">
                    {chatMessages.filter(msg => msg.sessionId === selectedSession.id).map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                            {message.role === 'assistant' && (
                              <div className="flex gap-2">
                                {message.like && <span>👍</span>}
                                {message.dislike && <span>👎</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}