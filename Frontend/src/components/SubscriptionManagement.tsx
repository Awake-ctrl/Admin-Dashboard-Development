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
import { Checkbox } from "./ui/checkbox";
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
  Download,
  BookOpen,
  Tag,
  Zap,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { subscriptionService, SubscriptionPlan, Transaction, RefundRequest, SubscriptionStats, Course } from "./api/subscripttionService";
import { toast } from "sonner";

// Feature options for plans
const featureOptions = [
  "Unlimited Text Queries",
  "Unlimited Image Queries", 
  "Unlimited Audio Queries",
  "Priority Support",
  "Download Content",
  "Certificate of Completion",
  "Live Doubt Sessions",
  "Personalized Study Plan",
  "Advanced Analytics",
  "Mobile App Access",
  "Early Access to New Features",
  "Dedicated Account Manager"
];

export function SubscriptionManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [activeTab, setActiveTab] = useState("plans");
  
  // State for data from backend
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter states
  const [transactionStatusFilter, setTransactionStatusFilter] = useState("all");
  const [refundStatusFilter, setRefundStatusFilter] = useState("all");

  // Form state - Updated structure
  const [formData, setFormData] = useState({
    name: "",
    slogan: "",
    original_price: 0,
    offer_price: 0,
    courses: [] as number[],
    type: "single" as "single" | "bundle",
    duration_months: 1,
    features: [] as string[],
    is_popular: false,
    is_active: true
    // subscribers: 0,
    // revenue: 0
  });

  // Dropdown states
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

  // Load data based on active tab
  useEffect(() => {
    loadData();
  }, [activeTab, transactionStatusFilter, refundStatusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Always load courses and stats
      const [coursesData, statsData] = await Promise.all([
        subscriptionService.getCourses(),
        subscriptionService.getSubscriptionStats()
      ]);
      setCourses(coursesData);
      setStats(statsData);

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
      slogan: plan.slogan || "",
      original_price: plan.original_price,
      offer_price: plan.offer_price,
      courses: plan.courses || [],
      type: plan.type || "single",
      duration_months: plan.duration_months || 1,
      features: plan.features || [],
      is_popular: plan.is_popular || false,
      is_active: plan.is_active
      // subscribers: plan.subscribers,
      // revenue: plan.revenue
    });
    setIsDialogOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setFormData({
      name: "",
      slogan: "",
      original_price: 0,
      offer_price: 0,
      courses: [],
      type: "single",
      duration_months: 1,
      features: [],
      is_popular: false,
      is_active: true,
      // subscribers: 0,
      // revenue: 0
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

  const handleCourseToggle = (courseId: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter(id => id !== courseId)
        : [...prev.courses, courseId]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSelectAllCourses = () => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.length === courses.length ? [] : courses.map(course => course.id)
    }));
  };

  const handleSelectAllFeatures = () => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.length === featureOptions.length ? [] : [...featureOptions]
    }));
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
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

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

  const calculateDiscountPercentage = (original: number, offer: number) => {
    if (original <= 0 || offer >= original) return 0;
    return Math.round(((original - offer) / original) * 100);
  };

  const getCourseTitles = (courseIds: number[]) => {
    return courseIds.map(id => courses.find(course => course.id === id)?.title).filter(Boolean);
  };

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
              <p className="text-muted-foreground">Manage your course subscription plans and pricing</p>
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
          ) : subscriptionPlans.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No subscription plans yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first subscription plan to start offering courses to students
                </p>
                <Button onClick={handleCreatePlan}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => {
                const discountPercentage = calculateDiscountPercentage(plan.original_price, plan.offer_price);
                const includedCourses = getCourseTitles(plan.courses || []);
                
                return (
                  <Card key={plan.id} className={`relative ${plan.is_popular ? 'border-primary border-2' : ''}`}>
                    {plan.is_popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground px-3 py-1">
                          <Zap className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="capitalize flex items-center justify-center gap-2">
                        {plan.name}
                        {plan.type === "bundle" && (
                          <Badge variant="outline" className="bg-blue-50">
                            Bundle
                          </Badge>
                        )}
                      </CardTitle>
                      {plan.slogan && (
                        <CardDescription className="text-sm italic">
                          "{plan.slogan}"
                        </CardDescription>
                      )}
                      
                      <div className="flex items-center justify-center gap-3 mt-2">
                        {plan.original_price > plan.offer_price && (
                          <div className="flex flex-col items-center">
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(plan.original_price)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {discountPercentage}% OFF
                            </Badge>
                          </div>
                        )}
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(plan.offer_price)}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {plan.duration_months === 1 ? 'Per month' : `For ${plan.duration_months} months`}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Included Courses */}
                      {includedCourses.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Included Courses</span>
                          </div>
                          <div className="space-y-1">
                            {includedCourses.slice(0, 3).map((course, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <Check className="w-3 h-3 text-green-500" />
                                <span className="truncate">{course}</span>
                              </div>
                            ))}
                            {includedCourses.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{includedCourses.length - 3} more courses
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      {plan.features && plan.features.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Features</span>
                          </div>
                          <div className="space-y-1">
                            {plan.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <Check className="w-3 h-3 text-green-500" />
                                <span className="truncate">{feature}</span>
                              </div>
                            ))}
                            {plan.features.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{plan.features.length - 3} more features
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
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

                      {/* Actions */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditPlan(plan)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        {plan.name !== "free" && (
                          <Button
                            variant="destructive"
                            size="sm"
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
                    </CardContent>
                  </Card>
                );
              })}
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
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground text-center">
                    Transactions will appear here when users purchase subscription plans
                  </p>
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
              ) : refundRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No refund requests</h3>
                  <p className="text-muted-foreground text-center">
                    Refund requests from users will appear here
                  </p>
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

      {/* Plan Dialog - Updated with dynamic courses */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
            <DialogDescription>
              {selectedPlan ? "Modify the subscription plan details" : "Create a new course subscription plan"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name *</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., JEE Pro, All Courses Bundle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Plan Type</Label>
                  <Select value={formData.type} onValueChange={(value: "single" | "bundle") => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Course</SelectItem>
                      <SelectItem value="bundle">Course Bundle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slogan">Slogan / Tagline</Label>
                <Input 
                  id="slogan" 
                  value={formData.slogan}
                  onChange={(e) => setFormData({...formData, slogan: e.target.value})}
                  placeholder="e.g., Ace your JEE exam with expert guidance"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Pricing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (₹) *</Label>
                  <Input 
                    id="original_price" 
                    type="number" 
                    value={formData.original_price}
                    onChange={(e) => setFormData({...formData, original_price: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offer_price">Offer Price (₹) *</Label>
                  <Input 
                    id="offer_price" 
                    type="number" 
                    value={formData.offer_price}
                    onChange={(e) => setFormData({...formData, offer_price: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              {formData.original_price > 0 && formData.offer_price > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm line-through text-muted-foreground">
                      {formatCurrency(formData.original_price)}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(formData.offer_price)}
                    </span>
                    <Badge variant="secondary">
                      {calculateDiscountPercentage(formData.original_price, formData.offer_price)}% OFF
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration_months">Duration (Months) *</Label>
              <Select value={formData.duration_months.toString()} onValueChange={(value) => setFormData({...formData, duration_months: parseInt(value)})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Course Selection - Dropdown Style */}
            <div className="space-y-2">
              <Label>Select Courses *</Label>
              <div className="border rounded-lg">
                <button
                  type="button"
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                >
                  <span className="text-sm">
                    {formData.courses.length === 0 
                      ? "Select courses..." 
                      : `${formData.courses.length} course(s) selected`}
                  </span>
                  {coursesDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {coursesDropdownOpen && (
                  <div className="border-t p-3 max-h-48 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Available Courses</span>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleSelectAllCourses}
                      >
                        {formData.courses.length === courses.length ? "Deselect All" : "Select All"}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {courses.map((course) => (
                        <div key={course.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`course-${course.id}`}
                            checked={formData.courses.includes(course.id)}
                            onCheckedChange={() => handleCourseToggle(course.id)}
                          />
                          <Label htmlFor={`course-${course.id}`} className="text-sm font-normal cursor-pointer flex-1">
                            {course.title} 
                            <Badge variant="outline" className="ml-2 text-xs">{course.exam_type}</Badge>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features - Dropdown Style */}
            <div className="space-y-2">
              <Label>Plan Features</Label>
              <div className="border rounded-lg">
                <button
                  type="button"
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
                >
                  <span className="text-sm">
                    {formData.features.length === 0 
                      ? "Select features..." 
                      : `${formData.features.length} feature(s) selected`}
                  </span>
                  {featuresDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {featuresDropdownOpen && (
                  <div className="border-t p-3 max-h-48 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Available Features</span>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleSelectAllFeatures}
                      >
                        {formData.features.length === featureOptions.length ? "Deselect All" : "Select All"}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {featureOptions.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={`feature-${feature}`}
                            checked={formData.features.includes(feature)}
                            onCheckedChange={() => handleFeatureToggle(feature)}
                          />
                          <Label htmlFor={`feature-${feature}`} className="text-sm font-normal cursor-pointer flex-1">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_popular"
                    checked={formData.is_popular}
                    onCheckedChange={(checked) => setFormData({...formData, is_popular: checked as boolean})}
                  />
                  <Label htmlFor="is_popular" className="text-sm font-normal cursor-pointer">
                    Mark as Popular
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked as boolean})}
                  />
                  <Label htmlFor="is_active" className="text-sm font-normal cursor-pointer">
                    Active Plan
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSavePlan}
              disabled={actionLoading === "save-plan" || !formData.name || !formData.courses.length}
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