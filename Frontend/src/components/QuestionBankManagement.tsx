import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Plus, Edit, Trash2, FileQuestion, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

// Mock data based on your QuestionBank model
const questions = [
  {
    id: 1,
    question: "A ball is thrown vertically upward with an initial velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
    choices: ["10 m", "20 m", "30 m", "40 m"],
    answer: 1, // Index 1 = "20 m"
    userId: 1001,
    userName: "John Doe",
    point: 5,
    timestamp: "2025-01-14T10:30:00Z",
    userAns: 1,
    attempted: true,
    subject: "Physics",
    topic: "Mechanics",
    difficulty: "Medium"
  },
  {
    id: 2,
    question: "What is the derivative of x³ + 2x² - 5x + 1?",
    choices: ["3x² + 4x - 5", "3x² + 2x - 5", "x³ + 4x - 5", "3x + 4x - 5"],
    answer: 0,
    userId: 1002,
    userName: "Jane Smith",
    point: 3,
    timestamp: "2025-01-14T09:15:00Z",
    userAns: 0,
    attempted: true,
    subject: "Mathematics",
    topic: "Calculus",
    difficulty: "Easy"
  },
  {
    id: 3,
    question: "Which of the following is an alkane?",
    choices: ["C₂H₄", "C₂H₂", "C₂H₆", "C₆H₆"],
    answer: 2,
    userId: 1003,
    userName: "Mike Johnson",
    point: 0,
    timestamp: "2025-01-14T08:45:00Z",
    userAns: 0,
    attempted: true,
    subject: "Chemistry",
    topic: "Organic Chemistry",
    difficulty: "Easy"
  },
  {
    id: 4,
    question: "Calculate the limit: lim(x→0) (sin x)/x",
    choices: ["0", "1", "∞", "undefined"],
    answer: 1,
    userId: 1004,
    userName: "Sarah Wilson",
    point: 0,
    timestamp: "2025-01-13T14:20:00Z",
    userAns: null,
    attempted: false,
    subject: "Mathematics",
    topic: "Limits",
    difficulty: "Hard"
  }
];

const subjects = ["Physics", "Mathematics", "Chemistry", "Biology"];
const difficulties = ["Easy", "Medium", "Hard"];

export function QuestionBankManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const filteredQuestions = questions.filter(question => {
    return (filterSubject === "all" || question.subject === filterSubject) &&
           (filterDifficulty === "all" || question.difficulty === filterDifficulty);
  });

  const totalQuestions = questions.length;
  const attemptedQuestions = questions.filter(q => q.attempted).length;
  const correctAnswers = questions.filter(q => q.attempted && q.userAns === q.answer).length;
  const averageScore = questions.filter(q => q.attempted).reduce((sum, q) => sum + q.point, 0) / attemptedQuestions || 0;

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return <Badge variant="secondary">Easy</Badge>;
      case "Medium":
        return <Badge variant="default">Medium</Badge>;
      case "Hard":
        return <Badge variant="destructive">Hard</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const getAnswerStatus = (question: any) => {
    if (!question.attempted) {
      return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Not Attempted</Badge>;
    }
    if (question.userAns === question.answer) {
      return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Correct</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Incorrect</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Attempted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{attemptedQuestions}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((attemptedQuestions / totalQuestions) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{Math.round((correctAnswers / attemptedQuestions) * 100) || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {correctAnswers} out of {attemptedQuestions}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Points per question
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="questions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="questions">Question Bank</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="create">Create Question</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3>Question Bank</h3>
              <p className="text-muted-foreground">Manage assessment questions and track student performance</p>
            </div>
            <div className="flex gap-3">
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{question.question}</div>
                      </TableCell>
                      <TableCell>{question.subject}</TableCell>
                      <TableCell>{question.topic}</TableCell>
                      <TableCell>{getDifficultyBadge(question.difficulty)}</TableCell>
                      <TableCell>{question.userName}</TableCell>
                      <TableCell>{getAnswerStatus(question)}</TableCell>
                      <TableCell>{question.point} pts</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedQuestion(question);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Subject</CardTitle>
                <CardDescription>Average scores across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map((subject) => {
                    const subjectQuestions = questions.filter(q => q.subject === subject && q.attempted);
                    const avgScore = subjectQuestions.reduce((sum, q) => sum + q.point, 0) / subjectQuestions.length || 0;
                    const accuracy = subjectQuestions.filter(q => q.userAns === q.answer).length / subjectQuestions.length * 100 || 0;
                    
                    return (
                      <div key={subject} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{subject}</span>
                          <span>{avgScore.toFixed(1)} pts ({accuracy.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${accuracy}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Difficulty Distribution</CardTitle>
                <CardDescription>Question distribution by difficulty level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {difficulties.map((difficulty) => {
                    const count = questions.filter(q => q.difficulty === difficulty).length;
                    const percentage = (count / totalQuestions) * 100;
                    
                    return (
                      <div key={difficulty} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getDifficultyBadge(difficulty)}
                          <span>{count} questions</span>
                        </div>
                        <span>{percentage.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Student Performance</CardTitle>
              <CardDescription>Latest question attempts and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.filter(q => q.attempted).slice(0, 5).map((question) => (
                  <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {question.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="truncate max-w-md">{question.question}</div>
                        <div className="text-sm text-muted-foreground">
                          {question.userName} • {question.subject} • {new Date(question.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getAnswerStatus(question)}
                      <span className="text-sm">{question.point} pts</span>
                      {getDifficultyBadge(question.difficulty)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Question</CardTitle>
              <CardDescription>Add a new question to the assessment bank</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="topic">Topic</Label>
                <Input id="topic" placeholder="Enter topic (e.g., Mechanics, Calculus)" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="question">Question</Label>
                <Textarea 
                  id="question" 
                  placeholder="Enter your question here..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-4">
                <Label>Answer Choices</Label>
                <RadioGroup defaultValue="0">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <RadioGroupItem value={index.toString()} id={`choice-${index}`} />
                      <Label htmlFor={`choice-${index}`} className="flex-1">
                        <Input placeholder={`Choice ${index + 1}`} />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">Select the correct answer by clicking the radio button</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="points">Points</Label>
                <Input id="points" type="number" placeholder="Points for correct answer" defaultValue="1" />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Preview</Button>
                <Button>Create Question</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Question Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
            <DialogDescription>View and edit question information</DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Question</Label>
                <Textarea defaultValue={selectedQuestion.question} />
              </div>
              
              <div className="space-y-2">
                <Label>Choices</Label>
                {selectedQuestion.choices.map((choice: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      index === selectedQuestion.answer ? 'bg-green-100 text-green-800' : 'bg-muted'
                    }`}>
                      {index === selectedQuestion.answer ? '✓' : String.fromCharCode(65 + index)}
                    </div>
                    <Input defaultValue={choice} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Subject</Label>
                  <p>{selectedQuestion.subject}</p>
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <div className="mt-1">{getDifficultyBadge(selectedQuestion.difficulty)}</div>
                </div>
                <div>
                  <Label>Points</Label>
                  <p>{selectedQuestion.point}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsDialogOpen(false)}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}