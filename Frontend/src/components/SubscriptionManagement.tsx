import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Plus, 
  Edit, 
  AlertTriangle, 
  Loader2, 
  Check, 
  X, 
  RotateCcw, 
  Download
} from "lucide-react";
import { subscriptionService, SubscriptionPlan, Transaction, RefundRequest, SubscriptionStats } from "./api/subscripttionService";
import { toast } from "sonner";

export function SubscriptionManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [activeTab, setActiveTab] = useState("plans");
  
  // State for data from backend
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter states
  const [transactionStatusFilter, setTransactionStatusFilter] = useState("all");
  const [refundStatusFilter, setRefundStatusFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    max_text: 0,
    max_image: 0,
    max_audio: 0,
    max_expand: 0,
    max_with_history: 0,
    price: 0,
    timedelta: 2592000,
    subscribers: 0,
    revenue: 0,
    is_active: true
  });

  // Load data based on active tab
  useEffect(() => {
    loadData();
  }, [activeTab, transactionStatusFilter, refundStatusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "plans":
          const plansData = await subscriptionService.getSubscriptionPlans();
          setSubscriptionPlans(plansData);
          break;
        case "transactions":
          const transactionsData = await subscriptionService.getTransactions(
            transactionStatusFilter !== "all" ? transactionStatusFilter : undefined
          );
          setTransactions(transactionsData);
          break;
        case "refunds":
          const refundsData = await subscriptionService.getRefundRequests(
            refundStatusFilter !== "all" ? refundStatusFilter : undefined
          );
          setRefundRequests(refundsData);
          break;
      }

      // Always load stats - they update based on transactions
      const statsData = await subscriptionService.getSubscriptionStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      max_text: plan.max_text,
      max_image: plan.max_image,
      max_audio: plan.max_audio,
      max_expand: plan.max_expand,
      max_with_history: plan.max_with_history,
      price: plan.price,
      timedelta: plan.timedelta,
      subscribers: plan.subscribers,
      revenue: plan.revenue,
      is_active: plan.is_active
    });
    setIsDialogOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setFormData({
      name: "",
      max_text: 0,
      max_image: 0,
      max_audio: 0,
      max_expand: 0,
      max_with_history: 0,
      price: 0,
      timedelta: 2592000,
      subscribers: 0,
      revenue: 0,
      is_active: true
    });
    setIsDialogOpen(true);
  };

  const handleSavePlan = async () => {
    setActionLoading("save-plan");
    try {
      if (selectedPlan) {
        await subscriptionService.updateSubscriptionPlan(selectedPlan.id, formData);
        toast.success("Plan updated successfully");
      } else {
        await subscriptionService.createSubscriptionPlan(formData);
        toast.success("Plan created successfully");
      }
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save plan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    setActionLoading(`delete-${planId}`);
    try {
      await subscriptionService.deleteSubscriptionPlan(planId);
      toast.success("Plan deleted successfully");
      loadData();
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetryFailedTransaction = async (transactionId: number) => {
    setActionLoading(`retry-${transactionId}`);
    try {
      await subscriptionService.updateTransaction(transactionId, {
        status: "captured"
      });
      toast.success("Transaction status updated to captured");
      loadData();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkTransactionFailed = async (transactionId: number) => {
    setActionLoading(`fail-${transactionId}`);
    try {
      await subscriptionService.updateTransaction(transactionId, {
        status: "failed"
      });
      toast.success("Transaction marked as failed");
      loadData();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefundTransaction = async (transactionId: number) => {
    setActionLoading(`refund-${transactionId}`);
    try {
      await subscriptionService.updateTransaction(transactionId, {
        status: "refunded"
      });
      toast.success("Transaction refunded successfully");
      loadData();
    } catch (error) {
      console.error("Error refunding transaction:", error);
      toast.error("Failed to refund transaction");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveRefund = async (requestId: number) => {
    setActionLoading(`approve-${requestId}`);
    try {
      await subscriptionService.updateRefundRequest(requestId, {
        status: "processed",
        processed_by: "admin"
      });
      toast.success("Refund approved and processed");
      loadData();
    } catch (error) {
      console.error("Error approving refund:", error);
      toast.error("Failed to approve refund");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRefund = async (requestId: number) => {
    setActionLoading(`reject-${requestId}`);
    try {
      await subscriptionService.updateRefundRequest(requestId, {
        status: "rejected",
        processed_by: "admin"
      });
      toast.success("Refund request rejected");
      loadData();
    } catch (error) {
      console.error("Error rejecting refund:", error);
      toast.error("Failed to reject refund");
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportTransactions = () => {
    const dataToExport = transactions.map(transaction => ({
      ID: transaction.id,
      User: transaction.user_name,
      Plan: transaction.plan_name,
      "Payment Method": transaction.type,
      Amount: `₹${transaction.amount}`,
      Status: transaction.status,
      Date: new Date(transaction.date).toLocaleDateString(),
      "Order ID": transaction.order_id
    }));

    const csvContent = [
      Object.keys(dataToExport[0]),
      ...dataToExport.map(row => Object.values(row))
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${transactions.length} transactions`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "captured":
        return <Badge className="bg-green-500">Captured</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "refunded":
        return <Badge className="bg-orange-500">Refunded</Badge>;
      case "processed":
        return <Badge className="bg-blue-500">Processed</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards - These update based on transaction status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(stats?.total_revenue || 0)}</div>
            <p className="text-xs text-green-600">
              +{stats?.monthly_revenue_growth || 12}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats?.total_subscribers?.toLocaleString() || 0}</div>
            <p className="text-xs text-green-600">
              +{stats?.monthly_subscriber_growth || 8}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats?.conversion_rate || 0}%</div>
            <p className="text-xs text-green-600">
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
            <div className="text-2xl">{stats?.churn_rate || 0}%</div>
            <p className="text-xs text-green-600">
              -0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Subscription Plans</h3>
              <p className="text-muted-foreground">Manage your subscription plans and pricing</p>
            </div>
            <Button onClick={handleCreatePlan}>
              <Plus className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading plans...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={plan.name === "premium" ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="capitalize">{plan.name}</CardTitle>
                        <CardDescription>
                          {plan.price === 0 ? "Free" : `${formatCurrency(plan.price)}/month`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPlan(plan)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {plan.name !== "free" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleDeletePlan(plan.id)}
                            disabled={actionLoading === `delete-${plan.id}`}
                          >
                            {actionLoading === `delete-${plan.id}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Delete"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Text Queries:</span>
                        <span>{plan.max_text}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Image Queries:</span>
                        <span>{plan.max_image}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Audio Queries:</span>
                        <span>{plan.max_audio}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Expand Queries:</span>
                        <span>{plan.max_expand}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>With History:</span>
                        <span>{plan.max_with_history}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subscribers:</span>
                        <span className="font-semibold">{plan.subscribers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Revenue:</span>
                        <span className="font-semibold">{formatCurrency(plan.revenue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <Badge variant={plan.is_active ? "default" : "secondary"}>
                          {plan.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest payment transactions across all plans</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={transactionStatusFilter} onValueChange={setTransactionStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="captured">Captured</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleExportTransactions}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading transactions...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.user_name}</div>
                            <div className="text-xs text-muted-foreground">{transaction.user_id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{transaction.plan_name}</TableCell>
                        <TableCell className="capitalize">{transaction.type}</TableCell>
                        <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell className="font-mono text-xs">{transaction.order_id}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {transaction.status === "failed" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRetryFailedTransaction(transaction.id)}
                                disabled={actionLoading === `retry-${transaction.id}`}
                              >
                                {actionLoading === `retry-${transaction.id}` ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <RotateCcw className="w-3 h-3" />
                                )}
                              </Button>
                            )}
                            {transaction.status === "captured" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-orange-600"
                                  onClick={() => handleRefundTransaction(transaction.id)}
                                  disabled={actionLoading === `refund-${transaction.id}`}
                                >
                                  {actionLoading === `refund-${transaction.id}` ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    "Refund"
                                  )}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleMarkTransactionFailed(transaction.id)}
                                  disabled={actionLoading === `fail-${transaction.id}`}
                                >
                                  {actionLoading === `fail-${transaction.id}` ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    "Fail"
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Refund Requests</CardTitle>
                  <CardDescription>Manage refund requests from users</CardDescription>
                </div>
                <Select value={refundStatusFilter} onValueChange={setRefundStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading refund requests...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Processed Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refundRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.user_name}</div>
                            <div className="text-xs text-muted-foreground">{request.user_id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{request.plan_name}</TableCell>
                        <TableCell>{formatCurrency(request.amount)}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={request.reason}>
                            {request.reason}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>{formatDate(request.request_date)}</TableCell>
                        <TableCell>
                          {request.processed_date ? formatDate(request.processed_date) : "N/A"}
                        </TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleApproveRefund(request.id)}
                                disabled={actionLoading === `approve-${request.id}`}
                              >
                                {actionLoading === `approve-${request.id}` ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4 mr-2" />
                                )}
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleRejectRefund(request.id)}
                                disabled={actionLoading === `reject-${request.id}`}
                              >
                                {actionLoading === `reject-${request.id}` ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4 mr-2" />
                                )}
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter plan name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input 
                id="price" 
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="text-limit">Text Queries</Label>
                <Input 
                  id="text-limit" 
                  type="number" 
                  value={formData.max_text}
                  onChange={(e) => setFormData({...formData, max_text: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-limit">Image Queries</Label>
                <Input 
                  id="image-limit" 
                  type="number" 
                  value={formData.max_image}
                  onChange={(e) => setFormData({...formData, max_image: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="audio-limit">Audio Queries</Label>
                <Input 
                  id="audio-limit" 
                  type="number" 
                  value={formData.max_audio}
                  onChange={(e) => setFormData({...formData, max_audio: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expand-limit">Expand Queries</Label>
                <Input 
                  id="expand-limit" 
                  type="number" 
                  value={formData.max_expand}
                  onChange={(e) => setFormData({...formData, max_expand: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="history-limit">With History Limit</Label>
              <Input 
                id="history-limit" 
                type="number" 
                value={formData.max_with_history}
                onChange={(e) => setFormData({...formData, max_with_history: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSavePlan}
              disabled={actionLoading === "save-plan" || !formData.name}
            >
              {actionLoading === "save-plan" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {selectedPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}