"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  Play,
  MessageSquare,
  Camera,
  FileText,
  Navigation,
  MoreVertical,
  Calendar,
  Wifi,
  WifiOff,
  Router,
  Save,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for complaints
const mockComplaints = [
  {
    id: "CMP-001",
    ticketNumber: "TKT-2024-001",
    customer: {
      name: "Rajesh Kumar",
      phone: "+91 9876543210",
      address: "House 123, Sector 15, Chandigarh",
      email: "rajesh@example.com",
      customerId: "CUST-001",
    },
    issue: {
      type: "connectivity",
      category: "No Internet",
      description: "Internet connection not working since morning",
      severity: "high",
      reportedTime: "2024-01-20T08:30:00Z",
    },
    status: "assigned",
    priority: "high",
    assignedDate: "2024-01-20T09:00:00Z",
    dueDate: "2024-01-20T12:00:00Z",
    estimatedResolution: "2 hours",
    location: { lat: 30.7333, lng: 76.7794 },
    previousComplaints: 2,
    customerNotes: "Customer is working from home and needs urgent resolution",
    technicianNotes: "",
  },
  {
    id: "CMP-002",
    ticketNumber: "TKT-2024-002",
    customer: {
      name: "Priya Singh",
      phone: "+91 9876543211",
      address: "Flat 45, Sector 22, Chandigarh",
      email: "priya@example.com",
      customerId: "CUST-002",
    },
    issue: {
      type: "speed",
      category: "Slow Internet",
      description: "Internet speed is very slow, getting only 10 Mbps instead of 100 Mbps",
      severity: "medium",
      reportedTime: "2024-01-20T10:15:00Z",
    },
    status: "in_progress",
    priority: "medium",
    assignedDate: "2024-01-20T10:30:00Z",
    dueDate: "2024-01-20T16:00:00Z",
    estimatedResolution: "3 hours",
    location: { lat: 30.7614, lng: 76.7911 },
    previousComplaints: 0,
    customerNotes: "Speed test results attached",
    technicianNotes: "Checking signal strength and cable connections",
    startTime: "2024-01-20T11:00:00Z",
  },
  {
    id: "CMP-003",
    ticketNumber: "TKT-2024-003",
    customer: {
      name: "Amit Sharma",
      phone: "+91 9876543212",
      address: "Shop 67, Sector 35, Chandigarh",
      email: "amit@example.com",
      customerId: "CUST-003",
    },
    issue: {
      type: "hardware",
      category: "Equipment Fault",
      description: "Router keeps restarting every few minutes",
      severity: "medium",
      reportedTime: "2024-01-19T14:20:00Z",
    },
    status: "resolved",
    priority: "medium",
    assignedDate: "2024-01-19T15:00:00Z",
    dueDate: "2024-01-19T18:00:00Z",
    estimatedResolution: "1 hour",
    location: { lat: 30.6942, lng: 76.7611 },
    previousComplaints: 1,
    customerNotes: "Router is 2 years old",
    technicianNotes: "Replaced faulty router with new model. Issue resolved.",
    resolvedTime: "2024-01-19T16:30:00Z",
    resolution: "Router replacement completed successfully",
  },
]

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(mockComplaints)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [technicianNotes, setTechnicianNotes] = useState("")
  const [resolution, setResolution] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issue.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "assigned":
        return "bg-orange-100 text-orange-800"
      case "escalated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case "connectivity":
        return <WifiOff className="h-4 w-4" />
      case "speed":
        return <Wifi className="h-4 w-4" />
      case "hardware":
        return <Router className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const handleStartWork = (complaintId: string) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === complaintId
          ? { ...complaint, status: "in_progress", startTime: new Date().toISOString() }
          : complaint,
      ),
    )
    setHasChanges(true)
  }

  const handleResolveComplaint = (complaintId: string) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === complaintId
          ? {
              ...complaint,
              status: "resolved",
              resolvedTime: new Date().toISOString(),
              resolution: resolution || "Issue resolved successfully",
            }
          : complaint,
      ),
    )
    setHasChanges(true)
    setResolution("")
  }

  const handleApplyChanges = () => {
    console.log("Applying changes:", complaints)
    setHasChanges(false)
  }

  const handleViewOnMap = (location: any) => {
    const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`
    window.open(url, "_blank")
  }

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  const complaintStats = {
    total: complaints.length,
    assigned: complaints.filter((c) => c.status === "assigned").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Complaints</h1>
          <p className="text-gray-500">Manage and resolve customer issues efficiently</p>
        </div>
        {hasChanges && (
          <Button onClick={handleApplyChanges} className="bg-orange-600 hover:bg-orange-700">
            <Save className="h-4 w-4 mr-2" />
            Apply Changes
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Total Complaints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{complaintStats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Assigned</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{complaintStats.assigned}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">In Progress</CardTitle>
            <Play className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{complaintStats.inProgress}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{complaintStats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Complaints List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Complaint Management</CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 mb-3">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(complaint.issue.type)}
                      <h3 className="font-medium text-gray-900">{complaint.issue.category}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                      <Badge variant="outline">{complaint.ticketNumber}</Badge>
                      {complaint.previousComplaints > 0 && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                          Repeat Customer ({complaint.previousComplaints})
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{complaint.customer.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{complaint.customer.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{complaint.customer.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{complaint.issue.description}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Reported: {new Date(complaint.issue.reportedTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Est. Resolution: {complaint.estimatedResolution}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 lg:ml-4">
                  <Badge className={getStatusColor(complaint.status)}>
                    {complaint.status.replace("_", " ").toUpperCase()}
                  </Badge>

                  <div className="flex flex-wrap gap-2">
                    {complaint.status === "assigned" && (
                      <Button
                        size="sm"
                        onClick={() => handleStartWork(complaint.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start Work
                      </Button>
                    )}

                    {complaint.status === "in_progress" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Resolve Complaint</DialogTitle>
                            <DialogDescription>
                              Provide resolution details for {complaint.ticketNumber}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="resolution">Resolution Details</Label>
                              <Textarea
                                id="resolution"
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                placeholder="Describe how the issue was resolved..."
                                rows={4}
                              />
                            </div>
                            <Button onClick={() => handleResolveComplaint(complaint.id)} className="w-full">
                              <Save className="h-4 w-4 mr-2" />
                              Mark as Resolved
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button size="sm" variant="outline" onClick={() => handleViewOnMap(complaint.location)}>
                      <Navigation className="h-4 w-4 mr-1" />
                      Map
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => handleCallCustomer(complaint.customer.phone)}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{complaint.ticketNumber} - Details</DialogTitle>
                          <DialogDescription>Complete complaint information and history</DialogDescription>
                        </DialogHeader>
                        <ComplaintDetailsModal complaint={complaint} />
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Camera className="mr-2 h-4 w-4" />
                          Upload Photo
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Escalate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Add Notes
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// Complaint Details Modal Component
function ComplaintDetailsModal({ complaint }: { complaint: any }) {
  const [notes, setNotes] = useState(complaint.technicianNotes || "")
  const [hasChanges, setHasChanges] = useState(false)

  const handleSaveNotes = () => {
    console.log("Saving notes:", notes)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Customer Information</Label>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{complaint.customer.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{complaint.customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{complaint.customer.address}</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Complaint Information</Label>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Priority:</span>
              <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span>{complaint.issue.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Severity:</span>
              <span className="capitalize">{complaint.issue.severity}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Issue Description</Label>
        <p className="mt-2 text-sm text-gray-600">{complaint.issue.description}</p>
      </div>

      {complaint.customerNotes && (
        <div>
          <Label className="text-sm font-medium">Customer Notes</Label>
          <p className="mt-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">{complaint.customerNotes}</p>
        </div>
      )}

      <div>
        <Label htmlFor="techNotes" className="text-sm font-medium">
          Technician Notes
        </Label>
        <Textarea
          id="techNotes"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value)
            setHasChanges(true)
          }}
          placeholder="Add your technical notes here..."
          className="mt-2"
          rows={4}
        />
        {hasChanges && (
          <Button onClick={handleSaveNotes} className="mt-2" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Notes
          </Button>
        )}
      </div>

      {complaint.resolution && (
        <div>
          <Label className="text-sm font-medium">Resolution</Label>
          <p className="mt-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">{complaint.resolution}</p>
        </div>
      )}
    </div>
  )
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
