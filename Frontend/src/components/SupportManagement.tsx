import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { MessageCircle, RefreshCw, Users, FileText, Clock, CheckCircle, XCircle, AlertTriangle, Search } from "lucide-react";

const mockSupportTickets = [
  {
    id: "TKT-001",
    userId: "user123",
    userName: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    subject: "Unable to access JEE Physics videos",
    category: "technical",
    priority: "high",
    status: "open",
    examType: "JEE",
    createdAt: "2024-08-19T10:30:00Z",
    updatedAt: "2024-08-19T11:45:00Z",
    description: "I'm facing issues accessing the JEE Physics video lectures. The videos are not loading properly and I'm getting error messages.",
    responses: [
      {
        id: "resp1",
        author: "Support Team",
        message: "Hi Rahul, we're looking into this issue. Can you please clear your browser cache and try again?",
        timestamp: "2024-08-19T11:45:00Z",
        isInternal: false
      }
    ]
  },
  {
    id: "TKT-002",
    userId: "user456",
    userName: "Priya Patel",
    email: "priya.patel@email.com",
    subject: "Refund request for NEET subscription",
    category: "refund",
    priority: "medium",
    status: "in_progress",
    examType: "NEET",
    createdAt: "2024-08-18T14:20:00Z",
    updatedAt: "2024-08-19T09:15:00Z",
    description: "I want to request a refund for my NEET subscription as I've decided to pursue a different career path.",
    refundAmount: 4999,
    refundReason: "Change in career plans"
  },
  {
    id: "TKT-003",
    userId: "user789",
    userName: "Amit Kumar",
    email: "amit.kumar@email.com",
    subject: "Account deletion request",
    category: "account",
    priority: "medium",
    status: "pending",
    examType: "UPSC",
    createdAt: "2024-08-17T16:45:00Z",
    updatedAt: "2024-08-17T16:45:00Z",
    description: "I would like to permanently delete my account and all associated data as per GDPR compliance."
  }
];

const mockRefundRequests = [
  {
    id: "REF-001",
    ticketId: "TKT-002",
    userId: "user456",
    userName: "Priya Patel",
    subscriptionId: "sub_neet_456",
    planName: "NEET Premium Annual",
    amount: 4999,
    requestDate: "2024-08-18T14:20:00Z",
    reason: "Change in career plans",
    status: "pending_review",
    eligibleAmount: 4999,
    processingFee: 0,
    netRefund: 4999,
    approvedBy: null,
    processedDate: null
  },
  {
    id: "REF-002",
    ticketId: "TKT-004",
    userId: "user321",
    userName: "Sneha Gupta",
    subscriptionId: "sub_jee_321",
    planName: "JEE Main + Advanced",
    amount: 7999,
    requestDate: "2024-08-16T11:30:00Z",
    reason: "Technical issues not resolved",
    status: "approved",
    eligibleAmount: 6000,
    processingFee: 199,
    netRefund: 5801,
    approvedBy: "admin_001",
    processedDate: "2024-08-17T10:00:00Z"
  }
];

export function SupportManagement() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketFilter, setTicketFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [responseText, setResponseText] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Open</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      case "pending":
        return <Badge className="bg-orange-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge className="bg-orange-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getRefundStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge className="bg-orange-500">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "processed":
        return <Badge className="bg-blue-500">Processed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTickets = mockSupportTickets.filter(ticket => {
    const matchesFilter = ticketFilter === "all" || ticket.status === ticketFilter;
    const matchesSearch = searchQuery === "" || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Open Tickets</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">15</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">8</div>
            <p className="text-xs text-muted-foreground">₹45,234 total value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Account Deletions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">3</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">2.4h</div>
            <p className="text-xs text-green-600">-0.3h from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="refunds">Refund Management</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        {/* Support Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>Manage and respond to user support requests</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={ticketFilter} onValueChange={setTicketFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tickets</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{ticket.userName}</div>
                          <div className="text-xs text-muted-foreground">{ticket.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{ticket.subject}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {ticket.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ticket.examType}</Badge>
                      </TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Ticket Details - {selectedTicket?.id}</DialogTitle>
                              <DialogDescription>
                                Manage and respond to user support request
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTicket && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm">User:</label>
                                    <p>{selectedTicket.userName} ({selectedTicket.email})</p>
                                  </div>
                                  <div>
                                    <label className="text-sm">Exam Type:</label>
                                    <p>{selectedTicket.examType}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm">Priority:</label>
                                    <p>{getPriorityBadge(selectedTicket.priority)}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm">Status:</label>
                                    <p>{getStatusBadge(selectedTicket.status)}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-sm">Subject:</label>
                                  <p>{selectedTicket.subject}</p>
                                </div>
                                
                                <div>
                                  <label className="text-sm">Description:</label>
                                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                                    {selectedTicket.description}
                                  </p>
                                </div>

                                {selectedTicket.category === "refund" && (
                                  <div className="bg-orange-50 p-3 rounded">
                                    <label className="text-sm">Refund Details:</label>
                                    <p>Amount: ₹{selectedTicket.refundAmount}</p>
                                    <p>Reason: {selectedTicket.refundReason}</p>
                                  </div>
                                )}

                                {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                                  <div>
                                    <label className="text-sm">Previous Responses:</label>
                                    <div className="space-y-2 mt-2">
                                      {selectedTicket.responses.map((response) => (
                                        <div key={response.id} className="bg-blue-50 p-3 rounded">
                                          <div className="flex justify-between items-start">
                                            <div>{response.author}</div>
                                            <div className="text-xs text-muted-foreground">
                                              {new Date(response.timestamp).toLocaleString()}
                                            </div>
                                          </div>
                                          <p className="text-sm mt-1">{response.message}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <label className="text-sm">Add Response:</label>
                                  <Textarea
                                    placeholder="Type your response here..."
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    className="mt-1"
                                    rows={3}
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Select defaultValue={selectedTicket.status}>
                                    <SelectTrigger className="w-40">
                                      <SelectValue placeholder="Update status" />
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
                            )}
                            <DialogFooter>
                              <Button variant="outline">Save as Draft</Button>
                              <Button>Send Response</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refund Management Tab */}
        <TabsContent value="refunds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>Review and process refund requests from users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Original Amount</TableHead>
                    <TableHead>Eligible Refund</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRefundRequests.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell>{refund.id}</TableCell>
                      <TableCell>{refund.userName}</TableCell>
                      <TableCell>{refund.planName}</TableCell>
                      <TableCell>₹{refund.amount}</TableCell>
                      <TableCell>₹{refund.netRefund}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{refund.reason}</div>
                      </TableCell>
                      <TableCell>{getRefundStatusBadge(refund.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {refund.status === "pending_review" && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Approve Refund Request</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to approve this refund request for ₹{refund.netRefund}?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Approve Refund</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600">
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Reject Refund Request</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject this refund request? 
                                      Please provide a reason for rejection.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-red-600">Reject Request</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues</CardTitle>
                <CardDescription>Frequently reported problems and solutions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4>Video Loading Issues</h4>
                  <p className="text-sm text-muted-foreground">
                    Clear browser cache, check internet connection, try different browser
                  </p>
                </div>
                <div className="space-y-2">
                  <h4>Payment Failures</h4>
                  <p className="text-sm text-muted-foreground">
                    Verify card details, check bank limits, contact payment provider
                  </p>
                </div>
                <div className="space-y-2">
                  <h4>Account Access Problems</h4>
                  <p className="text-sm text-muted-foreground">
                    Password reset, verify email, check spam folder
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used support actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Canned Response
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Bulk Update Tickets
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Escalate to Manager
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}