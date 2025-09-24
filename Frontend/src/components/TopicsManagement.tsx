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
import { Tree, TreeItem } from "./ui/tree";
import { BookOpen, Plus, Edit, Trash2, Users, TrendingUp, Target, Brain } from "lucide-react";

// Mock data based on your models - All exam types from your model.py
const exams = [
  {
    name: "jee",
    displayName: "JEE Main & Advanced",
    subjects: [
      {
        id: 1,
        name: "Physics",
        topicsCount: 45,
        topics: [
          { id: "phy_001", name: "Mechanics", description: "Laws of motion, work energy", userCount: 234 },
          { id: "phy_002", name: "Thermodynamics", description: "Heat and thermal processes", userCount: 189 },
          { id: "phy_003", name: "Electromagnetism", description: "Electric and magnetic fields", userCount: 156 }
        ]
      },
      {
        id: 2,
        name: "Chemistry",
        topicsCount: 38,
        topics: [
          { id: "chem_001", name: "Organic Chemistry", description: "Carbon compounds and reactions", userCount: 201 },
          { id: "chem_002", name: "Inorganic Chemistry", description: "Elements and compounds", userCount: 178 }
        ]
      },
      {
        id: 3,
        name: "Mathematics",
        topicsCount: 52,
        topics: [
          { id: "math_001", name: "Calculus", description: "Differentiation and integration", userCount: 289 },
          { id: "math_002", name: "Algebra", description: "Equations and inequalities", userCount: 245 }
        ]
      }
    ]
  },
  {
    name: "neet",
    displayName: "NEET",
    subjects: [
      {
        id: 4,
        name: "Biology",
        topicsCount: 67,
        topics: [
          { id: "bio_001", name: "Cell Biology", description: "Structure and function of cells", userCount: 312 },
          { id: "bio_002", name: "Genetics", description: "Heredity and variation", userCount: 278 }
        ]
      },
      {
        id: 5,
        name: "Physics",
        topicsCount: 41,
        topics: [
          { id: "phy_004", name: "Optics", description: "Light and optical instruments", userCount: 198 }
        ]
      },
      {
        id: 6,
        name: "Chemistry",
        topicsCount: 39,
        topics: [
          { id: "chem_003", name: "Biochemistry", description: "Chemical processes in living organisms", userCount: 165 }
        ]
      }
    ]
  },
  {
    name: "cat",
    displayName: "CAT",
    subjects: [
      {
        id: 7,
        name: "Quantitative Aptitude",
        topicsCount: 32,
        topics: [
          { id: "quant_001", name: "Arithmetic", description: "Basic mathematical operations", userCount: 145 },
          { id: "quant_002", name: "Algebra", description: "Linear and quadratic equations", userCount: 132 }
        ]
      },
      {
        id: 8,
        name: "Verbal Ability",
        topicsCount: 28,
        topics: [
          { id: "verbal_001", name: "Reading Comprehension", description: "Text analysis and understanding", userCount: 156 },
          { id: "verbal_002", name: "Grammar", description: "English language rules", userCount: 143 }
        ]
      },
      {
        id: 9,
        name: "Data Interpretation",
        topicsCount: 25,
        topics: [
          { id: "di_001", name: "Tables and Charts", description: "Data analysis from tables", userCount: 128 }
        ]
      },
      {
        id: 10,
        name: "Logical Reasoning",
        topicsCount: 30,
        topics: [
          { id: "lr_001", name: "Critical Reasoning", description: "Logical analysis of arguments", userCount: 134 }
        ]
      }
    ]
  },
  {
    name: "upsc",
    displayName: "UPSC",
    subjects: [
      {
        id: 11,
        name: "History",
        topicsCount: 45,
        topics: [
          { id: "hist_001", name: "Ancient India", description: "Indus Valley to Mauryan period", userCount: 89 },
          { id: "hist_002", name: "Medieval India", description: "Delhi Sultanate to Mughal empire", userCount: 76 }
        ]
      },
      {
        id: 12,
        name: "Geography",
        topicsCount: 38,
        topics: [
          { id: "geo_001", name: "Physical Geography", description: "Earth's physical features", userCount: 92 },
          { id: "geo_002", name: "Indian Geography", description: "Physical and economic geography of India", userCount: 87 }
        ]
      },
      {
        id: 13,
        name: "Polity",
        topicsCount: 42,
        topics: [
          { id: "pol_001", name: "Constitution", description: "Indian constitutional framework", userCount: 95 }
        ]
      },
      {
        id: 14,
        name: "Economics",
        topicsCount: 35,
        topics: [
          { id: "eco_001", name: "Microeconomics", description: "Individual economic behavior", userCount: 78 }
        ]
      },
      {
        id: 15,
        name: "Science & Technology",
        topicsCount: 40,
        topics: [
          { id: "sci_001", name: "Space Technology", description: "Satellites and space missions", userCount: 82 }
        ]
      },
      {
        id: 16,
        name: "Current Affairs",
        topicsCount: 50,
        topics: [
          { id: "curr_001", name: "National Issues", description: "Current national developments", userCount: 110 }
        ]
      }
    ]
  },
  {
    name: "gate",
    displayName: "GATE",
    subjects: [
      {
        id: 17,
        name: "Engineering Mathematics",
        topicsCount: 35,
        topics: [
          { id: "engmath_001", name: "Linear Algebra", description: "Matrix theory and applications", userCount: 156 },
          { id: "engmath_002", name: "Calculus", description: "Differential and integral calculus", userCount: 142 }
        ]
      },
      {
        id: 18,
        name: "General Aptitude",
        topicsCount: 25,
        topics: [
          { id: "aptitude_001", name: "Verbal Ability", description: "English comprehension and grammar", userCount: 134 },
          { id: "aptitude_002", name: "Numerical Ability", description: "Mathematical reasoning", userCount: 128 }
        ]
      },
      {
        id: 19,
        name: "Computer Science",
        topicsCount: 55,
        topics: [
          { id: "cs_001", name: "Data Structures", description: "Arrays, trees, graphs", userCount: 189 },
          { id: "cs_002", name: "Algorithms", description: "Sorting, searching, optimization", userCount: 176 }
        ]
      },
      {
        id: 20,
        name: "Electronics",
        topicsCount: 48,
        topics: [
          { id: "ece_001", name: "Digital Circuits", description: "Logic gates and circuits", userCount: 145 }
        ]
      }
    ]
  },
  {
    name: "other_govt_exam",
    displayName: "Other Govt Exams",
    subjects: [
      {
        id: 21,
        name: "Quantitative Aptitude",
        topicsCount: 30,
        topics: [
          { id: "bank_quant_001", name: "Number Systems", description: "Properties of numbers", userCount: 167 },
          { id: "bank_quant_002", name: "Percentage", description: "Percentage calculations", userCount: 154 }
        ]
      },
      {
        id: 22,
        name: "English Language",
        topicsCount: 25,
        topics: [
          { id: "bank_eng_001", name: "Grammar", description: "English grammar rules", userCount: 142 },
          { id: "bank_eng_002", name: "Vocabulary", description: "Word meanings and usage", userCount: 139 }
        ]
      },
      {
        id: 23,
        name: "Reasoning",
        topicsCount: 35,
        topics: [
          { id: "bank_reason_001", name: "Logical Reasoning", description: "Pattern recognition", userCount: 158 },
          { id: "bank_reason_002", name: "Verbal Reasoning", description: "Analytical reasoning", userCount: 146 }
        ]
      },
      {
        id: 24,
        name: "General Awareness",
        topicsCount: 40,
        topics: [
          { id: "bank_gk_001", name: "Banking Awareness", description: "Banking terms and concepts", userCount: 172 },
          { id: "bank_gk_002", name: "Current Affairs", description: "Recent developments", userCount: 165 }
        ]
      }
    ]
  }
];

