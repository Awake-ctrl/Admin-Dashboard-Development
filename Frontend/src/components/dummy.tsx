import { useState, useEffect } from "react";
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
  GraduationCap,
  History,
  GitBranch,
  RotateCcw,
  Clock,
  Check,
  GitCommit,
  Archive,
  Loader2
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
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";

// Import API services
import { 
  courseApi, 
  moduleApi, 
  contentApi, 
  examApi,
  Course,
  Module,
  Content,
  ContentVersion,
  CourseFormData,
  ModuleFormData,
  ContentFormData,
  QuizFormData
} from "./api/course";

// Types for our component
interface CourseWithModules extends Course {
  modules?: ModuleWithContents[];
}

interface ModuleWithContents extends Module {
  contents?: ContentWithVersions[];
}

interface ContentWithVersions extends Content {
  versions?: ContentVersion[];
  currentVersion?: string;
  totalVersions?: number;
}

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
  const [selectedCourse, setSelectedCourse] = useState<CourseWithModules | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleWithContents | null>(null);
  const [courses, setCourses] = useState<CourseWithModules[]>([]);
  const [loading, setLoading] = useState(false);
  const [examTypes, setExamTypes] = useState<string[]>([]);
  
  // Dialog states
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isUploadContentOpen, setIsUploadContentOpen] = useState(false);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Version control states
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentWithVersions | null>(null);
  const [isVersionCompareOpen, setIsVersionCompareOpen] = useState(false);
  const [compareVersions, setCompareVersions] = useState<{v1: any, v2: any}>({v1: null, v2: null});
  const [isUploadNewVersionOpen, setIsUploadNewVersionOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentWithVersions | null>(null);
  const [isCreateQuizVersionOpen, setIsCreateQuizVersionOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<ContentWithVersions | null>(null);

  // Load courses and exam types on component mount
  useEffect(() => {
    loadCourses();
    loadExamTypes();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const coursesData = await courseApi.getCourses();
      // Fetch modules for each course
      const coursesWithModules = await Promise.all(
        coursesData.map(async (course) => {
          try {
            const modules = await moduleApi.getModules(course.id);
            // Fetch contents for each module
            const modulesWithContents = await Promise.all(
              modules.map(async (module) => {
                try {
                  const contents = await contentApi.getContents(undefined, course.id);
                  const contentsWithVersions = await Promise.all(
                    contents.map(async (content) => {
                      try {
                        const versions = await contentApi.getContentVersions(content.id);
                        return {
                          ...content,
                          versions,
                          currentVersion: versions.find(v => v.status === 'published')?.version_number || versions[0]?.version_number,
                          totalVersions: versions.length
                        };
                      } catch (error) {
                        console.error(`Error loading versions for content ${content.id}:`, error);
                        return {
                          ...content,
                          versions: [],
                          currentVersion: '1.0',
                          totalVersions: 0
                        };
                      }
                    })
                  );
                  return {
                    ...module,
                    contents: contentsWithVersions
                  };
                } catch (error) {
                  console.error(`Error loading contents for module ${module.id}:`, error);
                  return {
                    ...module,
                    contents: []
                  };
                }
              })
            );
            return {
              ...course,
              modules: modulesWithContents
            };
          } catch (error) {
            console.error(`Error loading modules for course ${course.id}:`, error);
            return {
              ...course,
              modules: []
            };
          }
        })
      );
      setCourses(coursesWithModules);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const loadExamTypes = async () => {
    try {
      const exams = await examApi.getExams();
      const types = exams.map(exam => exam.display_name);
      setExamTypes(types);
    } catch (error) {
      console.error('Error loading exam types:', error);
    }
  };

  const handleCourseClick = (course: CourseWithModules) => {
    setSelectedCourse(course);
    setView('modules');
  };

  const handleModuleClick = (module: ModuleWithContents) => {
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

  // Course CRUD Operations
  const handleCreateCourse = async (formData: CourseFormData) => {
    try {
      await courseApi.createCourse(formData);
      toast.success('Course created successfully');
      loadCourses(); // Reload courses
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
    }
  };

  const handleUpdateCourse = async (courseId: number, formData: Partial<CourseFormData>) => {
    try {
      await courseApi.updateCourse(courseId, formData);
      toast.success('Course updated successfully');
      loadCourses(); // Reload courses
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await courseApi.deleteCourse(courseId);
      toast.success('Course deleted successfully');
      loadCourses(); // Reload courses
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  // Module CRUD Operations
  const handleCreateModule = async (formData: ModuleFormData) => {
    if (!selectedCourse) return;
    
    try {
      const moduleData = {
        ...formData,
        course_id: selectedCourse.id
      };
      await moduleApi.createModule(moduleData);
      toast.success('Module created successfully');
      loadCourses(); // Reload to get updated modules
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error('Failed to create module');
    }
  };

  const handleUpdateModule = async (moduleId: number, formData: Partial<ModuleFormData>) => {
    try {
      await moduleApi.updateModule(moduleId, formData);
      toast.success('Module updated successfully');
      loadCourses(); // Reload to get updated modules
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Failed to update module');
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    try {
      await moduleApi.deleteModule(moduleId);
      toast.success('Module deleted successfully');
      loadCourses(); // Reload to get updated modules
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    }
  };

  // Content CRUD Operations
  const handleCreateContent = async (formData: ContentFormData) => {
    if (!selectedModule) return;
    
    try {
      const contentData = {
        ...formData,
        module_id: selectedModule.id,
        course_id: selectedCourse?.id
      };
      await contentApi.createContent(contentData);
      toast.success('Content created successfully');
      loadCourses(); // Reload to get updated content
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
    }
  };

  const handleCreateQuiz = async (formData: QuizFormData) => {
    if (!selectedModule) return;
    
    try {
      const quizData = {
        ...formData,
        module_id: selectedModule.id,
        course_id: selectedCourse?.id,
        content_type: 'quiz'
      };
      await contentApi.createContent(quizData as ContentFormData);
      toast.success('Quiz created successfully');
      loadCourses(); // Reload to get updated content
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz');
    }
  };

  const handleCreateContentVersion = async (contentId: number, versionData: Partial<ContentVersion>) => {
    try {
      await contentApi.createContentVersion(contentId, versionData);
      toast.success('New version created successfully');
      loadCourses(); // Reload to get updated versions
    } catch (error) {
      console.error('Error creating content version:', error);
      toast.error('Failed to create new version');
    }
  };

  // Version History Component
  const VersionHistory = ({ contentId, contentTitle }: { contentId: number; contentTitle: string }) => {
    const [versions, setVersions] = useState<ContentVersion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadVersions();
    }, [contentId]);

    const loadVersions = async () => {
      try {
        const versionsData = await contentApi.getContentVersions(contentId);
        setVersions(versionsData);
      } catch (error) {
        console.error('Error loading versions:', error);
        toast.error('Failed to load version history');
      } finally {
        setLoading(false);
      }
    };

    const handleRestore = async (version: ContentVersion) => {
      try {
        // Create a new version based on the old one
        await contentApi.createContentVersion(contentId, {
          ...version,
          version_number: getNextVersion(versions),
          status: 'published'
        });
        toast.success(`Successfully restored version ${version.version_number}`);
        setIsVersionHistoryOpen(false);
        loadCourses(); // Reload courses to reflect changes
      } catch (error) {
        console.error('Error restoring version:', error);
        toast.error('Failed to restore version');
      }
    };

    const getNextVersion = (currentVersions: ContentVersion[]): string => {
      if (!currentVersions.length) return "1.0";
      const latestVersion = currentVersions[0].version_number;
      const [major, minor] = latestVersion.split('.').map(Number);
      return `${major}.${minor + 1}`;
    };

    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {versions.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No version history available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version, index) => (
              <Card key={version.id} className={version.status === 'published' ? "border-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <GitCommit className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Version {version.version_number}</span>
                        {version.status === 'published' && (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Current
                          </Badge>
                        )}
                        <Badge className={getStatusColor(version.status)}>
                          {version.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-foreground mb-2">{version.changelog || 'No changelog provided'}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{version.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(version.created_at).toLocaleString()}</span>
                        </div>
                        {version.file_size && (
                          <span>{version.file_size}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {version.status !== 'published' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRestore(version)}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Course Form Component
  const CourseForm = ({ course = null, onSave }: { course?: Course | null; onSave: (data: CourseFormData) => void }) => {
    const [formData, setFormData] = useState<CourseFormData>({
      title: course?.title || "",
      description: course?.description || "",
      exam_type: course?.exam_type || "",
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
            <Select value={formData.exam_type} onValueChange={(value) => setFormData(prev => ({ ...prev, exam_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((exam) => (
                  <SelectItem key={exam} value={exam}>{exam}</SelectItem>
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

        <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 6 months"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsCreateCourseOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            {course ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </div>
    );
  };

  // Module Form Component
  const ModuleForm = ({ module = null, onSave }: { module?: Module | null; onSave: (data: ModuleFormData) => void }) => {
    const [formData, setFormData] = useState<ModuleFormData>({
      title: module?.title || "",
      description: module?.description || "",
      order_index: module?.order_index || 1,
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
          <Button onClick={() => onSave(formData)}>
            {module ? 'Update Module' : 'Create Module'}
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
              <p className="text-xs text-green-600">+{courses.filter(c => c.status === 'published').length} active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{courses.reduce((sum, course) => sum + (course.enrolled_students || 0), 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{courses.reduce((sum, course) => sum + (course.modules?.length || 0), 0)}</div>
              <p className="text-xs text-muted-foreground">Learning modules</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Exam Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{examTypes.length}</div>
              <p className="text-xs text-muted-foreground">Available exam types</p>
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
                  <CourseForm onSave={handleCreateCourse} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : courses.length === 0 ? (
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
                        <Badge variant="outline">{course.exam_type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {course.instructor}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{(course.enrolled_students || 0).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FolderOpen className="w-4 h-4 text-muted-foreground" />
                          <span>{course.modules?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
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
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
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
                  <Badge variant="outline">{selectedCourse.exam_type}</Badge>
                  <span className="text-sm text-muted-foreground">Instructor: {selectedCourse.instructor}</span>
                  <span className="text-sm text-muted-foreground">{(selectedCourse.enrolled_students || 0).toLocaleString()} students</span>
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
                  <ModuleForm onSave={handleCreateModule} />
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
            {!selectedCourse.modules || selectedCourse.modules.length === 0 ? (
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
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteModule(module.id)}
                          >
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
                <span className="text-sm text-muted-foreground">Order: {selectedModule.order_index}</span>
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
                    {/* Quiz form would go here */}
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
                    {/* Content upload form would go here */}
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
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedModule.contents.map((content) => {
                    const Icon = getContentIcon(content.content_type);
                    return (
                      <TableRow key={content.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p>{content.title}</p>
                              {content.updated_at && (
                                <p className="text-xs text-muted-foreground">
                                  Modified: {new Date(content.updated_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{content.content_type}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {content.duration && <span>{content.duration}</span>}
                          {content.file_size && <span>{content.file_size}</span>}
                        </TableCell>
                        <TableCell>
                          {content.currentVersion ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-50 border-blue-300 text-blue-800">
                                <GitCommit className="w-3 h-3 mr-1" />
                                v{content.currentVersion}
                              </Badge>
                              {content.totalVersions && content.totalVersions > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2"
                                  onClick={() => {
                                    setSelectedContent(content);
                                    setIsVersionHistoryOpen(true);
                                  }}
                                >
                                  <History className="w-3 h-3 mr-1" />
                                  {content.totalVersions} versions
                                </Button>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No versions</span>
                          )}
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
                                Edit Details
                              </DropdownMenuItem>
                              {content.currentVersion && (
                                <>
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedContent(content);
                                    setIsVersionHistoryOpen(true);
                                  }}>
                                    <History className="mr-2 h-4 w-4" />
                                    Version History
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              {content.status === 'published' && (
                                <DropdownMenuItem>
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archive Version
                                </DropdownMenuItem>
                              )}
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

        {/* Version History Dialog */}
        <Dialog open={isVersionHistoryOpen} onOpenChange={setIsVersionHistoryOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Version History - {selectedContent?.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                View and manage all versions of this content
              </p>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
              {selectedContent && (
                <VersionHistory 
                  contentId={selectedContent.id} 
                  contentTitle={selectedContent.title}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}