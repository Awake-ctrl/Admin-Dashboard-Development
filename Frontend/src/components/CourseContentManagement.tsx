import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  ChevronRight, 
  ArrowLeft, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Plus, 
  BookOpen, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Download, 
  Upload,
  FolderOpen,
  GraduationCap
} from "lucide-react";
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
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";

// Mock data
const courses = [
  {
    id: 1,
    title: "JEE Main & Advanced Preparation",
    description: "Complete preparation course for Joint Entrance Examination",
    examType: "JEE",
    enrolledStudents: 2847,
    instructor: "Dr. Priya Sharma",
    duration: "12 months",
    status: "active",
    price: 299,
    modules: [
      { 
        id: 1, 
        title: "Physics Fundamentals", 
        description: "Core physics concepts and problem solving",
        lessons: 25, 
        duration: "8 hours",
        order: 1,
        contents: [
          { id: 1, title: "Newton's Laws of Motion", type: "video", duration: "45 min", status: "published" },
          { id: 2, title: "Mechanics Practice Problems", type: "document", size: "2.4 MB", status: "published" },
          { id: 3, title: "Physics Quiz 1", type: "quiz", questions: 20, status: "published" }
        ]
      },
      { 
        id: 2, 
        title: "Chemistry Basics", 
        description: "Fundamental chemistry for JEE",
        lessons: 20, 
        duration: "6 hours",
        order: 2,
        contents: [
          { id: 4, title: "Organic Chemistry Introduction", type: "video", duration: "60 min", status: "published" },
          { id: 5, title: "Chemical Equations Guide", type: "document", size: "1.8 MB", status: "draft" }
        ]
      },
      { 
        id: 3, 
        title: "Mathematics Core", 
        description: "Advanced mathematics topics",
        lessons: 30, 
        duration: "10 hours",
        order: 3,
        contents: []
      }
    ]
  },
  {
    id: 2,
    title: "NEET Preparation Course",
    description: "National Eligibility cum Entrance Test for medical colleges",
    examType: "NEET",
    enrolledStudents: 1923,
    instructor: "Dr. Rajesh Kumar",
    duration: "10 months",
    status: "active",
    price: 399,
    modules: [
      { 
        id: 4, 
        title: "Biology Fundamentals", 
        description: "Cell structure and human anatomy",
        lessons: 35, 
        duration: "12 hours",
        order: 1,
        contents: [
          { id: 6, title: "Cell Biology Lecture", type: "video", duration: "55 min", status: "published" },
          { id: 7, title: "Human Anatomy Quiz", type: "quiz", questions: 30, status: "published" }
        ]
      },
      { 
        id: 5, 
        title: "Physics for NEET", 
        description: "Physics concepts for medical entrance",
        lessons: 20, 
        duration: "7 hours",
        order: 2,
        contents: []
      }
    ]
  },
  {
    id: 3,
    title: "CAT Preparation",
    description: "Common Admission Test for MBA programs",
    examType: "CAT",
    enrolledStudents: 1456,
    instructor: "Prof. Anita Desai",
    duration: "8 months",
    status: "active",
    price: 199,
    modules: [
      { 
        id: 7, 
        title: "Quantitative Aptitude", 
        description: "Mathematical problem solving",
        lessons: 22, 
        duration: "9 hours",
        order: 1,
        contents: []
      }
    ]
  },
  {
    id: 4,
    title: "UPSC Civil Services",
    description: "Union Public Service Commission examination preparation",
    examType: "UPSC",
    enrolledStudents: 987,
    instructor: "Dr. Vikram Singh",
    duration: "18 months",
    status: "active",
    price: 499,
    modules: [
      { 
        id: 10, 
        title: "History & Culture", 
        description: "Ancient to modern Indian history",
        lessons: 40, 
        duration: "15 hours",
        order: 1,
        contents: []
      }
    ]
  },
  {
    id: 5,
    title: "GATE Engineering",
    description: "Graduate Aptitude Test in Engineering",
    examType: "GATE",
    enrolledStudents: 1234,
    instructor: "Prof. Suresh Gupta",
    duration: "14 months",
    status: "active",
    price: 349,
    modules: []
  },
  {
    id: 6,
    title: "Banking & SSC Exams",
    description: "Preparation for various government banking and SSC examinations",
    examType: "OTHER_GOVT_EXAM",
    enrolledStudents: 1876,
    instructor: "Ms. Ritu Agarwal",
    duration: "10 months",
    status: "active",
    price: 249,
    modules: []
  }
];

