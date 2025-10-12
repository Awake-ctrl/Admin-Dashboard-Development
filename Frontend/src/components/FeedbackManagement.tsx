import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  MoreHorizontal, Star, MessageCircle, Reply, Trash2, Clock, AlertCircle, 
  CheckCircle, UserPlus, Flag, TrendingUp, Archive, FileText, Tag, 
  AlertTriangle, ThumbsUp, Eye, EyeOff, Send, Users, Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner@2.0.3";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

// Response Templates
const responseTemplates = [
  {
    id: 1,
    name: "Technical Issue - Investigating",
    content: "Thank you for reporting this issue. Our technical team is investigating the problem and we'll update you within 24 hours with a resolution."
  },
  {
    id: 2,
    name: "Content Request - Acknowledged",
    content: "We appreciate your suggestion! We've added this to our content roadmap and will review it with our course creators."
  },
  {
    id: 3,
    name: "Browser Cache Clear",
    content: "Please try clearing your browser cache and cookies, then log in again. Here's how: [Instructions]. Let us know if the issue persists."
  },
  {
    id: 4,
    name: "Escalated to Engineering",
    content: "This issue has been escalated to our engineering team for priority resolution. We'll keep you updated on the progress."
  },
];

// Team Members for Assignment
const teamMembers = [
  { id: 1, name: "John Smith", role: "Senior Support", avatar: "JS" },
  { id: 2, name: "Carol Davis", role: "Technical Support", avatar: "CD" },
  { id: 3, name: "Mike Wilson", role: "Content Support", avatar: "MW" },
  { id: 4, name: "Sarah Chen", role: "Escalation Manager", avatar: "SC" },
];

const tickets = [
  {
    id: 1,
    title: "Video quality issue in React lesson 3",
    student: "Emma Davis",
    studentEmail: "emma.davis@example.com",
    course: "Introduction to React",
    priority: "high",
    status: "open",
    category: "technical",
    created: "2024-01-15",
    lastUpdate: "2024-01-15",
    description: "The video quality in lesson 3 is quite poor and hard to follow. Could you please fix this?",
    assignedTo: null,
    tags: ["video", "quality"],
    slaDeadline: "2024-01-16 15:00",
    responses: [],
    internalNotes: [],
    actions: []
  },
  {
    id: 2,
    title: "Assignment submission not working",
    student: "Mike Johnson",
    studentEmail: "mike.johnson@example.com",
    course: "Advanced JavaScript",
    priority: "urgent",
    status: "in_progress",
    category: "technical",
    created: "2024-01-14",
    lastUpdate: "2024-01-14",
    description: "I can't submit my assignment. The submit button doesn't work.",
    assignedTo: "Carol Davis",
    tags: ["bug", "assignment"],
    slaDeadline: "2024-01-14 18:00",
    responses: [
      {
        id: 1,
        author: "Support Team",
        type: "public",
        message: "We're looking into this issue. Could you try clearing your browser cache?",
        timestamp: "2024-01-14 10:30"
      }
    ],
    internalNotes: [
      {
        id: 1,
        author: "Carol Davis",
        message: "Replicated the issue. Appears to be a frontend validation bug.",
        timestamp: "2024-01-14 11:00"
      }
    ],
    actions: [
      {
        id: 1,
        type: "status_change",
        from: "open",
        to: "in_progress",
        user: "Carol Davis",
        timestamp: "2024-01-14 10:00"
      }
    ]
  },
  {
    id: 3,
    title: "Request for additional resources",
    student: "Sarah Wilson",
    studentEmail: "sarah.wilson@example.com",
    course: "UI/UX Design",
    priority: "low",
    status: "resolved",
    category: "content",
    created: "2024-01-12",
    lastUpdate: "2024-01-13",
    description: "Could you add more examples of mobile app design patterns?",
    assignedTo: "Mike Wilson",
    tags: ["content", "enhancement"],
    slaDeadline: "2024-01-19 12:00",
    responses: [
      {
        id: 1,
        author: "Carol Davis",
        type: "public",
        message: "I've added 5 new mobile design examples to the resources section.",
        timestamp: "2024-01-13 14:20"
      }
    ],
    internalNotes: [],
    actions: [
      {
        id: 1,
        type: "resolved",
        user: "Mike Wilson",
        resolution: "Added requested resources",
        timestamp: "2024-01-13 14:20"
      }
    ]
  }
];

