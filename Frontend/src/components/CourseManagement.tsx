import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MoreHorizontal, Edit, Trash2, Eye, Users, Plus, BookOpen, Play, FileText } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Mock data based on your Exam→Subject→Topic structure
const courses = [
  {
    id: 1,
    title: "JEE Main & Advanced Preparation",
    description: "Complete preparation course for Joint Entrance Examination",
    examType: "jee",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    totalTopics: 135,
    enrolledStudents: 2847,
    completionRate: 78.5,
    rating: 4.8,
    instructor: "Dr. Priya Sharma",
    duration: "12 months",
    lastUpdated: "2025-01-10",
    status: "active",
    price: 299,
    modules: [
      { id: 1, title: "Physics Fundamentals", lessons: 25, duration: "8 hours" },
      { id: 2, title: "Chemistry Basics", lessons: 20, duration: "6 hours" },
      { id: 3, title: "Mathematics Core", lessons: 30, duration: "10 hours" }
    ]
  },
  {
    id: 2,
    title: "NEET Preparation Course",
    description: "National Eligibility cum Entrance Test for medical colleges",
    examType: "neet",
    subjects: ["Physics", "Chemistry", "Biology"],
    totalTopics: 156,
    enrolledStudents: 1923,
    completionRate: 82.1,
    rating: 4.9,
    instructor: "Dr. Rajesh Kumar",
    duration: "10 months",
    lastUpdated: "2025-01-12",
    status: "active",
    price: 399,
    modules: [
      { id: 4, title: "Biology Fundamentals", lessons: 35, duration: "12 hours" },
      { id: 5, title: "Physics for NEET", lessons: 20, duration: "7 hours" },
      { id: 6, title: "Chemistry for NEET", lessons: 25, duration: "8 hours" }
    ]
  },
  {
    id: 3,
    title: "CAT Preparation",
    description: "Common Admission Test for MBA programs",
    examType: "cat",
    subjects: ["Quantitative Aptitude", "Verbal Ability", "Data Interpretation", "Logical Reasoning"],
    totalTopics: 89,
    enrolledStudents: 1456,
    completionRate: 75.3,
    rating: 4.7,
    instructor: "Prof. Anita Desai",
    duration: "8 months",
    lastUpdated: "2025-01-08",
    status: "active",
    price: 199,
    modules: [
      { id: 7, title: "Quantitative Aptitude", lessons: 22, duration: "9 hours" },
      { id: 8, title: "Verbal Ability", lessons: 18, duration: "6 hours" },
      { id: 9, title: "Data Interpretation", lessons: 15, duration: "5 hours" }
    ]
  },
  {
    id: 4,
    title: "UPSC Civil Services",
    description: "Union Public Service Commission examination preparation",
    examType: "upsc",
    subjects: ["History", "Geography", "Polity", "Economics", "Science & Technology", "Current Affairs"],
    totalTopics: 234,
    enrolledStudents: 987,
    completionRate: 68.9,
    rating: 4.6,
    instructor: "Dr. Vikram Singh",
    duration: "18 months",
    lastUpdated: "2025-01-05",
    status: "active",
    price: 499,
    modules: [
      { id: 10, title: "History & Culture", lessons: 40, duration: "15 hours" },
      { id: 11, title: "Geography", lessons: 35, duration: "12 hours" },
      { id: 12, title: "Polity & Governance", lessons: 30, duration: "10 hours" }
    ]
  },
  {
    id: 5,
    title: "GATE Engineering",
    description: "Graduate Aptitude Test in Engineering",
    examType: "gate",
    subjects: ["Engineering Mathematics", "General Aptitude", "Technical Subjects"],
    totalTopics: 178,
    enrolledStudents: 1234,
    completionRate: 71.2,
    rating: 4.5,
    instructor: "Prof. Suresh Gupta",
    duration: "14 months",
    lastUpdated: "2025-01-11",
    status: "active",
    price: 349,
    modules: [
      { id: 13, title: "Engineering Mathematics", lessons: 28, duration: "10 hours" },
      { id: 14, title: "General Aptitude", lessons: 15, duration: "5 hours" },
      { id: 15, title: "Technical Core", lessons: 32, duration: "12 hours" }
    ]
  },
  {
    id: 6,
    title: "Banking & SSC Exams",
    description: "Preparation for various government banking and SSC examinations",
    examType: "other_govt_exam",
    subjects: ["Quantitative Aptitude", "English Language", "Reasoning", "General Awareness"],
    totalTopics: 145,
    enrolledStudents: 1876,
    completionRate: 73.8,
    rating: 4.4,
    instructor: "Ms. Ritu Agarwal",
    duration: "10 months",
    lastUpdated: "2025-01-09",
    status: "active",
    price: 249,
    modules: [
      { id: 16, title: "Quantitative Aptitude", lessons: 25, duration: "8 hours" },
      { id: 17, title: "English Language", lessons: 20, duration: "6 hours" },
      { id: 18, title: "General Awareness", lessons: 30, duration: "10 hours" }
    ]
  }
];

const examTypes = [
  { value: "all", label: "All Exams" },
  { value: "jee", label: "JEE Main & Advanced" },
  { value: "neet", label: "NEET" },
  { value: "cat", label: "CAT" },
  { value: "upsc", label: "UPSC" },
  { value: "gate", label: "GATE" },
  { value: "other_govt_exam", label: "Other Govt Exams" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'draft': return 'bg-yellow-100 text-yellow-800';
    case 'archived': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function CourseManagement() {
  const [activeTab, setActiveTab] = useState("courses");
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const CourseForm = ({ course = null, onSave }) => {
    const [formData, setFormData] = useState({
      title: course?.title || "",
      description: course?.description || "",
      examType: course?.examType || "jee",
      instructor: course?.instructor || "",
      price: course?.price || 0,
      duration: course?.duration || "",
      status: course?.status || "draft",
      isPublished: course?.status === "active" || false
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
                {examTypes.slice(1).map((exam) => (
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

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.isPublished}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
          />
          <Label htmlFor="published">Publish course immediately</Label>
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

  return (
    <div className="space-y-6">
      {/* Course Stats */}
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
            <CardTitle className="text-sm text-muted-foreground">Avg Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{Math.round(courses.reduce((sum, course) => sum + course.completionRate, 0) / courses.length)}%</div>
            <p className="text-xs text-green-600">+2% this month</p>
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

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Management</CardTitle>
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <p>{course.title}</p>
                          <p className="text-muted-foreground text-xs">{course.examType.toUpperCase()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.examType.toUpperCase()}</Badge>
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
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${course.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{course.completionRate}%</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        ₹{course.price}
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BookOpen className="mr-2 h-4 w-4" />
                              Manage Content
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="modules" className="space-y-4">
              <div className="flex justify-end">
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
              
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {course.modules.map((module) => (
                          <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p>{module.title}</p>
                                <p className="text-muted-foreground text-xs">
                                  {module.lessons} lessons • {module.duration}
                                </p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Module
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Play className="mr-2 h-4 w-4" />
                                  Manage Lessons
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="lessons" className="space-y-4">
              <div className="flex justify-end">
                <Dialog open={isCreateLessonOpen} onOpenChange={setIsCreateLessonOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Lesson
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Lesson</DialogTitle>
                    </DialogHeader>
                    <div className="text-center text-muted-foreground py-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Lesson creation form coming soon...</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="text-center text-muted-foreground py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a course and module to view lessons</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}