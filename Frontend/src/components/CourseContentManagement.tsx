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
  Loader2,
  X,
  Save
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
  DialogDescription,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

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
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isEditModuleOpen, setIsEditModuleOpen] = useState(false);
  const [isDeleteModuleOpen, setIsDeleteModuleOpen] = useState(false);
  const [isUploadContentOpen, setIsUploadContentOpen] = useState(false);
  const [isEditContentOpen, setIsEditContentOpen] = useState(false);
  const [isDeleteContentOpen, setIsDeleteContentOpen] = useState(false);
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

  // Editing states
  const [editingCourse, setEditingCourse] = useState<CourseWithModules | null>(null);
  const [editingModule, setEditingModule] = useState<ModuleWithContents | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<CourseWithModules | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<ModuleWithContents | null>(null);
  const [contentToDelete, setContentToDelete] = useState<ContentWithVersions | null>(null);

  // Form states
  const [contentFormData, setContentFormData] = useState<ContentFormData>({
    title: "",
    content_type: "document",
    description: "",
    file_url: "",
    duration: "",
    file_size: "",
    status: "draft",
    module_id: 0,
    course_id: 0
  });

  const [quizFormData, setQuizFormData] = useState<any>({
    title: "",
    content_type: "quiz",
    description: "",
    questions: [],
    duration: "30 min",
    status: "draft",
    module_id: 0,
    course_id: 0
  });

  const [newVersionFormData, setNewVersionFormData] = useState({
    changelog: "",
    file_url: "",
    file_size: "",
    status: "draft"
  });

  // New state for custom exam type
  const [customExamType, setCustomExamType] = useState("");
  const [showCustomExamInput, setShowCustomExamInput] = useState(false);

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
                  const contents = await contentApi.getContents(module.id);
                  const contentsWithVersions = await Promise.all(
                    contents.map(async (content) => {
                      try {
                        const versions = await contentApi.getContentVersions(content.id);
                        const currentPublishedVersion = versions.find(v => v.status === 'published');
                        return {
                          ...content,
                          versions,
                          currentVersion: currentPublishedVersion?.version_number || versions[0]?.version_number,
                          totalVersions: versions.length
                        };
                      } catch (error) {
                        console.error(`Error loading versions for content ${content.id}:`, error);
                        return {
                          ...content,
                          versions: [],
                          currentVersion: undefined,
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

  const handleAddCustomExamType = () => {
    if (customExamType.trim() && !examTypes.includes(customExamType.trim())) {
      setExamTypes(prev => [...prev, customExamType.trim()]);
      setCustomExamType("");
      setShowCustomExamInput(false);
      toast.success(`Added new exam type: ${customExamType.trim()}`);
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
      setIsCreateCourseOpen(false);
      loadCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
    }
  };

  const handleUpdateCourse = async (formData: CourseFormData) => {
    if (!editingCourse) return;
    
    try {
      await courseApi.updateCourse(editingCourse.id, formData);
      toast.success('Course updated successfully');
      setIsEditCourseOpen(false);
      setEditingCourse(null);
      loadCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      await courseApi.deleteCourse(courseToDelete.id);
      toast.success('Course deleted successfully');
      setIsDeleteCourseOpen(false);
      setCourseToDelete(null);
      loadCourses();
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
      setIsCreateModuleOpen(false);
      loadCourses();
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error('Failed to create module');
    }
  };

  const handleUpdateModule = async (formData: ModuleFormData) => {
    if (!editingModule) return;
    
    try {
      await moduleApi.updateModule(editingModule.id, formData);
      toast.success('Module updated successfully');
      setIsEditModuleOpen(false);
      setEditingModule(null);
      loadCourses();
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Failed to update module');
    }
  };

  const handleDeleteModule = async () => {
    if (!moduleToDelete) return;
    
    try {
      await moduleApi.deleteModule(moduleToDelete.id);
      toast.success('Module deleted successfully');
      setIsDeleteModuleOpen(false);
      setModuleToDelete(null);
      loadCourses();
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    }
  };

  // Content CRUD Operations
  const handleCreateContent = async () => {
    if (!selectedModule || !selectedCourse) return;
    
    try {
      const contentData = {
        ...contentFormData,
        module_id: selectedModule.id,
        course_id: selectedCourse.id
      };
      await contentApi.createContent(contentData);
      toast.success('Content created successfully');
      setIsUploadContentOpen(false);
      setContentFormData({
        title: "",
        content_type: "document",
        description: "",
        file_url: "",
        duration: "",
        file_size: "",
        status: "draft",
        module_id: 0,
        course_id: 0
      });
      loadCourses();
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
    }
  };

  const handleUpdateContent = async () => {
    if (!editingContent) return;
    
    try {
      const contentData = {
        title: contentFormData.title,
        description: contentFormData.description,
        duration: contentFormData.duration,
        status: contentFormData.status
      };
      await contentApi.updateContent(editingContent.id, contentData);
      toast.success('Content updated successfully');
      setIsEditContentOpen(false);
      setEditingContent(null);
      loadCourses();
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  const handleDeleteContent = async () => {
    if (!contentToDelete) return;
    
    try {
      await contentApi.deleteContent(contentToDelete.id);
      toast.success('Content deleted successfully');
      setIsDeleteContentOpen(false);
      setContentToDelete(null);
      loadCourses();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const handleCreateQuiz = async () => {
    if (!selectedModule || !selectedCourse) return;
    
    try {
      const quizData = {
        ...quizFormData,
        module_id: selectedModule.id,
        course_id: selectedCourse.id
      };
      await contentApi.createContent(quizData);
      toast.success('Quiz created successfully');
      setIsCreateQuizOpen(false);
      setQuizFormData({
        title: "",
        content_type: "quiz",
        description: "",
        questions: [],
        duration: "30 min",
        status: "draft",
        module_id: 0,
        course_id: 0
      });
      loadCourses();
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz');
    }
  };

  const handleCreateContentVersion = async () => {
    if (!editingContent) return;
    
    try {
      // Get current versions to determine next version number
      const currentVersions = await contentApi.getContentVersions(editingContent.id);
      const nextVersion = getNextVersion(currentVersions);
      
      const versionData = {
        ...newVersionFormData,
        version_number: nextVersion,
        content_id: editingContent.id
      };
      
      await contentApi.createContentVersion(editingContent.id, versionData);
      toast.success(`New version ${nextVersion} created successfully`);
      setIsUploadNewVersionOpen(false);
      setNewVersionFormData({
        changelog: "",
        file_url: "",
        file_size: "",
        status: "draft"
      });
      loadCourses();
    } catch (error) {
      console.error('Error creating content version:', error);
      toast.error('Failed to create new version');
    }
  };

  const getNextVersion = (currentVersions: ContentVersion[]): string => {
    if (!currentVersions.length) return "1.0";
    
    // Get the highest version number
    const versionNumbers = currentVersions.map(v => {
      const [major, minor] = v.version_number.split('.').map(Number);
      return { major, minor };
    });
    
    const latest = versionNumbers.reduce((prev, current) => {
      if (current.major > prev.major) return current;
      if (current.major === prev.major && current.minor > prev.minor) return current;
      return prev;
    });
    
    return `${latest.major}.${latest.minor + 1}`;
  };

  const handleRestoreVersion = async (version: ContentVersion) => {
    if (!selectedContent) return;
    
    try {
      // Create a new version based on the old version's data
      const nextVersion = getNextVersion([version]);
      const restoreData = {
        version_number: nextVersion,
        content_id: selectedContent.id,
        file_url: version.file_url,
        file_size: version.file_size,
        changelog: `Restored from version ${version.version_number}: ${version.changelog}`,
        status: 'published'
      };
      
      await contentApi.createContentVersion(selectedContent.id, restoreData);
      toast.success(`Successfully restored version ${version.version_number} as ${nextVersion}`);
      setIsVersionHistoryOpen(false);
      loadCourses();
    } catch (error) {
      console.error('Error restoring version:', error);
      toast.error('Failed to restore version');
    }
  };

  // Simulate file upload
  const simulateFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Edit Content Form Component
  const EditContentForm = () => {
    if (!editingContent) return null;

    return (
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Edit className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900">Editing Content</p>
              <p className="text-xs text-blue-700 mt-1">
                Update the content details below.
              </p>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="edit-content-title">Content Title</Label>
          <Input
            id="edit-content-title"
            value={contentFormData.title}
            onChange={(e) => setContentFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter content title"
          />
        </div>

        <div>
          <Label htmlFor="edit-content-description">Description</Label>
          <Textarea
            id="edit-content-description"
            value={contentFormData.description}
            onChange={(e) => setContentFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter content description..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-duration">Duration</Label>
            <Input
              id="edit-duration"
              value={contentFormData.duration}
              onChange={(e) => setContentFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 45 min"
            />
          </div>
          <div>
            <Label htmlFor="edit-status">Status</Label>
            <Select 
              value={contentFormData.status} 
              onValueChange={(value: any) => setContentFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => {
            setIsEditContentOpen(false);
            setEditingContent(null);
          }}>
            Cancel
          </Button>
          <Button onClick={handleUpdateContent}>
            <Save className="w-4 h-4 mr-2" />
            Update Content
          </Button>
        </div>
      </div>
    );
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
        setVersions(versionsData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      } catch (error) {
        console.error('Error loading versions:', error);
        toast.error('Failed to load version history');
      } finally {
        setLoading(false);
      }
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
                          <span>{version.author || 'System'}</span>
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
                          onClick={() => handleRestoreVersion(version)}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                      )}
                      {index < versions.length - 1 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setCompareVersions({ v1: version, v2: versions[index + 1] });
                            setIsVersionCompareOpen(true);
                          }}
                        >
                          <GitBranch className="w-4 h-4 mr-2" />
                          Compare
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

  // Version Comparison Component
  const VersionCompare = ({ v1, v2, contentTitle }: { v1: ContentVersion; v2: ContentVersion; contentTitle: string }) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Version 1 */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <GitCommit className="w-4 h-4 text-blue-600" />
              <h3>Version {v1.version_number}</h3>
              {v1.status === 'published' && (
                <Badge className="bg-green-100 text-green-800 text-xs">Current</Badge>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Changes</Label>
                <p className="text-foreground">{v1.changelog || 'No changelog'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Author</Label>
                <p className="text-foreground">{v1.author || 'System'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Timestamp</Label>
                <p className="text-foreground">{new Date(v1.created_at).toLocaleString()}</p>
              </div>
              {v1.file_size && (
                <div>
                  <Label className="text-xs text-muted-foreground">Size</Label>
                  <p className="text-foreground">{v1.file_size}</p>
                </div>
              )}
              <Badge className={getStatusColor(v1.status)}>{v1.status}</Badge>
            </div>
          </div>

          {/* Version 2 */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <GitCommit className="w-4 h-4 text-orange-600" />
              <h3>Version {v2.version_number}</h3>
              {v2.status === 'published' && (
                <Badge className="bg-green-100 text-green-800 text-xs">Current</Badge>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Changes</Label>
                <p className="text-foreground">{v2.changelog || 'No changelog'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Author</Label>
                <p className="text-foreground">{v2.author || 'System'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Timestamp</Label>
                <p className="text-foreground">{new Date(v2.created_at).toLocaleString()}</p>
              </div>
              {v2.file_size && (
                <div>
                  <Label className="text-xs text-muted-foreground">Size</Label>
                  <p className="text-foreground">{v2.file_size}</p>
                </div>
              )}
              <Badge className={getStatusColor(v2.status)}>{v2.status}</Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsVersionCompareOpen(false)}>
            Close
          </Button>
          <Button onClick={() => handleRestoreVersion(v1)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restore to v{v1.version_number}
          </Button>
        </div>
      </div>
    );
  };

  // Upload Content Form Component
  const UploadContentForm = () => {
    return (
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <GitCommit className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900">Creating New Content</p>
              <p className="text-xs text-blue-700 mt-1">
                This will be created as version 1.0. You can upload new versions later.
              </p>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="content-title">Content Title</Label>
          <Input
            id="content-title"
            value={contentFormData.title}
            onChange={(e) => setContentFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter content title"
          />
        </div>

        <div>
          <Label htmlFor="content-description">Description</Label>
          <Textarea
            id="content-description"
            value={contentFormData.description}
            onChange={(e) => setContentFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter content description..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="content-type">Content Type</Label>
          <Select 
            value={contentFormData.content_type} 
            onValueChange={(value: any) => setContentFormData(prev => ({ ...prev, content_type: value }))}
          >
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setContentFormData(prev => ({ 
                  ...prev, 
                  file_url: URL.createObjectURL(file),
                  file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                }));
                simulateFileUpload();
              }
            }}
            accept=".pdf,.doc,.docx,.mp4,.mov,.jpg,.jpeg,.png"
          />
          {isUploading && (
            <div className="mt-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Uploading... {uploadProgress}%</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={contentFormData.duration}
              onChange={(e) => setContentFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 45 min"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={contentFormData.status} 
              onValueChange={(value: any) => setContentFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsUploadContentOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateContent}>
            <Upload className="w-4 h-4 mr-2" />
            Create Content (v1.0)
          </Button>
        </div>
      </div>
    );
  };

  // Upload New Version Form Component
  const UploadNewVersionForm = () => {
    if (!editingContent) return null;

    const calculateNextVersion = () => {
      if (!editingContent.versions || editingContent.versions.length === 0) return "1.0";
      
      const versionNumbers = editingContent.versions.map(v => {
        const [major, minor] = v.version_number.split('.').map(Number);
        return { major, minor };
      });
      
      const latest = versionNumbers.reduce((prev, current) => {
        if (current.major > prev.major) return current;
        if (current.major === prev.major && current.minor > prev.minor) return current;
        return prev;
      });
      
      return `${latest.major}.${latest.minor + 1}`;
    };

    const nextVersion = calculateNextVersion();

    return (
      <div className="space-y-4">
        {/* Current Version Info */}
        <div className="p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-foreground mb-1">{editingContent.title}</h4>
              <p className="text-sm text-muted-foreground">{editingContent.content_type} • {editingContent.duration || editingContent.file_size}</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 border-blue-300 text-blue-800">
              <GitCommit className="w-3 h-3 mr-1" />
              Current: v{editingContent.currentVersion}
            </Badge>
          </div>
          {editingContent.updated_at && (
            <p className="text-xs text-muted-foreground">
              Last modified: {new Date(editingContent.updated_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* New Version Info */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <GitBranch className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-green-900">Creating New Version</p>
              <p className="text-xs text-green-700 mt-1">
                This will be saved as version {nextVersion}. Previous versions will be archived.
              </p>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="version-notes">Version Notes / Changelog</Label>
          <Textarea
            id="version-notes"
            value={newVersionFormData.changelog}
            onChange={(e) => setNewVersionFormData(prev => ({ ...prev, changelog: e.target.value }))}
            placeholder="Describe what changed in this version (e.g., Fixed audio issues, added subtitles, updated content...)"
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            This will help track changes between versions
          </p>
        </div>

        <div>
          <Label htmlFor="new-version-file">Upload New File</Label>
          <Input
            id="new-version-file"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setNewVersionFormData(prev => ({ 
                  ...prev, 
                  file_url: URL.createObjectURL(file),
                  file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                }));
                simulateFileUpload();
              }
            }}
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
          <Label htmlFor="version-status">Version Status</Label>
          <Select 
            value={newVersionFormData.status} 
            onValueChange={(value: any) => setNewVersionFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft (Not visible to students)</SelectItem>
              <SelectItem value="published">Published (Live for students)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsUploadNewVersionOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateContentVersion}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Version {nextVersion}
          </Button>
        </div>
      </div>
    );
  };

  // Quiz Form Component
  const QuizForm = () => {
    const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);

    const addQuestion = () => {
      setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
    };

    const removeQuestion = (index: number) => {
      setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index: number, field: string, value: any) => {
      const newQuestions = [...questions];
      if (field === 'question') {
        newQuestions[index].question = value;
      } else if (field.startsWith('option')) {
        const optIndex = parseInt(field.replace('option', ''));
        newQuestions[index].options[optIndex] = value;
      } else if (field === 'correctAnswer') {
        newQuestions[index].correctAnswer = parseInt(value);
      }
      setQuestions(newQuestions);
    };

    const handleSaveQuiz = () => {
      setQuizFormData(prev => ({ ...prev, questions }));
      handleCreateQuiz();
    };

    return (
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <GitCommit className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900">Creating New Quiz</p>
              <p className="text-xs text-blue-700 mt-1">
                This will be created as version 1.0. You can create new versions later.
              </p>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="quiz-title">Quiz Title</Label>
          <Input
            id="quiz-title"
            value={quizFormData.title}
            onChange={(e) => setQuizFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter quiz title"
          />
        </div>

        <div>
          <Label htmlFor="quiz-description">Description</Label>
          <Textarea
            id="quiz-description"
            value={quizFormData.description}
            onChange={(e) => setQuizFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter quiz description..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quiz-duration">Duration</Label>
            <Input
              id="quiz-duration"
              value={quizFormData.duration}
              onChange={(e) => setQuizFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 30 min"
            />
          </div>
          <div>
            <Label htmlFor="quiz-status">Status</Label>
            <Select 
              value={quizFormData.status} 
              onValueChange={(value: any) => setQuizFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Questions</Label>
            <Button variant="outline" size="sm" onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
          
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {questions.map((q, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Question {index + 1}</Label>
                      {questions.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeQuestion(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder={`Enter question ${index + 1}`}
                      value={q.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((option, optIndex) => (
                        <Input
                          key={optIndex}
                          placeholder={`Option ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => updateQuestion(index, `option${optIndex}`, e.target.value)}
                        />
                      ))}
                    </div>
                    <Select
                      value={q.correctAnswer.toString()}
                      onValueChange={(value) => updateQuestion(index, 'correctAnswer', value)}
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
          <Button onClick={handleSaveQuiz}>
            <GraduationCap className="w-4 h-4 mr-2" />
            Create Quiz (v1.0)
          </Button>
        </div>
      </div>
    );
  };

  // Course Form Component (with custom exam type option)
  const CourseForm = ({ course = null, onSave, isEdit = false }: { course?: Course | null; onSave: (data: CourseFormData) => void; isEdit?: boolean }) => {
    const [formData, setFormData] = useState<CourseFormData>({
      title: course?.title || "",
      description: course?.description || "",
      exam_type: course?.exam_type || "",
      instructor: course?.instructor || "",
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
            <div className="space-y-2">
              <Select 
                value={formData.exam_type} 
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomExamInput(true);
                  } else {
                    setFormData(prev => ({ ...prev, exam_type: value }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((exam) => (
                    <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                  ))}
                  <SelectItem value="custom">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add New Exam Type
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {showCustomExamInput && (
                <div className="flex gap-2">
                  <Input
                    value={customExamType}
                    onChange={(e) => setCustomExamType(e.target.value)}
                    placeholder="Enter new exam type"
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddCustomExamType}
                    disabled={!customExamType.trim()}
                  >
                    Add
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowCustomExamInput(false);
                      setCustomExamType("");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
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

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => isEdit ? setIsEditCourseOpen(false) : setIsCreateCourseOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            {isEdit ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </div>
    );
  };

  // Module Form Component
  const ModuleForm = ({ module = null, onSave, isEdit = false }: { module?: Module | null; onSave: (data: ModuleFormData) => void; isEdit?: boolean }) => {
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
          <Button variant="outline" onClick={() => isEdit ? setIsEditModuleOpen(false) : setIsCreateModuleOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            {isEdit ? 'Update Module' : 'Create Module'}
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
                            <DropdownMenuItem onClick={() => {
                              setEditingCourse(course);
                              setIsEditCourseOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setCourseToDelete(course);
                                setIsDeleteCourseOpen(true);
                              }}
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

        {/* Edit Course Dialog */}
        <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
            </DialogHeader>
            <CourseForm course={editingCourse} onSave={handleUpdateCourse} isEdit={true} />
          </DialogContent>
        </Dialog>

        {/* Delete Course Confirmation Dialog */}
        <Dialog open={isDeleteCourseOpen} onOpenChange={setIsDeleteCourseOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Course</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the course "{courseToDelete?.title}"? This action cannot be undone and will remove all associated modules and content.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteCourseOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCourse}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                          <DropdownMenuItem onClick={() => {
                            setEditingModule(module);
                            setIsEditModuleOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Module
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              setModuleToDelete(module);
                              setIsDeleteModuleOpen(true);
                            }}
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

        {/* Edit Module Dialog */}
        <Dialog open={isEditModuleOpen} onOpenChange={setIsEditModuleOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Module</DialogTitle>
            </DialogHeader>
            <ModuleForm module={editingModule} onSave={handleUpdateModule} isEdit={true} />
          </DialogContent>
        </Dialog>

        {/* Delete Module Confirmation Dialog */}
        <Dialog open={isDeleteModuleOpen} onOpenChange={setIsDeleteModuleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Module</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the module "{moduleToDelete?.title}"? This action cannot be undone and will remove all associated content.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModuleOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteModule}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Module
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                    <QuizForm />
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
                    <UploadContentForm />
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
                          {content.content_type === 'quiz' && <span>{content.questions?.length || 0} questions</span>}
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                  setEditingContent(content);
                                  setIsUploadNewVersionOpen(true);
                                }}
                                title="Upload new version"
                              >
                                <Upload className="w-3 h-3" />
                              </Button>
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
                              <DropdownMenuItem onClick={() => {
                                setEditingContent(content);
                                setContentFormData({
                                  title: content.title,
                                  content_type: content.content_type,
                                  description: content.description || "",
                                  file_url: content.file_url || "",
                                  duration: content.duration || "",
                                  file_size: content.file_size || "",
                                  status: content.status,
                                  module_id: content.module_id,
                                  course_id: content.course_id
                                });
                                setIsEditContentOpen(true);
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                              {content.currentVersion && (
                                <>
                                  <DropdownMenuItem onClick={() => {
                                    setEditingContent(content);
                                    setIsUploadNewVersionOpen(true);
                                  }}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload New Version
                                  </DropdownMenuItem>
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
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => {
                                  setContentToDelete(content);
                                  setIsDeleteContentOpen(true);
                                }}
                              >
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

        {/* Edit Content Dialog */}
        <Dialog open={isEditContentOpen} onOpenChange={setIsEditContentOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Content</DialogTitle>
            </DialogHeader>
            <EditContentForm />
          </DialogContent>
        </Dialog>

        {/* Delete Content Confirmation Dialog */}
        <Dialog open={isDeleteContentOpen} onOpenChange={setIsDeleteContentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Content</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the content "{contentToDelete?.title}"? This action cannot be undone and will remove all associated versions.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteContentOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteContent}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Content
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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

        {/* Version Comparison Dialog */}
        <Dialog open={isVersionCompareOpen} onOpenChange={setIsVersionCompareOpen}>
          <DialogContent className="max-w-5xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Compare Versions - {selectedContent?.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Side-by-side comparison of content versions
              </p>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
              {compareVersions.v1 && compareVersions.v2 && (
                <VersionCompare 
                  v1={compareVersions.v1} 
                  v2={compareVersions.v2}
                  contentTitle={selectedContent?.title || ''}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Upload New Version Dialog */}
        <Dialog open={isUploadNewVersionOpen} onOpenChange={setIsUploadNewVersionOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload New Version
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Create a new version of this content while preserving the history
              </p>
            </DialogHeader>
            <UploadNewVersionForm />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}