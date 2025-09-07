"use client"
import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ClipboardList,
  Headphones,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Phone,
  UserCheck,
  Building2,
  ShoppingCart,
  BarChart3,
  Eye,
  ArrowUpRight,
  Calendar,
  Star,
  MessageSquare,
  Plus,
  Users,
  Settings,
  Filter,
  Search,
  Download,
  Shield,
  Activity,
} from "lucide-react"
import { getStatusColor } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface StaffStats {
  totalTasks: number
  completedTasks: number
  pendingTickets: number
  resolvedTickets: number
  customerSatisfaction: number
  monthlyPerformance: number
  activeOperators: number
  onboardingQueue: number
  followUpsDue: number
  vendorIssues: number
}

interface TaskItem {
  id: string
  title: string
  type: "ticket" | "onboarding" | "follow-up" | "vendor" | "quality"
  priority: "high" | "medium" | "low"
  assignedTo: string
  dueDate: string
  status: "pending" | "in-progress" | "completed"
  customer?: string
  description: string
}

interface PerformanceMetric {
  metric: string
  current: number
  target: number
  trend: "up" | "down" | "stable"
  percentage: number
}

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  role:
    | "Support Agent"
    | "Onboarding Manager"
    | "Technical Lead"
    | "Sales Manager"
    | "Marketplace Admin"
    | "Super Admin"
  status: "active" | "inactive"
  permissions: string[]
  lastLogin: string
  performance: number
  tasksCompleted: number
  createdDate: string
}

interface ActivityLog {
  id: string
  staffId: string
  staffName: string
  action: string
  module: string
  timestamp: string
  details: string
}

const staffMembers: StaffMember[] = [
  {
    id: "STF001",
    name: "Rajesh Kumar",
    email: "rajesh@company.com",
    phone: "+91 9876543210",
    role: "Support Agent",
    status: "active",
    permissions: ["tickets", "chat", "ivr_logs"],
    lastLogin: "2024-01-25T10:30:00Z",
    performance: 92,
    tasksCompleted: 156,
    createdDate: "2024-01-01",
  },
  {
    id: "STF002",
    name: "Priya Singh",
    email: "priya@company.com",
    phone: "+91 9876543211",
    role: "Onboarding Manager",
    status: "active",
    permissions: ["onboarding", "documents", "billing_plans"],
    lastLogin: "2024-01-25T09:15:00Z",
    performance: 88,
    tasksCompleted: 89,
    createdDate: "2024-01-05",
  },
  {
    id: "STF003",
    name: "Amit Sharma",
    email: "amit@company.com",
    phone: "+91 9876543212",
    role: "Technical Lead",
    status: "active",
    permissions: ["network", "api", "diagnostics", "backend"],
    lastLogin: "2024-01-25T11:45:00Z",
    performance: 95,
    tasksCompleted: 234,
    createdDate: "2023-12-15",
  },
]

const activityLogs: ActivityLog[] = [
  {
    id: "LOG001",
    staffId: "STF001",
    staffName: "Rajesh Kumar",
    action: "Resolved Support Ticket",
    module: "Support",
    timestamp: "2024-01-25T10:30:00Z",
    details: "Ticket #TKT-001 - Network connectivity issue resolved",
  },
  {
    id: "LOG002",
    staffId: "STF002",
    staffName: "Priya Singh",
    action: "Completed Operator Onboarding",
    module: "Onboarding",
    timestamp: "2024-01-25T09:15:00Z",
    details: "Operator Metro Fiber Solutions successfully onboarded",
  },
  {
    id: "LOG003",
    staffId: "STF003",
    staffName: "Amit Sharma",
    action: "Updated Network Configuration",
    module: "Technical",
    timestamp: "2024-01-25T11:45:00Z",
    details: "Backend API configuration updated for better performance",
  },
]

// Demo data
const fallbackStats: StaffStats = {
  totalTasks: 45,
  completedTasks: 32,
  pendingTickets: 18,
  resolvedTickets: 156,
  customerSatisfaction: 4.7,
  monthlyPerformance: 92,
  activeOperators: 142,
  onboardingQueue: 8,
  followUpsDue: 12,
  vendorIssues: 3,
}

const demoTasks: TaskItem[] = [
  {
    id: "TSK001",
    title: "Resolve Network Connectivity Issue",
    type: "ticket",
    priority: "high",
    assignedTo: "Support Team",
    dueDate: "2024-01-25",
    status: "in-progress",
    customer: "City Networks",
    description: "Customer reporting intermittent connectivity issues in sector 5",
  },
  {
    id: "TSK002",
    title: "Complete Operator Onboarding",
    type: "onboarding",
    priority: "medium",
    assignedTo: "Onboarding Team",
    dueDate: "2024-01-26",
    status: "pending",
    customer: "Metro Fiber Solutions",
    description: "New operator registration - document verification pending",
  },
  {
    id: "TSK003",
    title: "Vendor Product Verification",
    type: "vendor",
    priority: "medium",
    assignedTo: "Marketplace Team",
    dueDate: "2024-01-27",
    status: "pending",
    customer: "TechGear Suppliers",
    description: "Verify new product listings and pricing",
  },
  {
    id: "TSK004",
    title: "Customer Follow-up Call",
    type: "follow-up",
    priority: "low",
    assignedTo: "Sales Team",
    dueDate: "2024-01-28",
    status: "pending",
    customer: "Speed Net ISP",
    description: "Follow up on subscription renewal",
  },
]