const reviews = [
  {
    id: 1,
    student: "Sarah Wilson",
    studentEmail: "sarah.wilson@example.com",
    course: "Introduction to React",
    rating: 5,
    comment: "Excellent course! The explanations are clear and the examples are very helpful.",
    date: "2024-01-15",
    status: "published",
    helpful: 12,
    isFeatured: true,
    sentiment: "positive",
    instructorResponse: null,
    flagged: false,
    type: "review"
  },
  {
    id: 2,
    student: "Mike Johnson",
    studentEmail: "mike.johnson@example.com",
    course: "Advanced JavaScript",
    rating: 4,
    comment: "Great content but could use more practical exercises. Overall very informative.",
    date: "2024-01-14",
    status: "published",
    helpful: 8,
    isFeatured: false,
    sentiment: "positive",
    instructorResponse: {
      author: "Prof. John Smith",
      message: "Thank you for the feedback! We're adding more exercises in the next update.",
      timestamp: "2024-01-14 16:00"
    },
    flagged: false,
    type: "review"
  },
  {
    id: 3,
    student: "Alex Kumar",
    studentEmail: "alex.kumar@example.com",
    course: "Data Structures",
    rating: 2,
    comment: "The pace is too fast and some concepts are not explained well. Disappointed.",
    date: "2024-01-13",
    status: "published",
    helpful: 3,
    isFeatured: false,
    sentiment: "negative",
    instructorResponse: null,
    flagged: true,
    type: "review"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'resolved': return 'bg-green-100 text-green-800';
    case 'closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open': return AlertCircle;
    case 'in_progress': return Clock;
    case 'resolved': return CheckCircle;
    case 'closed': return CheckCircle;
    default: return AlertCircle;
  }
};

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export function FeedbackManagement() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEscalateDialogOpen, setIsEscalateDialogOpen] = useState(false);
  const [isInternalNoteDialogOpen, setIsInternalNoteDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isReviewResponseDialogOpen, setIsReviewResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  
  // Track current item for actions
  const [currentActionItem, setCurrentActionItem] = useState(null);

  // Action Handlers
  const handleAssignTicket = (ticketId: number, assignee: string) => {
    toast.success(`Ticket #${ticketId} assigned to ${assignee}`);
    setIsAssignDialogOpen(false);
    setSelectedAssignee("");
  };

  const handleEscalate = (ticketId: number) => {
    toast.success(`Ticket #${ticketId} escalated to senior support`);
    setIsEscalateDialogOpen(false);
  };

  const handleAddInternalNote = (ticketId: number, note: string) => {
    toast.success("Internal note added");
    setIsInternalNoteDialogOpen(false);
    setInternalNoteText("");
  };

  const handleResolveTicket = (ticketId: number, resolution: string) => {
    toast.success(`Ticket #${ticketId} marked as resolved`);
    setIsResolveDialogOpen(false);
    setResolutionNotes("");
  };

  const handleChangePriority = (ticketId: number, priority: string) => {
    toast.success(`Priority changed to ${priority}`);
  };

  const handleChangeStatus = (ticketId: number, status: string) => {
    toast.success(`Status changed to ${status}`);
  };

  const handleSendResponse = (ticketId: number, message: string) => {
    toast.success("Response sent to student");
    setIsResponseDialogOpen(false);
    setResponseText("");
    setSelectedTemplate("");
  };

  const handleReviewResponse = (reviewId: number, message: string) => {
    toast.success("Response published");
    setIsReviewResponseDialogOpen(false);
    setResponseText("");
  };

  const handleFeatureReview = (reviewId: number) => {
    toast.success("Review marked as featured");
  };

  const handleFlagReview = (reviewId: number) => {
    toast.success("Review flagged for review");
  };

  const handleHideReview = (reviewId: number) => {
    toast.success("Review hidden from public view");
  };

  const handleBulkAction = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items first");
      return;
    }
    
    switch (bulkAction) {
      case "assign":
        toast.success(`${selectedItems.length} tickets assigned`);
        break;
      case "close":
        toast.success(`${selectedItems.length} tickets closed`);
        break;
      case "priority":
        toast.success(`Priority updated for ${selectedItems.length} tickets`);
        break;
      default:
        toast.error("Please select an action");
    }
    
    setSelectedItems([]);
    setBulkAction("");
  };

  const TicketDetails = ({ ticket }) => {
    const StatusIcon = getStatusIcon(ticket.status);
    
    return (
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {/* Header with Quick Actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <StatusIcon className="w-5 h-5 text-muted-foreground mt-1" />
              <div>
                <h3 className="text-foreground">{ticket.title}</h3>
                <p className="text-muted-foreground text-sm">
                  #{ticket.id} • Created {ticket.created}
                </p>
                {ticket.tags && ticket.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {ticket.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(ticket.priority)}>
                {ticket.priority}
              </Badge>
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* SLA Warning */}
          {ticket.slaDeadline && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm text-orange-900">SLA Deadline</p>
                <p className="text-xs text-orange-700">{ticket.slaDeadline}</p>
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm"
              onClick={() => {
                setCurrentActionItem(ticket);
                setIsResponseDialogOpen(true);
              }}
            >
              <Reply className="w-4 h-4 mr-2" />
              Respond
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setCurrentActionItem(ticket);
                setIsAssignDialogOpen(true);
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Assign
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setCurrentActionItem(ticket);
                setIsInternalNoteDialogOpen(true);
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Add Note
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setCurrentActionItem(ticket);
                setIsEscalateDialogOpen(true);
              }}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Escalate
            </Button>
            {ticket.status !== "resolved" && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setCurrentActionItem(ticket);
                  setIsResolveDialogOpen(true);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve
              </Button>
            )}
          </div>

          <Separator />

          {/* Ticket Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Student</Label>
              <p className="text-foreground">{ticket.student}</p>
              <p className="text-muted-foreground text-xs">{ticket.studentEmail}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Course</Label>
              <p className="text-foreground">{ticket.course}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Category</Label>
              <p className="text-foreground capitalize">{ticket.category}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Assigned To</Label>
              <p className="text-foreground">{ticket.assignedTo || "Unassigned"}</p>
            </div>
          </div>

          {/* Priority and Status Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground mb-2 block">Change Priority</Label>
              <Select 
                defaultValue={ticket.priority}
                onValueChange={(value) => handleChangePriority(ticket.id, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground mb-2 block">Change Status</Label>
              <Select 
                defaultValue={ticket.status}
                onValueChange={(value) => handleChangeStatus(ticket.id, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <Label className="text-muted-foreground">Description</Label>
            <p className="text-foreground mt-1 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Public Responses */}
          {ticket.responses && ticket.responses.length > 0 && (
            <div>
              <Label className="text-muted-foreground mb-2 block">Conversation History</Label>
              <div className="space-y-3">
                {ticket.responses.map((response) => (
                  <div key={response.id} className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {response.type === "public" ? "Public" : "Internal"}
                        </Badge>
                        <span className="text-foreground">{response.author}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{response.timestamp}</span>
                    </div>
                    <p className="text-foreground">{response.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Notes */}
          {ticket.internalNotes && ticket.internalNotes.length > 0 && (
            <div>
              <Label className="text-muted-foreground mb-2 block">Internal Notes</Label>
              <div className="space-y-3">
                {ticket.internalNotes.map((note) => (
                  <div key={note.id} className="p-3 border rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-yellow-600" />
                        <span className="text-foreground">{note.author}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{note.timestamp}</span>
                    </div>
                    <p className="text-foreground">{note.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action History */}
          {ticket.actions && ticket.actions.length > 0 && (
            <div>
              <Label className="text-muted-foreground mb-2 block">Action History</Label>
              <div className="space-y-2">
                {ticket.actions.map((action) => (
                  <div key={action.id} className="p-2 border rounded text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-foreground">
                          {action.type === "status_change" && `Status changed from ${action.from} to ${action.to}`}
                          {action.type === "resolved" && `Resolved: ${action.resolution}`}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">{action.timestamp}</span>
                    </div>
                    <p className="text-muted-foreground text-xs ml-5">by {action.user}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="space-y-6">
      {/* Feedback Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">23</div>
            <p className="text-xs text-red-600">+5 today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">2.4h</div>
            <p className="text-xs text-green-600">-30min vs target</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">94%</div>
            <p className="text-xs text-green-600">+2% this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-foreground">4.6</span>
              <div className="flex">
                {renderStars(5)}
              </div>
            </div>
            <p className="text-xs text-green-600">+0.2 this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Management */}
      <Card>
        <CardHeader>
          <CardTitle>Support & Feedback Management</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
              <TabsTrigger value="reviews">Course Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tickets" className="space-y-4">
              {/* Filters and Bulk Actions */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex gap-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedItems.length} selected</Badge>
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Bulk Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assign">Assign to Agent</SelectItem>
                        <SelectItem value="priority">Change Priority</SelectItem>
                        <SelectItem value="status">Change Status</SelectItem>
                        <SelectItem value="close">Close Tickets</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleBulkAction} size="sm">Apply</Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedItems([])}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectedItems.length === tickets.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems(tickets.map(t => t.id));
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => {
                    const StatusIcon = getStatusIcon(ticket.status);
                    const isSelected = selectedItems.includes(ticket.id);
                    return (
                      <TableRow key={ticket.id} className={isSelected ? "bg-muted/50" : ""}>
                        <TableCell>
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedItems([...selectedItems, ticket.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== ticket.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <StatusIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-foreground max-w-[200px] truncate">{ticket.title}</p>
                              <p className="text-muted-foreground text-xs">#{ticket.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {ticket.student.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-foreground">{ticket.student}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[150px] truncate">
                          {ticket.course}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {ticket.assignedTo ? (
                            <Badge variant="outline" className="text-xs">
                              {ticket.assignedTo}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {ticket.created}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSelectedTicket(ticket)}>
                                  <MessageCircle className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setCurrentActionItem(ticket);
                                  setIsResponseDialogOpen(true);
                                }}>
                                  <Reply className="mr-2 h-4 w-4" />
                                  Quick Response
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setCurrentActionItem(ticket);
                                  setIsAssignDialogOpen(true);
                                }}>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Assign Agent
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                  setCurrentActionItem(ticket);
                                  setIsEscalateDialogOpen(true);
                                }}>
                                  <TrendingUp className="mr-2 h-4 w-4" />
                                  Escalate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setCurrentActionItem(ticket);
                                  setIsInternalNoteDialogOpen(true);
                                }}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Add Internal Note
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {ticket.status !== "resolved" && (
                                  <DropdownMenuItem onClick={() => {
                                    setCurrentActionItem(ticket);
                                    setIsResolveDialogOpen(true);
                                  }}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Resolve Ticket
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleChangeStatus(ticket.id, "closed")}
                                >
                                  <Archive className="mr-2 h-4 w-4" />
                                  Close Ticket
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              {/* Review Filters */}
              <div className="flex gap-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiment</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Card-based Review Display */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className={`${review.flagged ? 'border-red-300 bg-red-50/30' : ''} ${review.isFeatured ? 'border-yellow-300 bg-yellow-50/30' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Header Section */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>
                                {review.student.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-foreground">{review.student}</p>
                                {review.isFeatured && (
                                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                    <Star className="w-3 h-3 mr-1 fill-yellow-600" />
                                    Featured
                                  </Badge>
                                )}
                                {review.flagged && (
                                  <Badge className="bg-red-100 text-red-800 border-red-300">
                                    <Flag className="w-3 h-3 mr-1" />
                                    Flagged
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{review.studentEmail}</p>
                              <p className="text-sm text-muted-foreground mt-1">{review.course}</p>
                            </div>
                          </div>
                          
                          {/* Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setSelectedReview(review)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setCurrentActionItem(review);
                                setIsReviewResponseDialogOpen(true);
                              }}>
                                <Reply className="mr-2 h-4 w-4" />
                                Respond Publicly
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleFeatureReview(review.id)}>
                                <Star className="mr-2 h-4 w-4" />
                                {review.isFeatured ? "Unfeature" : "Feature"} Review
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleFlagReview(review.id)}>
                                <Flag className="mr-2 h-4 w-4" />
                                {review.flagged ? "Unflag" : "Flag"} for Review
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                Forward to Instructor
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleHideReview(review.id)}
                              >
                                <EyeOff className="mr-2 h-4 w-4" />
                                Hide Review
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Rating and Sentiment */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground">({review.rating}.0)</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={
                              review.sentiment === "positive" ? "text-green-700 border-green-300 bg-green-50" :
                              review.sentiment === "negative" ? "text-red-700 border-red-300 bg-red-50" :
                              "text-gray-700 border-gray-300 bg-gray-50"
                            }
                          >
                            {review.sentiment}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{review.helpful} helpful</span>
                          </div>
                        </div>

                        {/* Review Comment */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-foreground">{review.comment}</p>
                        </div>

                        {/* Instructor Response */}
                        {review.instructorResponse && (
                          <div className="ml-8 pl-4 border-l-2 border-blue-300 bg-blue-50/50 p-4 rounded-r-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Reply className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-900">{review.instructorResponse.author}</span>
                              <span className="text-xs text-blue-600">{review.instructorResponse.timestamp}</span>
                            </div>
                            <p className="text-blue-900">{review.instructorResponse.message}</p>
                          </div>
                        )}

                        {/* Footer with metadata and quick actions */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{review.date}</span>
                            <Badge variant="outline">{review.status}</Badge>
                          </div>
                          <div className="flex gap-2">
                            {!review.instructorResponse && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setCurrentActionItem(review);
                                  setIsReviewResponseDialogOpen(true);
                                }}
                              >
                                <Reply className="w-4 h-4 mr-2" />
                                Respond
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant={review.isFeatured ? "default" : "outline"}
                              onClick={() => handleFeatureReview(review.id)}
                            >
                              <Star className={`w-4 h-4 mr-2 ${review.isFeatured ? 'fill-current' : ''}`} />
                              {review.isFeatured ? "Featured" : "Feature"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Ticket Details Dialog */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Ticket Details</DialogTitle>
            </DialogHeader>
            <TicketDetails ticket={selectedTicket} />
          </DialogContent>
        </Dialog>
      )}

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Response to Student</DialogTitle>
            <DialogDescription>
              This response will be sent to the student via email and added to the ticket history.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Quick Templates</Label>
              <Select value={selectedTemplate} onValueChange={(value) => {
                setSelectedTemplate(value);
                const template = responseTemplates.find(t => t.id.toString() === value);
                if (template) {
                  setResponseText(template.content);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent>
                  {responseTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="response">Response Message</Label>
              <Textarea
                id="response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Enter your response to the student..."
                rows={6}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsResponseDialogOpen(false);
                setResponseText("");
                setSelectedTemplate("");
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (currentActionItem) {
                  handleSendResponse(currentActionItem.id, responseText);
                }
              }}>
                <Send className="w-4 h-4 mr-2" />
                Send Response
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>
              Assign this ticket to a team member for resolution.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Team Member</Label>
              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agent..." />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.name}>
                      <div className="flex items-center gap-2">
                        <span>{member.name}</span>
                        <span className="text-xs text-muted-foreground">({member.role})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAssignDialogOpen(false);
                setSelectedAssignee("");
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (currentActionItem && selectedAssignee) {
                  handleAssignTicket(currentActionItem.id, selectedAssignee);
                }
              }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Ticket
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Escalate Dialog */}
      <AlertDialog open={isEscalateDialogOpen} onOpenChange={setIsEscalateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Escalate Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              This will escalate the ticket to senior support and mark it as high priority. 
              The escalation team will be notified immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (currentActionItem) {
                handleEscalate(currentActionItem.id);
              }
            }}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Escalate Ticket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Internal Note Dialog */}
      <Dialog open={isInternalNoteDialogOpen} onOpenChange={setIsInternalNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Internal Note</DialogTitle>
            <DialogDescription>
              Internal notes are only visible to support team members and won't be sent to students.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="internal-note">Internal Note</Label>
              <Textarea
                id="internal-note"
                value={internalNoteText}
                onChange={(e) => setInternalNoteText(e.target.value)}
                placeholder="Add notes about troubleshooting, investigation, or team coordination..."
                rows={5}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsInternalNoteDialogOpen(false);
                setInternalNoteText("");
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (currentActionItem) {
                  handleAddInternalNote(currentActionItem.id, internalNoteText);
                }
              }}>
                <FileText className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resolve Ticket Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Ticket</DialogTitle>
            <DialogDescription>
              Mark this ticket as resolved and provide a resolution summary.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution">Resolution Notes</Label>
              <Textarea
                id="resolution"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe how the issue was resolved..."
                rows={4}
              />
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900">
                    The student will be notified that their ticket has been resolved.
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    They can reopen the ticket if the issue persists.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsResolveDialogOpen(false);
                setResolutionNotes("");
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (currentActionItem) {
                  handleResolveTicket(currentActionItem.id, resolutionNotes);
                }
              }}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Resolved
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Response Dialog */}
      <Dialog open={isReviewResponseDialogOpen} onOpenChange={setIsReviewResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Your response will be publicly visible and posted under the review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {currentActionItem && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(currentActionItem.rating)}
                  <span className="text-sm text-muted-foreground">
                    by {currentActionItem.student}
                  </span>
                </div>
                <p className="text-sm text-foreground">{currentActionItem.comment}</p>
              </div>
            )}
            <div>
              <Label htmlFor="review-response">Your Response</Label>
              <Textarea
                id="review-response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Thank the student and address their feedback..."
                rows={5}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsReviewResponseDialogOpen(false);
                setResponseText("");
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (currentActionItem) {
                  handleReviewResponse(currentActionItem.id, responseText);
                }
              }}>
                <Send className="w-4 h-4 mr-2" />
                Publish Response
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Details Dialog */}
      {selectedReview && (
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {selectedReview.student.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground">{selectedReview.student}</p>
                    <p className="text-sm text-muted-foreground">{selectedReview.studentEmail}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {renderStars(selectedReview.rating)}
                  <Badge variant="outline">{selectedReview.sentiment}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-muted-foreground">Course</Label>
                <p className="text-foreground">{selectedReview.course}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Review</Label>
                <p className="text-foreground mt-1">{selectedReview.comment}</p>
              </div>

              {selectedReview.instructorResponse && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label className="text-blue-900">Instructor Response</Label>
                  <p className="text-sm text-blue-900 mt-2">
                    <strong>{selectedReview.instructorResponse.author}:</strong> {selectedReview.instructorResponse.message}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {selectedReview.instructorResponse.timestamp}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Date Posted</Label>
                  <p className="text-foreground">{selectedReview.date}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Helpful Votes</Label>
                  <p className="text-foreground">{selectedReview.helpful}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="text-foreground capitalize">{selectedReview.status}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Featured</Label>
                  <p className="text-foreground">{selectedReview.isFeatured ? "Yes" : "No"}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  setSelectedReview(null);
                  setCurrentActionItem(selectedReview);
                  setIsReviewResponseDialogOpen(true);
                }}>
                  <Reply className="w-4 h-4 mr-2" />
                  Respond
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleFeatureReview(selectedReview.id);
                    setSelectedReview(null);
                  }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {selectedReview.isFeatured ? "Unfeature" : "Feature"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleFlagReview(selectedReview.id);
                    setSelectedReview(null);
                  }}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  {selectedReview.flagged ? "Unflag" : "Flag"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}