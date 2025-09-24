import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MoreHorizontal, Star, MessageCircle, Reply, Trash2, Clock, AlertCircle, CheckCircle } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const tickets = [
  {
    id: 1,
    title: "Video quality issue in React lesson 3",
    student: "Emma Davis",
    course: "Introduction to React",
    priority: "high",
    status: "open",
    category: "technical",
    created: "2024-01-15",
    lastUpdate: "2024-01-15",
    description: "The video quality in lesson 3 is quite poor and hard to follow. Could you please fix this?",
    responses: []
  },
  {
    id: 2,
    title: "Assignment submission not working",
    student: "Mike Johnson",
    course: "Advanced JavaScript",
    priority: "urgent",
    status: "in_progress",
    category: "technical",
    created: "2024-01-14",
    lastUpdate: "2024-01-14",
    description: "I can't submit my assignment. The submit button doesn't work.",
    responses: [
      {
        id: 1,
        author: "Support Team",
        message: "We're looking into this issue. Could you try clearing your browser cache?",
        timestamp: "2024-01-14 10:30"
      }
    ]
  },
  {
    id: 3,
    title: "Request for additional resources",
    student: "Sarah Wilson",
    course: "UI/UX Design",
    priority: "low",
    status: "resolved",
    category: "content",
    created: "2024-01-12",
    lastUpdate: "2024-01-13",
    description: "Could you add more examples of mobile app design patterns?",
    responses: [
      {
        id: 1,
        author: "Carol Davis",
        message: "I've added 5 new mobile design examples to the resources section.",
        timestamp: "2024-01-13 14:20"
      }
    ]
  }
];

const reviews = [
  {
    id: 1,
    student: "Sarah Wilson",
    course: "Introduction to React",
    rating: 5,
    comment: "Excellent course! The explanations are clear and the examples are very helpful.",
    date: "2024-01-15",
    status: "published",
    helpful: 12,
    type: "review"
  },
  {
    id: 2,
    student: "Mike Johnson",
    course: "Advanced JavaScript",
    rating: 4,
    comment: "Great content but could use more practical exercises. Overall very informative.",
    date: "2024-01-14",
    status: "published",
    helpful: 8,
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
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");

  const TicketDetails = ({ ticket }) => {
    const StatusIcon = getStatusIcon(ticket.status);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon className="w-5 h-5 text-muted-foreground" />
            <div>
              <h3 className="text-foreground">{ticket.title}</h3>
              <p className="text-muted-foreground text-sm">
                #{ticket.id} • Created {ticket.created}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <Label className="text-muted-foreground">Student</Label>
            <p className="text-foreground">{ticket.student}</p>
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
            <Label className="text-muted-foreground">Last Update</Label>
            <p className="text-foreground">{ticket.lastUpdate}</p>
          </div>
        </div>

        <div>
          <Label className="text-muted-foreground">Description</Label>
          <p className="text-foreground mt-1">{ticket.description}</p>
        </div>

        {ticket.responses.length > 0 && (
          <div>
            <Label className="text-muted-foreground">Responses</Label>
            <div className="space-y-3 mt-2">
              {ticket.responses.map((response) => (
                <div key={response.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground">{response.author}</span>
                    <span className="text-muted-foreground text-xs">{response.timestamp}</span>
                  </div>
                  <p className="text-muted-foreground">{response.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={() => setIsResponseDialogOpen(true)}>
            <Reply className="w-4 h-4 mr-2" />
            Add Response
          </Button>
          <Select defaultValue={ticket.status}>
            <SelectTrigger className="w-[150px]">
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
          <CardTitle>Feedback & Support</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
              <TabsTrigger value="reviews">Course Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tickets" className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
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
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => {
                    const StatusIcon = getStatusIcon(ticket.status);
                    return (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <StatusIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-foreground">{ticket.title}</p>
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
                        <TableCell className="text-muted-foreground">
                          {ticket.course}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedTicket(ticket)}>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Reply className="mr-2 h-4 w-4" />
                                Quick Response
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Close Ticket
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
            
            <TabsContent value="reviews" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Helpful</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {review.student.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-foreground">{review.student}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {review.course}
                      </TableCell>
                      <TableCell>
                        {renderStars(review.rating)}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate text-muted-foreground" title={review.comment}>
                          {review.comment}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {review.date}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{review.helpful}</span>
                        </div>
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
                              <Reply className="mr-2 h-4 w-4" />
                              Respond
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Feature Review
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hide Review
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Response</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="response">Response Message</Label>
              <Textarea
                id="response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Enter your response..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                console.log("Sending response:", responseText);
                setResponseText("");
                setIsResponseDialogOpen(false);
              }}>
                Send Response
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}