const performanceMetrics: PerformanceMetric[] = [
  { metric: "Ticket Resolution Rate", current: 94, target: 95, trend: "up", percentage: 94 },
  { metric: "Customer Satisfaction", current: 4.7, target: 4.5, trend: "up", percentage: 94 },
  { metric: "Response Time (hrs)", current: 2.3, target: 2.0, trend: "down", percentage: 85 },
  { metric: "First Call Resolution", current: 78, target: 80, trend: "stable", percentage: 78 },
]

export default function StaffDashboardPage() {
  const [staffStats, setStaffStats] = useState<StaffStats>(fallbackStats)
  const [tasks, setTasks] = useState<TaskItem[]>(demoTasks)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [priorityFilter, setPriorityFilter] = useState([1, 3]) // 1=low, 2=medium, 3=high
  const [performanceRange, setPerformanceRange] = useState([80])
  const [taskLoadRange, setTaskLoadRange] = useState([50])
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false)
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Support Agent",
    permissions: [] as string[],
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "ticket":
        return <Headphones className="h-4 w-4" />
      case "onboarding":
        return <UserCheck className="h-4 w-4" />
      case "follow-up":
        return <Phone className="h-4 w-4" />
      case "vendor":
        return <ShoppingCart className="h-4 w-4" />
      case "quality":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <ClipboardList className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <ArrowUpRight className="h-4 w-4 text-red-600 rotate-180" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-800"
      case "Technical Lead":
        return "bg-blue-100 text-blue-800"
      case "Sales Manager":
        return "bg-green-100 text-green-800"
      case "Marketplace Admin":
        return "bg-orange-100 text-orange-800"
      case "Onboarding Manager":
        return "bg-indigo-100 text-indigo-800"
      case "Support Agent":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPermissionsByRole = (role: string) => {
    switch (role) {
      case "Support Agent":
        return ["tickets", "chat", "ivr_logs"]
      case "Onboarding Manager":
        return ["onboarding", "documents", "billing_plans"]
      case "Technical Lead":
        return ["network", "api", "diagnostics", "backend"]
      case "Sales Manager":
        return ["crm", "subscriptions", "payments", "renewals"]
      case "Marketplace Admin":
        return ["vendors", "products", "pricing", "disputes", "inventory"]
      case "Super Admin":
        return ["all_modules", "staff_management", "system_config", "reports"]
      default:
        return []
    }
  }

  const handleCreateStaff = () => {
    const staff = {
      ...newStaff,
      id: `STF${String(staffMembers.length + 1).padStart(3, "0")}`,
      status: "active" as const,
      permissions: getPermissionsByRole(newStaff.role),
      lastLogin: new Date().toISOString(),
      performance: 0,
      tasksCompleted: 0,
      createdDate: new Date().toISOString().split("T")[0],
    }

    console.log("Creating staff member:", staff)
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      role: "Support Agent",
      permissions: [],
    })
    setIsStaffDialogOpen(false)
    toast({
      title: "Staff Member Created",
      description: `${staff.name} has been added to the team.`,
    })
  }

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || staff.role === selectedRole
    const matchesPerformance = staff.performance >= performanceRange[0]
    return matchesSearch && matchesRole && matchesPerformance
  })

  const filteredTasks = tasks.filter((task) => {
    const priorityMap = { low: 1, medium: 2, high: 3 }
    const taskPriority = priorityMap[task.priority as keyof typeof priorityMap]
    return taskPriority >= priorityFilter[0] && taskPriority <= priorityFilter[1]
  })

  const refreshData = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated successfully.",
      })
    }, 1000)
  }

  return (
    <DashboardLayout title="Staff Dashboard" description="Manage your daily tasks and performance metrics">
      <div className="space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading dashboard data...</span>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">My Tasks</CardTitle>
              <div className="p-2 bg-indigo-500 rounded-lg">
                <ClipboardList className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{staffStats.totalTasks}</div>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">{staffStats.completedTasks} completed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Support Tickets</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Headphones className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{staffStats.pendingTickets}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">{staffStats.resolvedTickets} resolved</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Customer Satisfaction</CardTitle>
              <div className="p-2 bg-green-500 rounded-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{staffStats.customerSatisfaction}/5.0</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">Above target</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Performance</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{staffStats.monthlyPerformance}%</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">This month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Task Management & Filtering
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </CardTitle>
            <CardDescription>Use sliders to filter tasks by priority and manage workload distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Task Priority Filter</Label>
                  <div className="mt-3">
                    <Slider
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                      max={3}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>Low</span>
                      <span className="font-medium text-indigo-600">
                        {priorityFilter[0] === 1 ? "Low" : priorityFilter[0] === 2 ? "Medium" : "High"} -{" "}
                        {priorityFilter[1] === 1 ? "Low" : priorityFilter[1] === 2 ? "Medium" : "High"}
                      </span>
                      <span>High</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Filter tasks by priority level to focus on urgent items</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Performance Threshold (%)</Label>
                  <div className="mt-3">
                    <Slider
                      value={performanceRange}
                      onValueChange={setPerformanceRange}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>50%</span>
                      <span className="font-medium text-indigo-600">{performanceRange[0]}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Filter staff members by minimum performance level</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Task Load Distribution</Label>
                  <div className="mt-3">
                    <Slider
                      value={taskLoadRange}
                      onValueChange={setTaskLoadRange}
                      max={100}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>Light</span>
                      <span className="font-medium text-indigo-600">{taskLoadRange[0]}% Load</span>
                      <span>Heavy</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Adjust workload distribution across team members</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Filtered Results</h4>
                  <p className="text-sm text-gray-600">
                    Showing {filteredTasks.length} tasks and {filteredStaff.length} staff members based on your filters
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Operators</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staffStats.activeOperators}</div>
              <p className="text-xs text-gray-500 mt-1">Under management</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Onboarding Queue</CardTitle>
              <UserCheck className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staffStats.onboardingQueue}</div>
              <p className="text-xs text-gray-500 mt-1">Pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Follow-ups Due</CardTitle>
              <Phone className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staffStats.followUpsDue}</div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Vendor Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staffStats.vendorIssues}</div>
              <p className="text-xs text-gray-500 mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                    Staff Management
                  </CardTitle>
                  <CardDescription>Manage team members and their roles</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Staff
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Staff Member</DialogTitle>
                        <DialogDescription>Add a new team member with role-based access</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={newStaff.name}
                              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                              placeholder="Enter full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newStaff.email}
                              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                              placeholder="email@company.com"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={newStaff.phone}
                              onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                              placeholder="+91 9876543210"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                              value={newStaff.role}
                              onValueChange={(value) => setNewStaff({ ...newStaff, role: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Support Agent">Support Agent</SelectItem>
                                <SelectItem value="Onboarding Manager">Onboarding Manager</SelectItem>
                                <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                                <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                                <SelectItem value="Marketplace Admin">Marketplace Admin</SelectItem>
                                <SelectItem value="Super Admin">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Permissions (Auto-assigned based on role)</Label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex flex-wrap gap-2">
                              {getPermissionsByRole(newStaff.role).map((permission) => (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {permission.replace("_", " ")}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsStaffDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateStaff} className="bg-indigo-600 hover:bg-indigo-700">
                          Create Staff Member
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search staff by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Support Agent">Support Agent</SelectItem>
                      <SelectItem value="Onboarding Manager">Onboarding Manager</SelectItem>
                      <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                      <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                      <SelectItem value="Marketplace Admin">Marketplace Admin</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{staff.name}</div>
                            <div className="text-sm text-gray-500">{staff.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(staff.role)}>{staff.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16">
                              <Progress value={staff.performance} className="h-2" />
                            </div>
                            <span className="text-sm font-medium">{staff.performance}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{staff.tasksCompleted}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              staff.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {staff.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your monthly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.metric} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(metric.trend)}
                        <span className="text-sm text-gray-600">
                          {metric.metric.includes("Time") ? `${metric.current}h` : metric.current}
                        </span>
                      </div>
                    </div>
                    <Progress value={metric.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Target: {metric.target}</span>
                      <span>{metric.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Activity Logs
                </CardTitle>
                <CardDescription>Real-time staff activity tracking</CardDescription>
              </div>
              <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Complete Activity Log</DialogTitle>
                    <DialogDescription>Detailed view of all staff activities and system changes</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{log.action}</h4>
                            <p className="text-sm text-gray-600">by {log.staffName}</p>
                          </div>
                          <Badge variant="outline">{log.module}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                        <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className="p-1 rounded-full bg-blue-100">
                      <Shield className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600 mt-1">by {log.staffName}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {log.module}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Your assigned tasks and priorities (filtered)</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTaskTypeIcon(task.type)}
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                          <p className="text-sm text-gray-600">{task.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Headphones className="h-6 w-6" />
                <span className="text-sm">New Ticket</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <UserCheck className="h-6 w-6" />
                <span className="text-sm">Onboard Operator</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Phone className="h-6 w-6" />
                <span className="text-sm">Schedule Call</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Send Message</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">View Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule Task</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
