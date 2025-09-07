"use client"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  UserCheck,
  Zap,
  Star,
  Filter,
  Search,
  Plus,
  Edit,
  Ban,
  Check,
  X,
  RefreshCw,
} from "lucide-react"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalOperators: number
  activeOperators: number
  totalRevenue: number
  monthlyGrowth: number
  totalCustomers: number
  customerGrowth: number
  totalTechnicians: number
  totalStaff: number
  totalVendors: number
  totalComplaints: number
  systemUptime: number
}

interface RecentOperator {
  name: string
  companyName: string
  phone: string
  address: {
    state: string
    district: string
    area: string
  }
  planAssigned: string
  revenue: number
  customerCount: number
}

// Demo data fallback
const fallbackStats: DashboardStats = {
  totalOperators: 156,
  activeOperators: 142,
  totalRevenue: 2450000,
  monthlyGrowth: 12.5,
  totalCustomers: 45678,
  customerGrowth: 8.3,
  totalTechnicians: 89,
  totalStaff: 45,
  totalVendors: 23,
  totalComplaints: 12,
  systemUptime: 99.8,
}

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(fallbackStats)
  const [recentOperators, setRecentOperators] = useState<RecentOperator[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [vendorFilters, setVendorFilters] = useState({
    revenueRange: [0, 1000000],
    ratingRange: [0, 5],
    commissionRange: [5, 30],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const { toast } = useToast()

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log("Fetching dashboard data from API...")

      const [operators, technicians, staff, vendors, customers, complaints] = await Promise.allSettled([
        apiClient.getAllOperators(),
        apiClient.getAllTechnicians(),
        apiClient.getAllStaff(),
        apiClient.getAllVendors(),
        apiClient.getAllCustomers(),
        apiClient.getAllComplaints(),
      ])

      console.log("API data fetched successfully")

      const operatorsData = operators.status === "fulfilled" ? operators.value : []
      const techniciansData = technicians.status === "fulfilled" ? technicians.value : []
      const staffData = staff.status === "fulfilled" ? staff.value : []
      const vendorsData = vendors.status === "fulfilled" ? vendors.value : []
      const customersData = customers.status === "fulfilled" ? customers.value : []
      const complaintsData = complaints.status === "fulfilled" ? complaints.value : []

      // Calculate statistics from real data
      const totalOperators = operatorsData.length
      const activeOperators = operatorsData.filter(
        (op) => op.Permissions?.status === "active" || op.role === "operator",
      ).length
      const totalRevenue = operatorsData.reduce((sum, op) => sum + (op.profileDetail?.revenue || 0), 0)
      const totalCustomers = customersData.length
      const totalTechnicians = techniciansData.length
      const totalStaff = staffData.length
      const totalVendors = vendorsData.length
      const totalComplaints = complaintsData.length

      const stats: DashboardStats = {
        totalOperators,
        activeOperators,
        totalRevenue,
        monthlyGrowth: 12.5, // This would need historical data to calculate
        totalCustomers,
        customerGrowth: 8.3, // This would need historical data to calculate
        totalTechnicians,
        totalStaff,
        totalVendors,
        totalComplaints,
        systemUptime: 99.8,
      }

      setDashboardStats(stats)

      const sortedOperators = operatorsData
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(
          (op): RecentOperator => ({
            name: op.profileDetail?.name || "Unknown",
            companyName: op.profileDetail?.companyName || op.profileDetail?.name || "Unknown Company",
            phone: op.profileDetail?.phone || "N/A",
            address: op.profileDetail?.address || {
              state: "N/A",
              district: "N/A",
              area: "N/A",
            },
            planAssigned: op.profileDetail?.planAssigned || "Basic",
            revenue: op.profileDetail?.revenue || 0,
            customerCount: op.profileDetail?.customerCount || 0,
          }),
        )

      setRecentOperators(sortedOperators)

      setVendors(
        vendorsData.map((vendor) => ({
          id: vendor.user_id,
          name: vendor.profileDetail?.companyName || vendor.profileDetail?.name || "Unknown Vendor",
          email: vendor.email,
          phone: vendor.profileDetail?.phone || "N/A",
          category: vendor.profileDetail?.category || "General",
          revenue: vendor.profileDetail?.revenue || 0,
          rating: vendor.profileDetail?.rating || 4.0,
          commission: vendor.profileDetail?.commission || 15,
          status: vendor.Permissions?.status || "active",
          joinDate: vendor.createdAt,
          products: vendor.profileDetail?.products || 0,
          orders: vendor.profileDetail?.orders || 0,
        })),
      )

      setRecentOrders([
        {
          id: `ORD${Math.random().toString(36).substr(2, 9)}`,
          operator: "Demo Operator",
          items: "Various networking items",
          amount: 15000,
          status: "pending",
          date: new Date().toISOString(),
        },
      ])

      console.log("Dashboard data updated with real API data")
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error Loading Dashboard",
        description: "Using demo data. Please check your connection.",
        variant: "destructive",
      })
      // Keep fallback data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleVendorApproval = async (vendorId: string, approved: boolean) => {
    try {
      await apiClient.updateVendor(vendorId, {
        Permissions: { status: approved ? "active" : "rejected" },
      })

      toast({
        title: approved ? "Vendor Approved" : "Vendor Rejected",
        description: `Vendor has been ${approved ? "approved" : "rejected"} successfully.`,
      })

      // Refresh vendor data
      fetchDashboardData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vendor status.",
        variant: "destructive",
      })
    }
  }

  const handleVendorSuspension = async (vendorId: string) => {
    try {
      await apiClient.updateVendor(vendorId, {
        Permissions: { status: "suspended" },
      })

      toast({
        title: "Vendor Suspended",
        description: "Vendor account has been suspended.",
        variant: "destructive",
      })

      // Refresh vendor data
      fetchDashboardData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suspend vendor.",
        variant: "destructive",
      })
    }
  }

  const handleAddOperator = () => {
    // Navigate to add operator page or open modal
    window.location.href = "/admin/operators"
  }

  const handleAddVendor = () => {
    // Navigate to add vendor page or open modal
    window.location.href = "/admin/vendors"
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "success":
        return "bg-green-50 border-green-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const topPerformingOperators = recentOperators.slice(0, 5).map((op, index) => ({
    name: op.companyName || op.name,
    revenue: op.revenue || 0,
    growth: Math.random() * 20 - 5, // Random growth for demo
    customers: op.customerCount || 0,
  }))

  return (
    <DashboardLayout title="Admin Dashboard" description="Overview of your network solutions platform">
      <div className="space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading dashboard data...</span>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Operators</CardTitle>
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{dashboardStats.totalOperators}</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{dashboardStats.activeOperators} active</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
                  <div className="p-2 bg-green-500 rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardStats.totalRevenue)}</div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{dashboardStats.monthlyGrowth}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Customers</CardTitle>
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {dashboardStats.totalCustomers.toLocaleString()}
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{dashboardStats.customerGrowth}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Staff</CardTitle>
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {dashboardStats.totalTechnicians + dashboardStats.totalStaff}
                  </div>
                  <div className="flex items-center mt-2">
                    <UserCheck className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-600 font-medium">
                      {dashboardStats.totalTechnicians} technicians
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Vendors</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalVendors}</div>
                  <p className="text-xs text-gray-500 mt-1">Active vendors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Staff Members</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalStaff}</div>
                  <p className="text-xs text-gray-500 mt-1">Active staff</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Open Complaints</CardTitle>
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalComplaints}</div>
                  <p className="text-xs text-gray-500 mt-1">Pending resolution</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">System Uptime</CardTitle>
                  <Zap className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{dashboardStats.systemUptime}%</div>
                  <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <Button
                    className="h-20 flex-col space-y-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    onClick={handleAddOperator}
                  >
                    <Plus className="h-6 w-6" />
                    <span className="text-xs">Add Operator</span>
                  </Button>
                  <Button
                    className="h-20 flex-col space-y-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    onClick={handleAddVendor}
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <span className="text-xs">Add Vendor</span>
                  </Button>
                  <Button
                    className="h-20 flex-col space-y-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    onClick={() => (window.location.href = "/admin/inventory")}
                  >
                    <Package className="h-6 w-6" />
                    <span className="text-xs">Manage Inventory</span>
                  </Button>
                  <Button
                    className="h-20 flex-col space-y-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    onClick={() => (window.location.href = "/admin/complaints")}
                  >
                    <AlertTriangle className="h-6 w-6" />
                    <span className="text-xs">View Complaints</span>
                  </Button>
                  <Button
                    className="h-20 flex-col space-y-2 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                    onClick={() => (window.location.href = "/admin/technicians")}
                  >
                    <UserCheck className="h-6 w-6" />
                    <span className="text-xs">Manage Staff</span>
                  </Button>
                  <Button
                    className="h-20 flex-col space-y-2 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                    onClick={fetchDashboardData}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-6 w-6 ${loading ? "animate-spin" : ""}`} />
                    <span className="text-xs">Refresh Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Operators */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Operators</CardTitle>
                      <CardDescription>Latest operator registrations</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => (window.location.href = "/admin/operators")}>
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Operator</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOperators.map((operator, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{operator.companyName || operator.name}</div>
                              <div className="text-sm text-gray-500">{operator.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {operator.address ? `${operator.address.area}, ${operator.address.district}` : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{operator.planAssigned || "Basic"}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(operator.revenue || 0)}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {recentOperators.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                            No operators found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* System Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>Recent system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        type: "warning",
                        title: "Low Stock Alert",
                        message: "23 items are running low on stock",
                        time: "2 hours ago",
                      },
                      {
                        id: 2,
                        type: "info",
                        title: "New Operator Registration",
                        message: "Digital Connect has registered as a new operator",
                        time: "4 hours ago",
                      },
                      {
                        id: 3,
                        type: "success",
                        title: "Payment Received",
                        message: "₹85,000 payment received from City Networks",
                        time: "6 hours ago",
                      },
                      {
                        id: 4,
                        type: "error",
                        title: "System Maintenance",
                        message: "Scheduled maintenance completed successfully",
                        time: "1 day ago",
                      },
                    ].map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${getAlertBgColor(alert.type)}`}>
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Latest marketplace orders</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => (window.location.href = "/admin/orders")}>
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900">Order #{order.id}</p>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{order.operator}</p>
                          <p className="text-xs text-gray-500 mt-1">{order.items}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-medium text-gray-900">{formatCurrency(order.amount)}</span>
                            <span className="text-xs text-gray-500">{formatDate(order.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentOrders.length === 0 && (
                      <div className="text-center text-gray-500 py-4">No recent orders found</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Operators */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Operators</CardTitle>
                  <CardDescription>Operators by revenue performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformingOperators.map((operator, index) => (
                      <div key={operator.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{operator.name}</p>
                            <p className="text-sm text-gray-500">{operator.customers} customers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(operator.revenue)}</p>
                          <div className="flex items-center">
                            {operator.growth > 0 ? (
                              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                            )}
                            <span
                              className={`text-xs font-medium ${operator.growth > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {operator.growth > 0 ? "+" : ""}
                              {operator.growth.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-6">
            {/* Vendor Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Filters</CardTitle>
                <CardDescription>Filter vendors by revenue, rating, and commission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>
                      Revenue Range: ₹{vendorFilters.revenueRange[0].toLocaleString()} - ₹
                      {vendorFilters.revenueRange[1].toLocaleString()}
                    </Label>
                    <Slider
                      value={vendorFilters.revenueRange}
                      onValueChange={(value) => setVendorFilters((prev) => ({ ...prev, revenueRange: value }))}
                      max={1000000}
                      step={10000}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Rating Range: {vendorFilters.ratingRange[0]} - {vendorFilters.ratingRange[1]} stars
                    </Label>
                    <Slider
                      value={vendorFilters.ratingRange}
                      onValueChange={(value) => setVendorFilters((prev) => ({ ...prev, ratingRange: value }))}
                      max={5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Commission Range: {vendorFilters.commissionRange[0]}% - {vendorFilters.commissionRange[1]}%
                    </Label>
                    <Slider
                      value={vendorFilters.commissionRange}
                      onValueChange={(value) => setVendorFilters((prev) => ({ ...prev, commissionRange: value }))}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search vendors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setVendorFilters({
                        revenueRange: [0, 1000000],
                        ratingRange: [0, 5],
                        commissionRange: [5, 30],
                      })
                      setSearchTerm("")
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Management Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vendor Management</CardTitle>
                    <CardDescription>Manage vendor approvals, commissions, and performance</CardDescription>
                  </div>
                  <Button onClick={handleAddVendor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{vendor.name}</div>
                            <div className="text-sm text-gray-500">{vendor.email}</div>
                            <div className="text-xs text-gray-400">
                              {vendor.products} products • {vendor.orders} orders
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{vendor.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(vendor.revenue)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{vendor.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{vendor.commission}%</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              vendor.status === "active"
                                ? "bg-green-100 text-green-800"
                                : vendor.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {vendor.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVendorApproval(vendor.id, true)}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVendorApproval(vendor.id, false)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => (window.location.href = `/admin/vendors/${vendor.id}`)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleVendorSuspension(vendor.id)}>
                              <Ban className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {vendors.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                          No vendors found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