const examTypes = [
  { value: "jee", label: "JEE Main & Advanced" },
  { value: "neet", label: "NEET" },
  { value: "cat", label: "CAT" },
  { value: "upsc", label: "UPSC" },
  { value: "gate", label: "GATE" },
  { value: "other_govt_exam", label: "Other Govt Exams" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'published': 
      return 'bg-green-100 text-green-800';
    case 'draft': 
      return 'bg-yellow-100 text-yellow-800';
    case 'archived': 
      return 'bg-gray-100 text-gray-800';
    default: 
      return 'bg-gray-100 text-gray-800';
  }
};

const getContentIcon = (type: string) => {
  switch (type) {
    case 'video': return Video;
    case 'document': return FileText;
    case 'quiz': return GraduationCap;
    case 'image': return ImageIcon;
    default: return FileText;
  }
};

export function CourseContentManagement() {
  const [view, setView] = useState<'courses' | 'modules' | 'content'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isUploadContentOpen, setIsUploadContentOpen] = useState(false);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setView('modules');
  };

  const handleModuleClick = (module: any) => {
    setSelectedModule(module);
    setView('content');
  };

  const handleBack = () => {
    if (view === 'content') {
      setSelectedModule(null);
      setView('modules');
    } else if (view === 'modules') {
      setSelectedCourse(null);
      setView('courses');
    }
  };

  const CourseForm = ({ course = null, onSave }) => {
    const [formData, setFormData] = useState({
      title: course?.title || "",
      description: course?.description || "",
      examType: course?.examType || "jee",
      instructor: course?.instructor || "",
      price: course?.price || 0,
      duration: course?.duration || "",
      status: course?.status || "draft"
    });

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter course title"
            />
          </div>
          <div>
            <Label htmlFor="examType">Exam Type</Label>
            <Select value={formData.examType} onValueChange={(value) => setFormData(prev => ({ ...prev, examType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((exam) => (
                  <SelectItem key={exam.value} value={exam.value}>{exam.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter course description..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              value={formData.instructor}
              onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
              placeholder="Instructor name"
            />
          </div>
          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 6 months"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsCreateCourseOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSave(formData);
            setIsCreateCourseOpen(false);
          }}>
            {course ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </div>
    );
  };

  const ModuleForm = ({ module = null, onSave }) => {
    const [formData, setFormData] = useState({
      title: module?.title || "",
      description: module?.description || "",
      order: module?.order || 1,
      duration: module?.duration || ""
    });

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="module-title">Module Title</Label>
          <Input
            id="module-title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter module title"
          />
        </div>

        <div>
          <Label htmlFor="module-description">Description</Label>
          <Textarea
            id="module-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter module description..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
              placeholder="1"
            />
          </div>
          <div>
            <Label htmlFor="module-duration">Estimated Duration</Label>
            <Input
              id="module-duration"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 2 hours"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsCreateModuleOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSave(formData);
            setIsCreateModuleOpen(false);
          }}>
            {module ? 'Update Module' : 'Create Module'}
          </Button>
        </div>
      </div>
    );
  };

  const UploadContentForm = ({ onSave }) => {
    const [formData, setFormData] = useState({
      title: "",
      type: "document",
      file: null
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        setFormData(prev => ({ ...prev, file }));
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

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsUploadContentOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSave(formData);
            setIsUploadContentOpen(false);
          }}>
            Upload Content
          </Button>
        </div>
      </div>
    );
  };

  const QuizForm = ({ onSave }) => {
    const [formData, setFormData] = useState({
      title: "",
      timeLimit: 30,
      passingScore: 70,
      questions: [
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
        <div>
          <Label htmlFor="quiz-title">Quiz Title</Label>
          <Input
            id="quiz-title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter quiz title"
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
            Create Quiz
          </Button>
        </div>
      </div>
    );
  };

  // COURSES LIST VIEW
  if (view === 'courses') {
    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{courses.length}</div>
              <p className="text-xs text-green-600">+{courses.filter(c => c.status === 'active').length} active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{courses.reduce((sum, course) => sum + course.enrolledStudents, 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{courses.reduce((sum, course) => sum + course.modules.length, 0)}</div>
              <p className="text-xs text-muted-foreground">Learning modules</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">₹{Math.round(courses.reduce((sum, course) => sum + (course.price * course.enrolledStudents), 0) / 100000)}L</div>
              <p className="text-xs text-green-600">+15% this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Courses & Content Management</CardTitle>
              <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                  </DialogHeader>
                  <CourseForm onSave={(data) => console.log("Creating course:", data)} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">Create your first course to get started</p>
                <Button onClick={() => setIsCreateCourseOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow 
                      key={course.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleCourseClick(course)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p>{course.title}</p>
                            <p className="text-muted-foreground text-xs">{course.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.examType}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {course.instructor}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{course.enrolledStudents.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FolderOpen className="w-4 h-4 text-muted-foreground" />
                          <span>{course.modules.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        ₹{course.price}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleCourseClick(course)}>
                              <ChevronRight className="mr-2 h-4 w-4" />
                              View Modules
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // MODULES VIEW
  if (view === 'modules' && selectedCourse) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{selectedCourse.title}</span>
        </div>

        {/* Course Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedCourse.title}</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">{selectedCourse.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline">{selectedCourse.examType}</Badge>
                  <span className="text-sm text-muted-foreground">Instructor: {selectedCourse.instructor}</span>
                  <span className="text-sm text-muted-foreground">{selectedCourse.enrolledStudents.toLocaleString()} students</span>
                </div>
              </div>
              <Dialog open={isCreateModuleOpen} onOpenChange={setIsCreateModuleOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Module
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Module</DialogTitle>
                  </DialogHeader>
                  <ModuleForm onSave={(data) => console.log("Creating module:", data)} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Modules List */}
        <Card>
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCourse.modules.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg mb-2">No modules yet</h3>
                <p className="text-muted-foreground mb-4">Create the first module for this course</p>
                <Button onClick={() => setIsCreateModuleOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Module
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCourse.modules.map((module) => (
                  <div 
                    key={module.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleModuleClick(module)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4>{module.title}</h4>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{module.contents?.length || 0} content items</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{module.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => handleModuleClick(module)}>
                        View Content
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleModuleClick(module)}>
                            <ChevronRight className="mr-2 h-4 w-4" />
                            Manage Content
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Module
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // CONTENT VIEW
  if (view === 'content' && selectedModule) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{selectedCourse?.title}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{selectedModule.title}</span>
        </div>

        {/* Module Info */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{selectedModule.title}</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">{selectedModule.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">Duration: {selectedModule.duration}</span>
                <span className="text-sm text-muted-foreground">Order: {selectedModule.order}</span>
                <span className="text-sm text-muted-foreground">{selectedModule.contents?.length || 0} content items</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Content & Lessons</CardTitle>
              <div className="flex gap-2">
                <Dialog open={isCreateQuizOpen} onOpenChange={setIsCreateQuizOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <GraduationCap className="w-4 h-4 mr-2" />
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
                
                <Dialog open={isUploadContentOpen} onOpenChange={setIsUploadContentOpen}>
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
                    <UploadContentForm onSave={(data) => console.log("Uploading:", data)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedModule.contents || selectedModule.contents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg mb-2">No content yet</h3>
                <p className="text-muted-foreground mb-4">Upload videos, documents, or create quizzes for this module</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setIsUploadContentOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Content
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateQuizOpen(true)}>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedModule.contents.map((content) => {
                    const Icon = getContentIcon(content.type);
                    return (
                      <TableRow key={content.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <span>{content.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{content.type}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {content.duration && <span>{content.duration}</span>}
                          {content.size && <span>{content.size}</span>}
                          {content.questions && <span>{content.questions} questions</span>}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(content.status)}>
                            {content.status}
                          </Badge>
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
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
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
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
