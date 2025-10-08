import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MoreHorizontal, Edit, Trash2, Download, Upload, FileText, Video, Image, Link, Eye, History, Plus } from "lucide-react";
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
import { contentApi, courseApi, topicApi, statsApi } from "./api/course";
import { Content, ContentVersion, Course, Topic, ContentFormData, ContentStats, QuizFormData, QuizQuestion } from "../types";

export const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("content");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState<boolean>(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [contentVersions, setContentVersions] = useState<{[key: number]: ContentVersion[]}>({});
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // Load data from API
  useEffect(() => {
    loadContents();
    loadCourses();
    loadTopics();
    loadStats();
  }, []);

  const loadContents = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await contentApi.getContents();
      setContents(data);
    } catch (error) {
      console.error('Failed to load contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async (): Promise<void> => {
    try {
      const data = await courseApi.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const loadTopics = async (): Promise<void> => {
    try {
      const data = await topicApi.getTopics();
      setTopics(data);
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const loadStats = async (): Promise<void> => {
    try {
      const data = await statsApi.getContentStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadContentVersions = async (contentId: number): Promise<void> => {
    try {
      const versions = await contentApi.getContentVersions(contentId);
      setContentVersions(prev => ({
        ...prev,
        [contentId]: versions
      }));
    } catch (error) {
      console.error('Failed to load content versions:', error);
    }
  };

  const UploadForm: React.FC<{ 
    onSave: (data: ContentFormData) => Promise<void>;
  }> = ({ onSave }) => {
    const [formData, setFormData] = useState<ContentFormData>({
      title: "",
      description: "",
      content_type: "document",
      file_path: "",
      file_size: "",
      topic_id: undefined,
      course_id: undefined,
      author: ""
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setFormData(prev => ({
          ...prev,
          title: file.name.split('.')[0],
          file_size: formatFileSize(file.size)
        }));

        // Simulate upload progress
        setIsUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setFormData(prev => ({ ...prev, file_path: file.name }));
          }
        }, 200);
      }
    };

    const handleSave = async (): Promise<void> => {
      try {
        if (selectedFile) {
          // Upload file first
          const uploadResult = await contentApi.uploadFile(selectedFile);
          console.log('File uploaded:', uploadResult);
        }
        
        await onSave(formData);
        setIsUploadDialogOpen(false);
        loadContents();
      } catch (error) {
        console.error('Failed to save content:', error);
      }
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <Select 
              value={formData.content_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
            >
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="content-course">Assign to Course</Label>
            <Select 
              value={formData.course_id?.toString() || ""} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, course_id: value ? parseInt(value) : undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="content-topic">Assign to Topic</Label>
            <Select 
              value={formData.topic_id?.toString() || ""} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, topic_id: value ? parseInt(value) : undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id.toString()}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="file-upload">Upload File</Label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
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
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            placeholder="Enter author name"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUploading}>
            Upload Content
          </Button>
        </div>
      </div>
    );
  };

  const QuizForm: React.FC<{ 
    quiz?: Content | null;
    onSave: (data: QuizFormData) => Promise<void>;
  }> = ({ quiz = null, onSave }) => {
    const [formData, setFormData] = useState<QuizFormData>({
      title: quiz?.title || "",
      description: quiz?.description || "",
      course: quiz?.course_id?.toString() || "",
      timeLimit: 30,
      passingScore: 70,
      questions: quiz ? [] : [
        { question: "", options: ["", "", "", ""], correctAnswer: 0 }
      ]
    });

    const addQuestion = (): void => {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]
      }));
    };

    const updateQuestion = (index: number, field: string, value: string | number): void => {
      setFormData(prev => {
        const newQuestions = [...prev.questions];
        if (field === 'question') {
          newQuestions[index].question = value as string;
        } else if (field.startsWith('option')) {
          const optIndex = parseInt(field.replace('option', ''));
          newQuestions[index].options[optIndex] = value as string;
        } else if (field === 'correctAnswer') {
          newQuestions[index].correctAnswer = value as number;
        }
        return { ...prev, questions: newQuestions };
      });
    };

    const handleSave = async (): Promise<void> => {
      try {
        await onSave(formData);
        setIsCreateQuizOpen(false);
        loadContents();
      } catch (error) {
        console.error('Failed to save quiz:', error);
      }
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
            <Select 
              value={formData.course} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, course: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.title}
                  </SelectItem>
                ))}
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
                      onValueChange={(value) => updateQuestion(index, 'correctAnswer', parseInt(value))}
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
          <Button onClick={handleSave}>
            {quiz ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </div>
      </div>
    );
  };

  const handleCreateContent = async (contentData: ContentFormData): Promise<void> => {
    await contentApi.createContent(contentData);
  };

  const handleCreateQuiz = async (quizData: QuizFormData): Promise<void> => {
    const contentData: ContentFormData = {
      title: quizData.title,
      description: quizData.description,
      content_type: "quiz",
      author: "System", // You might want to get this from user context
      course_id: quizData.course ? parseInt(quizData.course) : undefined
    };
    await contentApi.createContent(contentData);
  };

  const handleDeleteContent = async (contentId: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      await contentApi.deleteContent(contentId);
      loadContents();
    }
  };

  const handleDownloadContent = async (contentId: number): Promise<void> => {
    try {
      await contentApi.incrementDownload(contentId);
      // In a real app, you would trigger the actual file download here
      alert('Download started!');
      loadContents(); // Refresh to update download count
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getTypeIcon = (type: string): React.FC<{ className?: string }> => {
    switch (type) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'image': return Image;
      case 'quiz': return FileText;
      case 'link': return Link;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (size: string): string => {
    if (!size) return '0 Bytes';
    return size;
  };

  return (
    <div className="space-y-6">
      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats?.total_content || 0}</div>
            <p className="text-xs text-green-600">+34 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats?.total_documents || 0}</div>
            <p className="text-xs text-muted-foreground">{stats ? Math.round((stats.total_documents / stats.total_content) * 100) : 0}% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats?.total_videos || 0}</div>
            <p className="text-xs text-muted-foreground">{stats ? Math.round((stats.total_videos / stats.total_content) * 100) : 0}% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats?.storage_used || '0 GB'}</div>
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
                  <QuizForm onSave={handleCreateQuiz} />
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
                  <UploadForm onSave={handleCreateContent} />
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
              {loading ? (
                <div className="text-center py-8">Loading content...</div>
              ) : (
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
                    {contents.map((item) => {
                      const TypeIcon = getTypeIcon(item.content_type);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <TypeIcon className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="text-foreground">{item.title}</p>
                                <p className="text-muted-foreground text-xs capitalize">{item.content_type}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.course?.title || 'Unassigned'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.author}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatFileSize(item.file_size || '')}
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
                                <DropdownMenuItem onClick={() => handleDownloadContent(item.id)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => loadContentVersions(item.id)}>
                                  <History className="mr-2 h-4 w-4" />
                                  Version History
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteContent(item.id)}
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
            </TabsContent>
            
            <TabsContent value="versions" className="space-y-4">
              <div className="space-y-4">
                {contents.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {contentVersions[item.id]?.map((version, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">v{version.version}</Badge>
                              <div>
                                <p className="text-foreground">{version.changes}</p>
                                <p className="text-muted-foreground text-xs">
                                  {new Date(version.created_at).toLocaleDateString()} • {version.file_size}
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
                        {(!contentVersions[item.id] || contentVersions[item.id].length === 0) && (
                          <div className="text-center text-muted-foreground py-4">
                            No version history available
                          </div>
                        )}
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
};