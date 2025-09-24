import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CreditCard, TrendingUp, Users, DollarSign, Plus, Edit, AlertTriangle } from "lucide-react";

// Mock data based on your models
const subscriptionPlans = [
  {
    name: "free",
    maxText: 10,
    maxImage: 2,
    maxAudio: 1,
    maxExpand: 5,
    maxWithHistory: 3,
    price: 0,
    timedelta: 2592000, // 30 days
    subscribers: 1250,
    revenue: 0
  },
  {
    name: "basic",
    maxText: 100,
    maxImage: 20,
    maxAudio: 10,
    maxExpand: 50,
    maxWithHistory: 30,
    price: 299,
    timedelta: 2592000,
    subscribers: 450,
    revenue: 134550
  },
  {
    name: "premium",
    maxText: 500,
    maxImage: 100,
    maxAudio: 50,
    maxExpand: 200,
    maxWithHistory: 150,
    price: 599,
    timedelta: 2592000,
    subscribers: 180,
    revenue: 107820
  }
];

const transactions = [
  {
    id: 1,
    userId: 1001,
    userName: "John Doe",
    planName: "premium",
    type: "razorpay",
    amount: 599,
    status: "captured",
    date: "2025-01-14T10:30:00Z",
    orderId: "order_12345"
  },
  {
    id: 2,
    userId: 1002,
    userName: "Jane Smith",
    planName: "basic",
    type: "google",
    amount: 299,
    status: "captured",
    date: "2025-01-14T09:15:00Z",
    orderId: "google_67890"
  },
  {
    id: 3,
    userId: 1003,
    userName: "Mike Johnson",
    planName: "premium",
    type: "razorpay",
    amount: 599,
    status: "failed",
    date: "2025-01-14T08:45:00Z",
    orderId: "order_54321"
  }
];

const refundRequests = [
  {
    id: 1,
    userId: 1004,
    userName: "Sarah Wilson",
    planName: "premium",
    amount: 599,
    reason: "Not satisfied with features",
    status: "pending",
    requestDate: "2025-01-13T14:20:00Z"
  },
  {
    id: 2,
    userId: 1005,
    userName: "David Brown",
    planName: "basic",
    amount: 299,
    reason: "Accidental purchase",
    status: "processed",
    requestDate: "2025-01-12T11:30:00Z"
  }
];

export function SubscriptionManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "captured":
        return <Badge variant="default">Captured</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processed":
        return <Badge variant="default">Processed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalRevenue = subscriptionPlans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = subscriptionPlans.reduce((sum, plan) => sum + plan.subscribers, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalSubscribers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">24.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Churn Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">3.2%</div>
            <p className="text-xs text-muted-foreground">
              -0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3>Subscription Plans</h3>
              <p className="text-muted-foreground">Manage your subscription plans and pricing</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedPlan(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{selectedPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
                  <DialogDescription>
                    {selectedPlan ? "Modify the subscription plan details" : "Create a new subscription plan"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Plan Name</Label>
                    <Input id="name" defaultValue={selectedPlan?.name || ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" type="number" defaultValue={selectedPlan?.price || ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="text-limit">Text Queries Limit</Label>
                    <Input id="text-limit" type="number" defaultValue={selectedPlan?.maxText || ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image-limit">Image Queries Limit</Label>
                    <Input id="image-limit" type="number" defaultValue={selectedPlan?.maxImage || ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="audio-limit">Audio Queries Limit</Label>
                    <Input id="audio-limit" type="number" defaultValue={selectedPlan?.maxAudio || ""} />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Save Plan</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.name} className={plan.name === "premium" ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="capitalize">{plan.name}</CardTitle>
                      <CardDescription>₹{plan.price}/month</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm" 
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Text Queries:</span>
                      <span>{plan.maxText}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Image Queries:</span>
                      <span>{plan.maxImage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Audio Queries:</span>
                      <span>{plan.maxAudio}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>With History:</span>
                      <span>{plan.maxWithHistory}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subscribers:</span>
                      <span>{plan.subscribers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Revenue:</span>
                      <span>₹{plan.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment transactions across all plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.userName}</TableCell>
                      <TableCell className="capitalize">{transaction.planName}</TableCell>
                      <TableCell className="capitalize">{transaction.type}</TableCell>
                      <TableCell>₹{transaction.amount}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>Manage refund requests from users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refundRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.userName}</TableCell>
                      <TableCell className="capitalize">{request.planName}</TableCell>
                      <TableCell>₹{request.amount}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Approve</Button>
                            <Button size="sm" variant="destructive">Reject</Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}