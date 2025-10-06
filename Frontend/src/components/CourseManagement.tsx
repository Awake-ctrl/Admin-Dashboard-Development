import React, { useState, useEffect } from "react";
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
import { MoreHorizontal, Edit, Trash2, Eye, Users, Plus, BookOpen, Play, FileText, Target, Brain, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Switch } from "./ui/switch";
import { courseApi, moduleApi, examApi, subjectApi, statsApi } from "./api/course";
import { Exam, Subject, Course, Module, CourseFormData, ModuleFormData, CourseStats } from "../types";

export const CourseManagement: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState<boolean>(false);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<CourseStats | null>(null);

  // Load data from API
  useEffect(() => {
    loadExams();
    loadSubjects();
    loadStats();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      loadCourses(selectedExam);
    }
  }, [selectedExam]);

  useEffect(() => {
    if (courses.length > 0) {
      loadModules();
    }
  }, [courses]);

  const loadExams = async (): Promise<void> => {
    try {
      const data = await examApi.getExams();
      setExams(data);
      if (data.length > 0 && !selectedExam) {
        setSelectedExam(data[0].name);
      }
    } catch (error) {
      console.error('Failed to load exams:', error);
    }
  };

  const loadCourses = async (examType: string): Promise<void> => {
    setLoading(true);
    try {
      const data = await courseApi.getCourses(examType);
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async (): Promise<void> => {
    try {
      const data = await subjectApi.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadModules = async (): Promise<void> => {
    try {
      const allModules: Module[] = [];
      for (const course of courses) {
        const courseModules = await moduleApi.getModules(course.id);
        allModules.push(...courseModules);
      }
      setModules(allModules);
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const loadStats = async (): Promise<void> => {
    try {
      const data = await statsApi.getCourseStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const currentExam = exams.find(exam => exam.name === selectedExam);
  const filteredCourses = courses.filter(course => course.exam_type === selectedExam);

  const CourseForm: React.FC<{ 
    course?: Course | null; 
    onSave: (data: CourseFormData) => Promise<void>;
  }> = ({ course = null, onSave }) => {
    const [formData, setFormData] = useState<CourseFormData>({
      title: course?.title || "",
      description: course?.description || "",
      exam_type: course?.exam_type || selectedExam,
      instructor: course?.instructor || "",
      price: course?.price || 0,
      duration: course?.duration || "",
      status: course?.status || "draft",
      exam_id: currentExam?.id || exams[0]?.id || 1,
      subject_ids: course?.subjects?.map(s => s.id) || []
    });

    const handleSave = async (): Promise<void> => {
      try {
        await onSave(formData);
        setIsCreateCourseOpen(false);
        if (selectedExam) {
          loadCourses(selectedExam);
        }
      } catch (error) {
        console.error('Failed to save course:', error);
      }
    };

    const availableSubjects = subjects.filter(subject => 
      subject.exam_id === formData.exam_id
    );

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
            <Select 
              value={formData.exam_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, exam_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.name} value={exam.name}>
                    {exam.display_name}
                  </SelectItem>
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
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
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
          <Label htmlFor="subjects">Subjects</Label>
          <Select 
            value="" 
            onValueChange={(value) => {
              const subjectId = parseInt(value);
              if (!formData.subject_ids.includes(subjectId)) {
                setFormData(prev => ({ 
                  ...prev, 
                  subject_ids: [...prev.subject_ids, subjectId]
                }));
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subjects" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.subject_ids.map(subjectId => {
              const subject = subjects.find(s => s.id === subjectId);
              return subject ? (
                <Badge key={subjectId} variant="secondary" className="flex items-center gap-1">
                  {subject.name}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      subject_ids: prev.subject_ids.filter(id => id !== subjectId)
                    }))}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
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
          <Button onClick={handleSave}>
            {course ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </div>
    );
  };

  const ModuleForm: React.FC<{ 
    module?: Module | null; 
    courseId: number;
    onSave: (data: ModuleFormData) => Promise<void>;
  }> = ({ module = null, courseId, onSave }) => {
    const [formData, setFormData] = useState<ModuleFormData>({
      title: module?.title || "",
      description: module?.description || "",
      course_id: courseId,
      order_index: module?.order_index || 0,
      duration: module?.duration || ""
    });

    const handleSave = async (): Promise<void> => {
      try {
        await onSave(formData);
        setIsCreateModuleOpen(false);
        loadModules();
      } catch (error) {
        console.error('Failed to save module:', error);
      }
    };

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
              value={formData.order_index}
              onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
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
          <Button onClick={handleSave}>
            {module ? 'Update Module' : 'Create Module'}
          </Button>
        </div>
      </div>
    );
  };

  const handleCreateCourse = async (courseData: CourseFormData): Promise<void> => {
    await courseApi.createCourse(courseData);
  };

  const handleCreateModule = async (moduleData: ModuleFormData): Promise<void> => {
    await moduleApi.createModule(moduleData);
  };

  const handleUpdateCourse = async (courseId: number, courseData: Partial<CourseFormData>): Promise<void> => {
    await courseApi.updateCourse(courseId, courseData);
  };

  const handleDeleteCourse = async (courseId: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await courseApi.deleteCourse(courseId);
      loadCourses(selectedExam);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalEngagement = filteredCourses.reduce((sum, course) => sum + course.enrolled_students, 0);
  const totalTopics = filteredCourses.reduce((sum, course) => {
    const courseSubjects = subjects.filter(s => 
      course.subjects?.some(cs => cs.id === s.id)
    );
    return sum + courseSubjects.reduce((subjectSum, subject) => subjectSum + subject.topics_count, 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{filteredCourses.length}</div>
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
          <CardDescription>Choose an exam to manage its courses and content</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.name} value={exam.name}>
                  {exam.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Courses</CardTitle>
                <CardDescription>Most enrolled courses this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCourses
                    .sort((a, b) => b.enrolled_students - a.enrolled_students)
                    .slice(0, 5)
                    .map((course, index) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                          <span className="truncate">{course.title}</span>
                        </div>
                        <Badge variant="secondary">{course.enrolled_students}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>Completion rates by course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="truncate">{course.title}</span>
                        <span>{course.completion_rate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${course.completion_rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Courses for {currentExam?.display_name}</h3>
              <p className="text-muted-foreground">Manage courses and their content</p>
            </div>
            <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>
                    Add a new course to the {currentExam?.display_name} category
                  </DialogDescription>
                </DialogHeader>
                <CourseForm onSave={handleCreateCourse} />
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-muted-foreground text-xs">{course.exam_type.toUpperCase()}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {course.instructor}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{course.enrolled_students.toLocaleString()}</span>
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
                              style={{ width: `${course.completion_rate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{course.completion_rate}%</span>
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setIsCreateCourseOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BookOpen className="mr-2 h-4 w-4" />
                                Manage Content
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
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
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Course Modules</h3>
              <p className="text-muted-foreground">Manage modules and lessons for courses</p>
            </div>
            <Dialog open={isCreateModuleOpen} onOpenChange={setIsCreateModuleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Module
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Module</DialogTitle>
                </DialogHeader>
                <ModuleForm 
                  courseId={filteredCourses[0]?.id || 0} 
                  onSave={handleCreateModule} 
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {filteredCourses.map((course) => {
              const courseModules = modules.filter(module => module.course_id === course.id);
              return (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {courseModules.map((module) => (
                        <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p>{module.title}</p>
                              <p className="text-muted-foreground text-xs">
                                {module.lessons_count} lessons • {module.duration}
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
                      {courseModules.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          No modules yet. Create your first module!
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};