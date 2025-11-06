import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  MoreHorizontal, Star, MessageCircle, Reply, Clock, AlertCircle, 
  CheckCircle, UserPlus, Flag, TrendingUp, Archive, FileText, 
  AlertTriangle, ThumbsUp, Eye, EyeOff, Send, Users, Loader2
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
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

// API Configuration
const API_BASE_URL = "http://localhost:8000/api";

// Types
interface TicketResponse {
  id: number;
  author: string;
  type: string;
  message: string;
  timestamp: string;
}

interface InternalNote {
  id: number;
  author: string;
  message: string;
  timestamp: string;
}

interface TicketAction {
  id: number;
  type: string;
  user: string;
  from_status?: string;
  to_status?: string;
  resolution?: string;
  timestamp: string;
}

interface Ticket {
  id: number;
  title: string;
  student: string;
  student_email: string;
  course: string;
  priority: string;
  status: string;
  category: string;
  description: string;
  assigned_to: string | null;
  tags: string[];
  sla_deadline: string | null;
  created: string;
  last_update: string;
  responses: TicketResponse[];
  internal_notes: InternalNote[];
  actions: TicketAction[];
}

interface InstructorResponse {
  id: number;
  author: string;
  message: string;
  timestamp: string;
}

interface Review {
  id: number;
  student: string;
  student_email: string;
  course: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
  helpful: number;
  is_featured: boolean;
  sentiment: string;
  instructor_response: InstructorResponse | null;
  flagged: boolean;
}

interface FeedbackStats {
  open_tickets: number;
  my_assigned_tickets: number;
  satisfaction_rating: number;
  total_reviews: number;
  positive_reviews: number;
  negative_reviews: number;
}

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

// Mock current user (in real app, this would come from auth context)
const currentUser = "Carol Davis";

