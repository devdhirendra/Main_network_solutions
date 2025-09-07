"use client"

import type React from "react"
import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Eye, Check, X, Clock, Users, UserCheck, UserX, Download } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  employeeRole: string
  operator: string
  leaveType: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  approvedBy: string | null
  approvedDate: string | null
  documents: string[]
}

interface LeavePolicy {
  id: string
  name: string
  type: string
  daysPerYear: number
  carryForward: boolean
  maxCarryForward: number
  applicableRoles: string[]
  description: string
}

interface EmployeeBalance {
  employeeId: string
  employeeName: string
  role: string
  operator: string
  annual: { total: number; used: number; remaining: number }
  sick: { total: number; used: number; remaining: number }
  emergency: { total: number; used: number; remaining: number }
}

// Demo data for leave requests
const leaveRequests: LeaveRequest[] = [
  {
    id: "LR001",
    employeeId: "TECH001",
    employeeName: "Ravi Kumar",
    employeeRole: "Technician",
    operator: "City Networks",
    leaveType: "sick",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    days: 3,
    reason: "Fever and flu symptoms",
    status: "pending",
    appliedDate: "2024-01-18",
    approvedBy: null,
    approvedDate: null,
    documents: ["medical_certificate.pdf"],
  },
  {
    id: "LR002",
    employeeId: "STAFF001",
    employeeName: "Priya Singh",
    employeeRole: "Staff",
    operator: "Metro Fiber",
    leaveType: "annual",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    days: 5,
    reason: "Family vacation",
    status: "approved",
    appliedDate: "2024-01-15",
    approvedBy: "Admin",
    approvedDate: "2024-01-16",
    documents: [],
  },
  {
    id: "LR003",
    employeeId: "TECH002",
    employeeName: "Amit Sharma",
    employeeRole: "Technician",
    operator: "Speed Net",
    leaveType: "emergency",
    startDate: "2024-01-25",
    endDate: "2024-01-25",
    days: 1,
    reason: "Family emergency",
    status: "rejected",
    appliedDate: "2024-01-24",
    approvedBy: "Admin",
    approvedDate: "2024-01-24",
    documents: [],
  },
]

// Demo data for leave policies
const leavePolicies: LeavePolicy[] = [
  {
    id: "LP001",
    name: "Annual Leave",
    type: "annual",
    daysPerYear: 21,
    carryForward: true,
    maxCarryForward: 5,
    applicableRoles: ["Technician", "Staff", "Operator"],
    description: "Paid annual leave for all employees",
  },
  {
    id: "LP002",
    name: "Sick Leave",
    type: "sick",
    daysPerYear: 12,
    carryForward: false,
    maxCarryForward: 0,
    applicableRoles: ["Technician", "Staff", "Operator"],
    description: "Medical leave with doctor's certificate required for more than 2 days",
  },
  {
    id: "LP003",
    name: "Emergency Leave",
    type: "emergency",
    daysPerYear: 5,
    carryForward: false,
    maxCarryForward: 0,
    applicableRoles: ["Technician", "Staff"],
    description: "Unpaid emergency leave for urgent personal matters",
  },
]

// Demo data for employee leave balances
const employeeBalances: EmployeeBalance[] = [
  {
    employeeId: "TECH001",
    employeeName: "Ravi Kumar",
    role: "Technician",
    operator: "City Networks",
    annual: { total: 21, used: 5, remaining: 16 },
    sick: { total: 12, used: 2, remaining: 10 },
    emergency: { total: 5, used: 0, remaining: 5 },
  },
  {
    employeeId: "STAFF001",
    employeeName: "Priya Singh",
    role: "Staff",
    operator: "Metro Fiber",
    annual: { total: 21, used: 8, remaining: 13 },
    sick: { total: 12, used: 1, remaining: 11 },
    emergency: { total: 5, used: 1, remaining: 4 },
  },
]