export function TopicsManagement() {
  const [selectedExam, setSelectedExam] = useState("jee");
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  const currentExam = exams.find(exam => exam.name === selectedExam);
  const totalTopics = currentExam?.subjects.reduce((sum, subject) => sum + subject.topicsCount, 0) || 0;
  const totalEngagement = currentExam?.subjects.reduce((sum, subject) => 
    sum + subject.topics.reduce((topicSum, topic) => topicSum + topic.userCount, 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{currentExam?.subjects.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across {exams.length} exam categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Topics</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalTopics}</div>
            <p className="text-xs text-muted-foreground">
              For {selectedExam.toUpperCase()} preparation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Student Engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalEngagement.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Active learning sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">AI Sessions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">2,847</div>
            <p className="text-xs text-muted-foreground">
              +18% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Exam Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exam Category</CardTitle>
          <CardDescription>Choose an exam to manage its subjects and topics</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.name} value={exam.name}>
                  {exam.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3>Subjects for {currentExam?.displayName}</h3>
              <p className="text-muted-foreground">Manage subjects and their topic organization</p>
            </div>
            <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedSubject(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedSubject ? "Edit Subject" : "Create New Subject"}</DialogTitle>
                  <DialogDescription>
                    {selectedSubject ? "Modify the subject details" : "Add a new subject to the exam"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject-name">Subject Name</Label>
                    <Input id="subject-name" defaultValue={selectedSubject?.name || ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="exam-category">Exam Category</Label>
                    <Select defaultValue={selectedExam}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {exams.map((exam) => (
                          <SelectItem key={exam.name} value={exam.name}>
                            {exam.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsSubjectDialogOpen(false)}>Save Subject</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentExam?.subjects.map((subject) => (
              <Card key={subject.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{subject.name}</CardTitle>
                      <CardDescription>{subject.topicsCount} topics</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSubject(subject);
                        setIsSubjectDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {subject.topics.slice(0, 3).map((topic) => (
                      <div key={topic.id} className="flex justify-between text-sm">
                        <span className="truncate">{topic.name}</span>
                        <Badge variant="secondary">{topic.userCount}</Badge>
                      </div>
                    ))}
                    {subject.topics.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{subject.topics.length - 3} more topics
                      </p>
                    )}
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    Manage Topics
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3>Topics Management</h3>
              <p className="text-muted-foreground">Create and organize learning topics</p>
            </div>
            <Dialog open={isTopicDialogOpen} onOpenChange={setIsTopicDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedTopic(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedTopic ? "Edit Topic" : "Create New Topic"}</DialogTitle>
                  <DialogDescription>
                    {selectedTopic ? "Modify the topic details" : "Add a new topic to the subject"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="topic-name">Topic Name</Label>
                    <Input id="topic-name" defaultValue={selectedTopic?.name || ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="topic-subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentExam?.subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="topic-description">Description</Label>
                    <Textarea 
                      id="topic-description" 
                      placeholder="Brief description of the topic"
                      defaultValue={selectedTopic?.description || ""} 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsTopicDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsTopicDialogOpen(false)}>Save Topic</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Student Engagement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentExam?.subjects.flatMap(subject => 
                    subject.topics.map(topic => (
                      <TableRow key={topic.id}>
                        <TableCell>{topic.name}</TableCell>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{topic.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{topic.userCount} students</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTopic(topic);
                                setIsTopicDialogOpen(true);
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
                <CardDescription>Most engaged topics this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentExam?.subjects.flatMap(subject => subject.topics)
                    .sort((a, b) => b.userCount - a.userCount)
                    .slice(0, 5)
                    .map((topic, index) => (
                      <div key={topic.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                          <span>{topic.name}</span>
                        </div>
                        <Badge variant="secondary">{topic.userCount}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>Topic count by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentExam?.subjects.map((subject) => (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span>{subject.name}</span>
                        <span>{subject.topicsCount} topics</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(subject.topicsCount / totalTopics) * 100}%` }}
                        />
                      </div>
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