// Instructors list
const instructors = [
  { id: 1, name: "Prof. Ramesh Kumar", subject: "Physics" },
  { id: 2, name: "Dr. Priya Sharma", subject: "Mathematics" },
  { id: 3, name: "Prof. Suresh Iyer", subject: "Chemistry" },
  { id: 4, name: "Dr. Anjali Rao", subject: "Biology" },
  { id: 5, name: "Prof. Amit Verma", subject: "Quantitative Aptitude" },
  { id: 6, name: "Dr. Neha Gupta", subject: "Verbal Ability" },
  { id: 7, name: "Prof. Rajesh Malhotra", subject: "History" },
  { id: 8, name: "Dr. Siddharth Joshi", subject: "Computer Science" },
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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isReviewResponseDialogOpen, setIsReviewResponseDialogOpen] = useState(false);
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  const [isEscalateDialogOpen, setIsEscalateDialogOpen] = useState(false);
  const [isInternalNoteDialogOpen, setIsInternalNoteDialogOpen] = useState(false);
  
  const [responseText, setResponseText] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("Course Instructor");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [bulkActionValue, setBulkActionValue] = useState("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  
  // Track current item for actions
  const [currentActionItem, setCurrentActionItem] = useState<any>(null);

  // Fetch data on mount and tab change
  useEffect(() => {
    fetchStats();
    if (activeTab === "tickets") {
      fetchTickets();
    } else {
      fetchReviews();
    }
  }, [activeTab, statusFilter, priorityFilter, categoryFilter, ratingFilter, sentimentFilter]);

  // API Functions
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      
      const response = await fetch(`${API_BASE_URL}/support-tickets?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        toast.error("Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Error fetching tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (ratingFilter !== "all") params.append("rating", ratingFilter);
      if (sentimentFilter !== "all") params.append("sentiment", sentimentFilter);
      
      const response = await fetch(`${API_BASE_URL}/course-reviews?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  // Action Handlers
  const handleAssignTicket = async (ticketId: number, assignee: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support-tickets/${ticketId}`,
        { 
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assigned_to: assignee })
        }
      );
      
      if (response.ok) {
        toast.success(`Ticket #${ticketId} assigned to ${assignee}`);
        fetchTickets();
        fetchStats();
        setIsAssignDialogOpen(false);
        setSelectedAssignee("");
      } else {
        toast.error("Failed to assign ticket");
      }
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast.error("Error assigning ticket");
    }
  };

  const handleEscalate = async (ticketId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support-tickets/${ticketId}`,
        { 
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            priority: "urgent",
            assigned_to: "Sarah Chen" // Escalation manager
          })
        }
      );
      
      if (response.ok) {
        toast.success(`Ticket #${ticketId} escalated to senior support`);
        fetchTickets();
        fetchStats();
        setIsEscalateDialogOpen(false);
      } else {
        toast.error("Failed to escalate ticket");
      }
    } catch (error) {
      console.error("Error escalating ticket:", error);
      toast.error("Error escalating ticket");
    }
  };

  const handleAddInternalNote = async (ticketId: number, note: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support-tickets/${ticketId}/responses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author: currentUser, type: "internal", message: note })
        }
      );
      
      if (response.ok) {
        toast.success("Internal note added");
        fetchTickets();
        fetchStats();
        setIsInternalNoteDialogOpen(false);
        setInternalNoteText("");
      } else {
        toast.error("Failed to add internal note");
      }
    } catch (error) {
      console.error("Error adding internal note:", error);
      toast.error("Error adding internal note");
    }
  };

  const handleResolveTicket = async (ticketId: number, resolution: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support-tickets/${ticketId}`,
        { 
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "resolved" })
        }
      );
      
      if (response.ok) {
        // Add resolution response
        await fetch(
          `${API_BASE_URL}/support-tickets/${ticketId}/responses`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              author: currentUser, 
              type: "public", 
              message: `Resolution: ${resolution}` 
            })
          }
        );
        
        toast.success(`Ticket #${ticketId} marked as resolved`);
        fetchTickets();
        fetchStats();
        setIsResolveDialogOpen(false);
        setResolutionNotes("");
      } else {
        toast.error("Failed to resolve ticket");
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast.error("Error resolving ticket");
    }
  };

  const handleChangePriority = async (ticketId: number, priority: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support-tickets/${ticketId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priority })
        }
      );
      
      if (response.ok) {
        toast.success(`Priority changed to ${priority}`);
        fetchTickets();
        fetchStats();
      } else {
        toast.error("Failed to change priority");
      }
    } catch (error) {
      console.error("Error changing priority:", error);
      toast.error("Error changing priority");
    }
  };

  const handleChangeStatus = async (ticketId: number, status: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support-tickets/${ticketId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        }
      );
      
      if (response.ok) {
        toast.success(`Status changed to ${status}`);
        fetchTickets();
        fetchStats();
      } else {
        toast.error("Failed to change status");
      }
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Error changing status");
    }
  };

  const handleSendResponse = async (ticketId: number, message: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/support-tickets/${ticketId}/responses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author: currentUser, type: "public", message })
        }
      );
      
      if (response.ok) {
        toast.success("Response sent to student");
        fetchTickets();
        fetchStats();
        setIsResponseDialogOpen(false);
        setResponseText("");
        setSelectedTemplate("");
      } else {
        toast.error("Failed to send response");
      }
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error("Error sending response");
    }
  };

  const handleReviewResponse = async (reviewId: number, message: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/course-reviews/${reviewId}/response`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            author: selectedInstructor,
            message 
          })
        }
      );
      
      if (response.ok) {
        toast.success("Response published");
        fetchReviews();
        fetchStats();
        setIsReviewResponseDialogOpen(false);
        setResponseText("");
        setSelectedInstructor("Course Instructor");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to publish response");
      }
    } catch (error) {
      console.error("Error publishing response:", error);
      toast.error("Error publishing response");
    }
  };

  const handleFeatureReview = async (reviewId: number) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      const response = await fetch(
        `${API_BASE_URL}/course-reviews/${reviewId}`,
        { 
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_featured: !review?.is_featured })
        }
      );
      
      if (response.ok) {
        toast.success("Review featured status toggled");
        fetchReviews();
        fetchStats();
      } else {
        toast.error("Failed to toggle feature status");
      }
    } catch (error) {
      console.error("Error toggling feature status:", error);
      toast.error("Error toggling feature status");
    }
  };

  const handleFlagReview = async (reviewId: number) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      const response = await fetch(
        `${API_BASE_URL}/course-reviews/${reviewId}`,
        { 
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flagged: !review?.flagged })
        }
      );
      
      if (response.ok) {
        toast.success("Review flag status toggled");
        fetchReviews();
        fetchStats();
      } else {
        toast.error("Failed to toggle flag status");
      }
    } catch (error) {
      console.error("Error toggling flag status:", error);
      toast.error("Error toggling flag status");
    }
  };

  const handleHideReview = async (reviewId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/course-reviews/${reviewId}`,
        { 
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "hidden" })
        }
      );
      
      if (response.ok) {
        toast.success("Review hidden from public view");
        fetchReviews();
        fetchStats();
      } else {
        toast.error("Failed to hide review");
      }
    } catch (error) {
      console.error("Error hiding review:", error);
      toast.error("Error hiding review");
    }
  };

  const handleBulkAction = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items first");
      return;
    }
    
    if (!bulkActionValue && bulkAction !== "close") {
      toast.error("Please select a value");
      return;
    }
    
    try {
      // Process each ticket
      const promises = selectedItems.map(ticketId => {
        let updateData: any = {};
        
        switch(bulkAction) {
          case "assign":
            updateData = { assigned_to: bulkActionValue };
            break;
          case "change_priority":
            updateData = { priority: bulkActionValue };
            break;
          case "change_status":
            updateData = { status: bulkActionValue };
            break;
          case "close":
            updateData = { status: "closed" };
            break;
        }
        
        return fetch(`${API_BASE_URL}/support-tickets/${ticketId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData)
        });
      });
      
      await Promise.all(promises);
      
      toast.success(`${selectedItems.length} tickets updated`);
      fetchTickets();
      fetchStats();
      setSelectedItems([]);
      setBulkAction("");
      setBulkActionValue("");
      setIsBulkActionDialogOpen(false);
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Error performing bulk action");
    }
  };

  const TicketDetails = ({ ticket }: { ticket: Ticket }) => {
    const StatusIcon = getStatusIcon(ticket.status);
    
    return (
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {/* Header with Quick Actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <StatusIcon className="w-5 h-5 text-muted-foreground mt-1" />
              <div>
                <h3 className="text-foreground font-semibold">{ticket.title}</h3>
                <p className="text-muted-foreground text-sm">
                  #{ticket.id} • Created {new Date(ticket.created).toLocaleDateString()}
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
          {ticket.sla_deadline && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm text-orange-900 font-medium">SLA Deadline</p>
                <p className="text-xs text-orange-700">
                  {new Date(ticket.sla_deadline).toLocaleString()}
                </p>
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
              <Label className="text-muted-foreground text-xs">Student</Label>
              <p className="text-foreground font-medium">{ticket.student}</p>
              <p className="text-muted-foreground text-xs">{ticket.student_email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Course</Label>
              <p className="text-foreground font-medium">{ticket.course}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Category</Label>
              <p className="text-foreground capitalize">{ticket.category}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Assigned To</Label>
              <p className="text-foreground">{ticket.assigned_to || "Unassigned"}</p>
            </div>
          </div>

          {/* Priority and Status Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground mb-2 block text-xs">Change Priority</Label>
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
              <Label className="text-muted-foreground mb-2 block text-xs">Change Status</Label>
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
            <Label className="text-muted-foreground text-xs">Description</Label>
            <p className="text-foreground mt-1 whitespace-pre-wrap text-sm">{ticket.description}</p>
          </div>

          {/* Public Responses */}
          {ticket.responses && ticket.responses.length > 0 && (
            <div>
              <Label className="text-muted-foreground mb-2 block text-xs">Conversation History</Label>
              <div className="space-y-3">
                {ticket.responses.map((response) => (
                  <div key={response.id} className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {response.type === "public" ? "Public" : "Internal"}
                        </Badge>
                        <span className="text-foreground text-sm font-medium">{response.author}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {new Date(response.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-foreground text-sm">{response.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Notes */}
          {ticket.internal_notes && ticket.internal_notes.length > 0 && (
            <div>
              <Label className="text-muted-foreground mb-2 block text-xs">Internal Notes</Label>
              <div className="space-y-3">
                {ticket.internal_notes.map((note) => (
                  <div key={note.id} className="p-3 border rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-yellow-600" />
                        <span className="text-foreground text-sm font-medium">{note.author}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {new Date(note.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-foreground text-sm">{note.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action History */}
          {ticket.actions && ticket.actions.length > 0 && (
            <div>
              <Label className="text-muted-foreground mb-2 block text-xs">Action History</Label>
              <div className="space-y-2">
                {ticket.actions.map((action) => (
                  <div key={action.id} className="p-2 border rounded text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-foreground text-xs">
                          {action.type === "status_change" && `Status changed from ${action.from_status} to ${action.to_status}`}
                          {action.type === "resolved" && `Resolved: ${action.resolution}`}
                          {action.type === "assigned" && `Assigned from ${action.from_status} to ${action.to_status}`}
                          {action.type === "escalated" && `Escalated to ${action.to_status}`}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {new Date(action.timestamp).toLocaleString()}
                      </span>
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
            <CardTitle className="text-sm text-muted-foreground">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats?.open_tickets || 0}
            </div>
            <p className="text-xs text-red-600">Needs attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">My Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats?.my_assigned_tickets || 0}
            </div>
            <p className="text-xs text-blue-600">Your queue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {stats?.satisfaction_rating?.toFixed(1) || 0}
              </span>
              <div className="flex">
                {renderStars(Math.round(stats?.satisfaction_rating || 0))}
              </div>
            </div>
            <p className="text-xs text-green-600">Excellent rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats?.total_reviews || 0}
            </div>
            <p className="text-xs text-green-600">
              {stats?.positive_reviews || 0} positive
            </p>
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                        <SelectItem value="change_priority">Change Priority</SelectItem>
                        <SelectItem value="change_status">Change Status</SelectItem>
                        <SelectItem value="close">Close Tickets</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => {
                        if (!bulkAction) {
                          toast.error("Please select an action first");
                          return;
                        }
                        setIsBulkActionDialogOpen(true);
                      }} 
                      size="sm" 
                      disabled={!bulkAction}
                    >
                      Apply
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedItems([]);
                        setBulkAction("");
                        setBulkActionValue("");
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectedItems.length === tickets.length && tickets.length > 0}
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
                    {tickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No tickets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      tickets.map((ticket) => {
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
                                  <p className="text-foreground max-w-[200px] truncate font-medium">
                                    {ticket.title}
                                  </p>
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
                                <span className="text-foreground text-sm">{ticket.student}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
                              {ticket.course}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {ticket.assigned_to ? (
                                <Badge variant="outline" className="text-xs">
                                  {ticket.assigned_to}
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
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(ticket.created).toLocaleDateString()}
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
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              {/* Review Filters */}
              <div className="flex gap-4 mb-4">
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
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
                
                <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
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
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews found
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card 
                      key={review.id} 
                      className={`${review.flagged ? 'border-red-300 bg-red-50/30' : ''} ${review.is_featured ? 'border-yellow-300 bg-yellow-50/30' : ''}`}
                    >
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
                                  <p className="text-foreground font-medium">{review.student}</p>
                                  {review.is_featured && (
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
                                <p className="text-sm text-muted-foreground">{review.student_email}</p>
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
                                  {review.is_featured ? "Unfeature" : "Feature"} Review
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleFlagReview(review.id)}>
                                  <Flag className="mr-2 h-4 w-4" />
                                  {review.flagged ? "Unflag" : "Flag"} for Review
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
                          {review.instructor_response && (
                            <div className="ml-8 pl-4 border-l-2 border-blue-300 bg-blue-50/50 p-4 rounded-r-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Reply className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                  {review.instructor_response.author}
                                </span>
                                <span className="text-xs text-blue-600">
                                  {new Date(review.instructor_response.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-blue-900">{review.instructor_response.message}</p>
                            </div>
                          )}

                          {/* Footer with metadata and quick actions */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{new Date(review.date).toLocaleDateString()}</span>
                              <Badge variant="outline">{review.status}</Badge>
                            </div>
                            <div className="flex gap-2">
                              {!review.instructor_response && (
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
                                variant={review.is_featured ? "default" : "outline"}
                                onClick={() => handleFeatureReview(review.id)}
                              >
                                <Star className={`w-4 h-4 mr-2 ${review.is_featured ? 'fill-current' : ''}`} />
                                {review.is_featured ? "Featured" : "Feature"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
                if (currentActionItem && responseText.trim()) {
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
              }} disabled={!selectedAssignee}>
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
                if (currentActionItem && internalNoteText.trim()) {
                  handleAddInternalNote(currentActionItem.id, internalNoteText);
                }
              }} disabled={!internalNoteText.trim()}>
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
              Mark this ticket as resolved and provide a final resolution message to the student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution">Final Resolution Message</Label>
              <Textarea
                id="resolution"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Provide the final resolution message that will be sent to the student..."
                rows={4}
              />
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900">
                    The student will receive this final resolution message and the ticket will be marked as resolved.
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
                if (currentActionItem && resolutionNotes.trim()) {
                  handleResolveTicket(currentActionItem.id, resolutionNotes);
                }
              }} disabled={!resolutionNotes.trim()}>
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
            
            {/* Instructor Selector */}
            <div>
              <Label htmlFor="instructor-select">Responding As</Label>
              <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                <SelectTrigger id="instructor-select">
                  <SelectValue placeholder="Select instructor..." />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map(instructor => (
                    <SelectItem key={instructor.id} value={instructor.name}>
                      {instructor.name} - {instructor.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
                setSelectedInstructor("Course Instructor");
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (currentActionItem && responseText.trim()) {
                  handleReviewResponse(currentActionItem.id, responseText);
                }
              }} disabled={!responseText.trim()}>
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
                    <p className="text-foreground font-medium">{selectedReview.student}</p>
                    <p className="text-sm text-muted-foreground">{selectedReview.student_email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {renderStars(selectedReview.rating)}
                  <Badge variant="outline">{selectedReview.sentiment}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-muted-foreground text-xs">Course</Label>
                <p className="text-foreground font-medium">{selectedReview.course}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Review</Label>
                <p className="text-foreground mt-1">{selectedReview.comment}</p>
              </div>

              {selectedReview.instructor_response && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label className="text-blue-900 text-xs">Instructor Response</Label>
                  <p className="text-sm text-blue-900 mt-2">
                    <strong>{selectedReview.instructor_response.author}:</strong> {selectedReview.instructor_response.message}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {new Date(selectedReview.instructor_response.timestamp).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Date Posted</Label>
                  <p className="text-foreground">{new Date(selectedReview.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Helpful Votes</Label>
                  <p className="text-foreground">{selectedReview.helpful}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <p className="text-foreground capitalize">{selectedReview.status}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Featured</Label>
                  <p className="text-foreground">{selectedReview.is_featured ? "Yes" : "No"}</p>
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
                  {selectedReview.is_featured ? "Unfeature" : "Feature"}
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

      {/* Bulk Action Confirmation Dialog */}
      <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Action</DialogTitle>
            <DialogDescription>
              Apply action to {selectedItems.length} selected ticket{selectedItems.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Action:</strong> {bulkAction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This will affect {selectedItems.length} ticket{selectedItems.length > 1 ? 's' : ''}
              </p>
            </div>

            {bulkAction === "assign" && (
              <div>
                <Label>Assign To</Label>
                <Select value={bulkActionValue} onValueChange={setBulkActionValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member..." />
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
            )}

            {bulkAction === "change_priority" && (
              <div>
                <Label>New Priority</Label>
                <Select value={bulkActionValue} onValueChange={setBulkActionValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Urgent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {bulkAction === "change_status" && (
              <div>
                <Label>New Status</Label>
                <Select value={bulkActionValue} onValueChange={setBulkActionValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        Open
                      </div>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="resolved">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Resolved
                      </div>
                    </SelectItem>
                    <SelectItem value="closed">
                      <div className="flex items-center gap-2">
                        <Archive className="w-4 h-4 text-gray-500" />
                        Closed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {bulkAction === "close" && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-900 font-medium">
                      Are you sure you want to close these tickets?
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This action will mark all selected tickets as closed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsBulkActionDialogOpen(false);
                  setBulkActionValue("");
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBulkAction}
                disabled={!bulkActionValue && bulkAction !== "close"}
              >
                Apply to {selectedItems.length} Ticket{selectedItems.length > 1 ? 's' : ''}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}