export default function LeaveManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showPolicyDialog, setShowPolicyDialog] = useState(false)
  const [leaveRequestsData, setLeaveRequestsData] = useState<LeaveRequest[]>(leaveRequests)

  const filteredRequests = leaveRequestsData.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesRole = roleFilter === "all" || request.employeeRole === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "annual":
        return "bg-blue-100 text-blue-800"
      case "sick":
        return "bg-orange-100 text-orange-800"
      case "emergency":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      console.log("[v0] Approving leave request:", requestId)

      // Update local state immediately for better UX
      setLeaveRequestsData((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "approved" as const,
                approvedBy: "Admin",
                approvedDate: new Date().toISOString(),
              }
            : request,
        ),
      )

      // TODO: Add API call here when backend is ready
      // await apiClient.approveLeaveRequest(requestId)

      toast.success("Leave request approved successfully!")
    } catch (error) {
      console.error("[v0] Error approving leave request:", error)
      toast.error("Failed to approve leave request. Please try again.")

      // Revert state on error
      setLeaveRequestsData((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: "pending" as const, approvedBy: null, approvedDate: null }
            : request,
        ),
      )
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      console.log("[v0] Rejecting leave request:", requestId)

      // Update local state immediately for better UX
      setLeaveRequestsData((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "rejected" as const,
                approvedBy: "Admin",
                approvedDate: new Date().toISOString(),
              }
            : request,
        ),
      )

      // TODO: Add API call here when backend is ready
      // await apiClient.rejectLeaveRequest(requestId)

      toast.success("Leave request rejected!")
    } catch (error) {
      console.error("[v0] Error rejecting leave request:", error)
      toast.error("Failed to reject leave request. Please try again.")

      // Revert state on error
      setLeaveRequestsData((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: "pending" as const, approvedBy: null, approvedDate: null }
            : request,
        ),
      )
    }
  }

  const handleExport = () => {
    toast.success("Leave data exported successfully!")
    // Export logic here
  }

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setShowDetailsDialog(true)
  }

  const pendingRequests = leaveRequestsData.filter((r) => r.status === "pending").length
  const approvedRequests = leaveRequestsData.filter((r) => r.status === "approved").length
  const rejectedRequests = leaveRequestsData.filter((r) => r.status === "rejected").length
  const totalRequests = leaveRequestsData.length

  return (
    <DashboardLayout title="Leave Management" description="Manage employee leave requests and policies">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Requests</CardTitle>
              <Users className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{totalRequests}</div>
              <p className="text-sm text-gray-500 mt-2">This month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Pending</CardTitle>
              <Clock className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{pendingRequests}</div>
              <p className="text-sm text-gray-500 mt-2">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Approved</CardTitle>
              <UserCheck className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{approvedRequests}</div>
              <p className="text-sm text-gray-500 mt-2">This month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Rejected</CardTitle>
              <UserX className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{rejectedRequests}</div>
              <p className="text-sm text-gray-500 mt-2">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full max-w-lg grid-cols-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="requests" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Leave Requests
              </TabsTrigger>
              <TabsTrigger value="balances" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Leave Balances
              </TabsTrigger>
              <TabsTrigger value="policies" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Leave Policies
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Policy
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Leave Policy</DialogTitle>
                    <DialogDescription>Define a new leave policy for employees</DialogDescription>
                  </DialogHeader>
                  <LeavePolicyForm onClose={() => setShowPolicyDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="requests" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by employee name or request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Operator">Operator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Leave Requests Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Leave Requests ({filteredRequests.length})
                </CardTitle>
                <CardDescription>Manage employee leave requests and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{request.employeeName}</div>
                              <div className="text-sm text-gray-500">{request.employeeRole}</div>
                              <div className="text-sm text-gray-500">{request.operator}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getLeaveTypeColor(request.leaveType)}>{request.leaveType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.days} days</div>
                              <div className="text-sm text-gray-500">
                                {format(new Date(request.startDate), "MMM dd")} -{" "}
                                {format(new Date(request.endDate), "MMM dd")}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={request.reason}>
                              {request.reason}
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(request.appliedDate), "MMM dd, yyyy")}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleViewDetails(request)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {request.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleApproveRequest(request.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleRejectRequest(request.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balances" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Employee Leave Balances</CardTitle>
                <CardDescription>Current leave balance for all employees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Annual Leave</TableHead>
                        <TableHead>Sick Leave</TableHead>
                        <TableHead>Emergency Leave</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeeBalances.map((employee) => (
                        <TableRow key={employee.employeeId}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{employee.employeeName}</div>
                              <div className="text-sm text-gray-500">{employee.role}</div>
                              <div className="text-sm text-gray-500">{employee.operator}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">{employee.annual.remaining}</span> /{" "}
                                {employee.annual.total} days
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(employee.annual.remaining / employee.annual.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">{employee.sick.remaining}</span> / {employee.sick.total}{" "}
                                days
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{ width: `${(employee.sick.remaining / employee.sick.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">{employee.emergency.remaining}</span> /{" "}
                                {employee.emergency.total} days
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-red-600 h-2 rounded-full"
                                  style={{
                                    width: `${(employee.emergency.remaining / employee.emergency.total) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leavePolicies.map((policy) => (
                <Card key={policy.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900">{policy.name}</CardTitle>
                      <Badge className={getLeaveTypeColor(policy.type)}>{policy.type}</Badge>
                    </div>
                    <CardDescription>{policy.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Days per year:</span>
                        <span className="font-medium">{policy.daysPerYear}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Carry forward:</span>
                        <span className="font-medium">{policy.carryForward ? "Yes" : "No"}</span>
                      </div>
                      {policy.carryForward && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Max carry forward:</span>
                          <span className="font-medium">{policy.maxCarryForward} days</span>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="text-gray-600">Applicable roles:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {policy.applicableRoles.map((role, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Leave Request Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
              <DialogDescription>Complete information about the leave request</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Employee Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {selectedRequest.employeeName}
                      </div>
                      <div>
                        <span className="font-medium">Role:</span> {selectedRequest.employeeRole}
                      </div>
                      <div>
                        <span className="font-medium">Operator:</span> {selectedRequest.operator}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Leave Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Type:</span>{" "}
                        <Badge className={getLeaveTypeColor(selectedRequest.leaveType)}>
                          {selectedRequest.leaveType}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {selectedRequest.days} days
                      </div>
                      <div>
                        <span className="font-medium">Dates:</span>{" "}
                        {format(new Date(selectedRequest.startDate), "MMM dd, yyyy")} -{" "}
                        {format(new Date(selectedRequest.endDate), "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reason</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRequest.reason}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Application Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Applied Date:</span>{" "}
                        {format(new Date(selectedRequest.appliedDate), "MMM dd, yyyy")}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        <Badge className={getStatusColor(selectedRequest.status)}>{selectedRequest.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Approval Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Approved By:</span> {selectedRequest.approvedBy || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Approved Date:</span>{" "}
                        {selectedRequest.approvedDate
                          ? format(new Date(selectedRequest.approvedDate), "MMM dd, yyyy")
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <span className="text-blue-600 underline cursor-pointer">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedRequest.status === "pending" && (
                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => {
                        handleRejectRequest(selectedRequest.id)
                        setShowDetailsDialog(false)
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApproveRequest(selectedRequest.id)
                        setShowDetailsDialog(false)
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

interface LeavePolicyFormData {
  name: string
  type: string
  daysPerYear: string
  carryForward: boolean
  maxCarryForward: string
  description: string
  applicableRoles: string[]
}

// Leave Policy Form Component
function LeavePolicyForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<LeavePolicyFormData>({
    name: "",
    type: "annual",
    daysPerYear: "",
    carryForward: false,
    maxCarryForward: "",
    description: "",
    applicableRoles: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Leave policy created successfully!")
    console.log("Policy form submitted:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Policy Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Leave Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Annual Leave</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="emergency">Emergency Leave</SelectItem>
              <SelectItem value="maternity">Maternity Leave</SelectItem>
              <SelectItem value="paternity">Paternity Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="daysPerYear">Days Per Year *</Label>
          <Input
            id="daysPerYear"
            type="number"
            value={formData.daysPerYear}
            onChange={(e) => setFormData({ ...formData, daysPerYear: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="maxCarryForward">Max Carry Forward Days</Label>
          <Input
            id="maxCarryForward"
            type="number"
            value={formData.maxCarryForward}
            onChange={(e) => setFormData({ ...formData, maxCarryForward: e.target.value })}
            disabled={!formData.carryForward}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="carryForward"
          checked={formData.carryForward}
          onChange={(e) => setFormData({ ...formData, carryForward: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="carryForward">Allow carry forward to next year</Label>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Policy</Button>
      </div>
    </form>
  )
}
