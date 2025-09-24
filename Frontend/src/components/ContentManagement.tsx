import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MoreHorizontal, Edit, Trash2, Download, Upload, FileText, Video, Image, Link, Eye, History } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const content = [
  {
    id: 1,
    title: "JEE Physics - Mechanics Study Guide",
    type: "document",
    course: "JEE Main & Advanced Preparation",
    size: "4.2 MB",
    downloads: 1289,
    status: "published",
    lastModified: "2025-01-15",
    author: "Dr. Priya Sharma",
    version: "2.1",
    subject: "Physics",
    examType: "jee",
    versions: [
      { version: "2.1", date: "2025-01-15", changes: "Updated formulas and examples", size: "4.2 MB" },
      { version: "2.0", date: "2025-01-10", changes: "Added practice problems", size: "4.0 MB" },
      { version: "1.0", date: "2024-12-01", changes: "Initial version", size: "3.8 MB" }
    ]
  },
  {
    id: 2,
    title: "NEET Biology - Cell Structure Lecture",
    type: "video",
    course: "NEET Preparation Course",
    size: "85.6 MB",
    downloads: 2134,
    status: "published",
    lastModified: "2025-01-14",
    author: "Dr. Rajesh Kumar",
    version: "1.2",
    subject: "Biology",
    examType: "neet",
    versions: [
      { version: "1.2", date: "2025-01-14", changes: "Enhanced visual diagrams", size: "85.6 MB" },
      { version: "1.0", date: "2024-12-20", changes: "Initial HD recording", size: "78.3 MB" }
    ]
  },
  {
    id: 3,
    title: "CAT Quantitative Aptitude - Practice Set 1",
    type: "quiz",
    course: "CAT Preparation",
    size: "1.2 MB",
    downloads: 956,
    status: "published",
    lastModified: "2025-01-12",
    author: "Prof. Anita Desai",
    version: "1.5",
    subject: "Quantitative Aptitude",
    examType: "cat",
    versions: [
      { version: "1.5", date: "2025-01-12", changes: "Added detailed solutions", size: "1.2 MB" },
      { version: "1.0", date: "2024-11-15", changes: "Initial version", size: "890 KB" }
    ]
  },
  {
    id: 4,
    title: "UPSC History - Ancient India Notes",
    type: "document",
    course: "UPSC Civil Services",
    size: "6.8 MB",
    downloads: 1567,
    status: "published",
    lastModified: "2025-01-10",
    author: "Dr. Vikram Singh",
    version: "3.0",
    subject: "History",
    examType: "upsc",
    versions: [
      { version: "3.0", date: "2025-01-10", changes: "Comprehensive revision with maps", size: "6.8 MB" },
      { version: "2.1", date: "2024-12-05", changes: "Added timeline charts", size: "5.9 MB" }
    ]
  },
  {
    id: 5,
    title: "GATE Mathematics - Linear Algebra Video Series",
    type: "video",
    course: "GATE Engineering",
    size: "120.4 MB",
    downloads: 876,
    status: "published",
    lastModified: "2025-01-08",
    author: "Prof. Suresh Gupta",
    version: "1.0",
    subject: "Engineering Mathematics",
    examType: "gate",
    versions: [
      { version: "1.0", date: "2025-01-08", changes: "Complete video series", size: "120.4 MB" }
    ]
  },
  {
    id: 6,
    title: "Banking Awareness - Current Affairs Quiz",
    type: "quiz",
    course: "Banking & SSC Exams",
    size: "750 KB",
    downloads: 1245,
    status: "published",
    lastModified: "2025-01-14",
    author: "Ms. Ritu Agarwal",
    version: "1.3",
    subject: "General Awareness",
    examType: "other_govt_exam",
    versions: [
      { version: "1.3", date: "2025-01-14", changes: "Updated with latest current affairs", size: "750 KB" }
    ]
  },
  {
    id: 7,
    title: "JEE Chemistry - Organic Reactions Flowchart",
    type: "image",
    course: "JEE Main & Advanced Preparation",
    size: "2.1 MB",
    downloads: 1834,
    status: "published",
    lastModified: "2025-01-11",
    author: "Dr. Priya Sharma",
    version: "1.0",
    subject: "Chemistry",
    examType: "jee",
    versions: [
      { version: "1.0", date: "2025-01-11", changes: "High-resolution flowchart", size: "2.1 MB" }
    ]
  },
  {
    id: 8,
    title: "NEET Physics - Optics Problem Solutions",
    type: "document",
    course: "NEET Preparation Course",
    size: "3.5 MB",
    downloads: 1123,
    status: "draft",
    lastModified: "2025-01-13",
    author: "Dr. Rajesh Kumar",
    version: "1.0",
    subject: "Physics",
    examType: "neet",
    versions: [
      { version: "1.0", date: "2025-01-13", changes: "Draft with 50 solved problems", size: "3.5 MB" }
    ]
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'document': return FileText;
    case 'video': return Video;
    case 'image': return Image;
    case 'quiz': return FileText;
    case 'link': return Link;
    default: return FileText;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800';
    case 'draft': return 'bg-yellow-100 text-yellow-800';
    case 'archived': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("content");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const UploadForm = ({ onSave }) => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      type: "document",
      course: "",
      file: null,
      tags: "",
      isPublic: false
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        setFormData(prev => ({ ...prev, file }));
        // Simulate upload progress
        setIsUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
          }
        }, 200);
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="content-title">Content Title</Label>
            <Input
              id="content-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter content title"
            />
          </div>
          <div>
            <Label htmlFor="content-type">Content Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">Document/PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="content-description">Description</Label>
          <Textarea
            id="content-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter content description..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="content-course">Assign to Course</Label>
          <Select value={formData.course} onValueChange={(value) => setFormData(prev => ({ ...prev, course: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jee-prep">JEE Main & Advanced Preparation</SelectItem>
              <SelectItem value="neet-prep">NEET Preparation Course</SelectItem>
              <SelectItem value="cat-prep">CAT Preparation</SelectItem>
              <SelectItem value="upsc-prep">UPSC Civil Services</SelectItem>
              <SelectItem value="gate-prep">GATE Engineering</SelectItem>
              <SelectItem value="banking-ssc">Banking & SSC Exams</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="file-upload">Upload File</Label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.mp4,.mov,.jpg,.jpeg,.png"
          />
          {isUploading && (
            <div className="mt-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Uploading... {uploadProgress}%</p>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="e.g., physics, mechanics, jee, practice-problems"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSave(formData);
            setIsUploadDialogOpen(false);
          }}>
            Upload Content
          </Button>
        </div>
      </div>
    );
  };

  const QuizForm = ({ quiz = null, onSave }) => {
    const [formData, setFormData] = useState({
      title: quiz?.title || "",
      description: quiz?.description || "",
      course: quiz?.course || "",
      timeLimit: quiz?.timeLimit || 30,
      passingScore: quiz?.passingScore || 70,
      questions: quiz?.questions || [
        { question: "", options: ["", "", "", ""], correctAnswer: 0 }
      ]
    });

    const addQuestion = () => {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]
      }));
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input
              id="quiz-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter quiz title"
            />
          </div>
          <div>
            <Label htmlFor="quiz-course">Course</Label>
            <Select value={formData.course} onValueChange={(value) => setFormData(prev => ({ ...prev, course: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jee-prep">JEE Main & Advanced Preparation</SelectItem>
                <SelectItem value="neet-prep">NEET Preparation Course</SelectItem>
                <SelectItem value="cat-prep">CAT Preparation</SelectItem>
                <SelectItem value="upsc-prep">UPSC Civil Services</SelectItem>
                <SelectItem value="gate-prep">GATE Engineering</SelectItem>
                <SelectItem value="banking-ssc">Banking & SSC Exams</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="quiz-description">Description</Label>
          <Textarea
            id="quiz-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter quiz description..."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="time-limit">Time Limit (minutes)</Label>
            <Input
              id="time-limit"
              type="number"
              value={formData.timeLimit}
              onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="passing-score">Passing Score (%)</Label>
            <Input
              id="passing-score"
              type="number"
              value={formData.passingScore}
              onChange={(e) => setFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Questions</Label>
            <Button variant="outline" size="sm" onClick={addQuestion}>
              Add Question
            </Button>
          </div>
          
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {formData.questions.map((q, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Input
                      placeholder={`Question ${index + 1}`}
                      value={q.question}
                      onChange={(e) => {
                        const newQuestions = [...formData.questions];
                        newQuestions[index].question = e.target.value;
                        setFormData(prev => ({ ...prev, questions: newQuestions }));
                      }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((option, optIndex) => (
                        <Input
                          key={optIndex}
                          placeholder={`Option ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newQuestions = [...formData.questions];
                            newQuestions[index].options[optIndex] = e.target.value;
                            setFormData(prev => ({ ...prev, questions: newQuestions }));
                          }}
                        />
                      ))}
                    </div>
                    <Select
                      value={q.correctAnswer.toString()}
                      onValueChange={(value) => {
                        const newQuestions = [...formData.questions];
                        newQuestions[index].correctAnswer = parseInt(value);
                        setFormData(prev => ({ ...prev, questions: newQuestions }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Option 1</SelectItem>
                        <SelectItem value="1">Option 2</SelectItem>
                        <SelectItem value="2">Option 3</SelectItem>
                        <SelectItem value="3">Option 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsCreateQuizOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSave(formData);
            setIsCreateQuizOpen(false);
          }}>
            {quiz ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Total Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">486</div>
            <p className="text-xs text-green-600">+34 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">245</div>
            <p className="text-xs text-muted-foreground">50% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">189</div>
            <p className="text-xs text-muted-foreground">39% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">3.2 GB</div>
            <p className="text-xs text-muted-foreground">64% of 5GB</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content Library</CardTitle>
            <div className="flex gap-2">
              <Dialog open={isCreateQuizOpen} onOpenChange={setIsCreateQuizOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Quiz</DialogTitle>
                  </DialogHeader>
                  <QuizForm onSave={(data) => console.log("Creating quiz:", data)} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload New Content</DialogTitle>
                  </DialogHeader>
                  <UploadForm onSave={(data) => console.log("Uploading content:", data)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">All Content</TabsTrigger>
              <TabsTrigger value="versions">Version History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content.map((item) => {
                    const TypeIcon = getTypeIcon(item.type);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <TypeIcon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="text-foreground">{item.title}</p>
                              <p className="text-muted-foreground text-xs capitalize">{item.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.course}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.author}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.size}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4 text-muted-foreground" />
                            <span>{item.downloads}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          v{item.version}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <History className="mr-2 h-4 w-4" />
                                Version History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="versions" className="space-y-4">
              <div className="space-y-4">
                {content.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {item.versions.map((version, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">v{version.version}</Badge>
                              <div>
                                <p className="text-foreground">{version.changes}</p>
                                <p className="text-muted-foreground text-xs">
                                  {version.date} • {version.size}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                Restore
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}