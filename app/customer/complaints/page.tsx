"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Headphones,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  Search,
  Eye,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function CustomerComplaintsPage() {
  const [priorityRange, setPriorityRange] = useState([1, 5])
  const [searchTerm, setSearchTerm] = useState("")
  const [newComplaint, setNewComplaint] = useState({
    category: "",
    priority: "medium",
    subject: "",
    description: "",
  })
  const { toast } = useToast()

  const complaints = [
    {
      id: "CMP-2024-001",
      subject: "Internet connection frequently dropping",
      category: "Technical",
      priority: "high",
      status: "in-progress",
      createdDate: "2024-01-20",
      lastUpdate: "2024-01-22",
      assignedTo: "Tech Support Team",
      description: "My internet connection has been dropping every few hours for the past week.",
      resolution: "",
      rating: null,
    },
    {
      id: "CMP-2024-002",
      subject: "Billing discrepancy in January invoice",
      category: "Billing",
      priority: "medium",
      status: "resolved",
      createdDate: "2024-01-15",
      lastUpdate: "2024-01-18",
      assignedTo: "Billing Team",
      description: "There seems to be an extra charge of ₹200 in my January bill that I don't understand.",
      resolution: "The extra charge was for installation of additional equipment. Refund processed.",
      rating: 5,
    },
    {
      id: "CMP-2023-045",
      subject: "Slow internet speed during peak hours",
      category: "Technical",
      priority: "medium",
      status: "closed",
      createdDate: "2023-12-10",
      lastUpdate: "2023-12-15",
      assignedTo: "Network Team",
      description: "Internet speed drops significantly during evening hours (7-10 PM).",
      resolution: "Network capacity upgraded in your area. Issue resolved.",
      rating: 4,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "open":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "open":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const handleSubmitComplaint = () => {
    if (!newComplaint.category || !newComplaint.subject || !newComplaint.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been submitted successfully. You will receive updates via email.",
    })

    setNewComplaint({
      category: "",
      priority: "medium",
      subject: "",
      description: "",
    })
  }

  const handleRating = (complaintId: string, rating: number) => {
    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback. It helps us improve our service.",
    })
  }

  return (
    <DashboardLayout title="My Complaints" description="Submit and track your service complaints">
      <div className="space-y-6">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active Complaints</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="new">Submit New</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Complaints</CardTitle>
                <CardDescription>Filter your complaints by priority and search terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>
                      Priority Range: {priorityRange[0]} - {priorityRange[1]}
                    </Label>
                    <Slider
                      value={priorityRange}
                      onValueChange={setPriorityRange}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Complaints */}
            <Card>
              <CardHeader>
                <CardTitle>Active Complaints</CardTitle>
                <CardDescription>Your ongoing complaints and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Complaint</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints
                      .filter((c) => c.status === "in-progress" || c.status === "open")
                      .map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{complaint.subject}</div>
                              <div className="text-sm text-gray-500">{complaint.id}</div>
                              <div className="text-xs text-gray-400">Created: {formatDate(complaint.createdDate)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{complaint.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(complaint.priority)}>
                              {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(complaint.status)}
                              <Badge className={getStatusColor(complaint.status)}>
                                {complaint.status.replace("-", " ").charAt(0).toUpperCase() +
                                  complaint.status.replace("-", " ").slice(1)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{formatDate(complaint.lastUpdate)}</div>
                              <div className="text-xs text-gray-500">{complaint.assignedTo}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-3 w-3" />
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

          <TabsContent value="resolved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Complaints</CardTitle>
                <CardDescription>Your completed complaints and resolutions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Complaint</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Resolution</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Resolved Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints
                      .filter((c) => c.status === "resolved" || c.status === "closed")
                      .map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{complaint.subject}</div>
                              <div className="text-sm text-gray-500">{complaint.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{complaint.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-600 truncate">{complaint.resolution}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {complaint.rating ? (
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < complaint.rating! ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <Button size="sm" variant="outline" onClick={() => handleRating(complaint.id, 5)}>
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleRating(complaint.id, 2)}>
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(complaint.lastUpdate)}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Complaint</CardTitle>
                <CardDescription>Report an issue or concern with your service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newComplaint.category}
                      onValueChange={(value) => setNewComplaint((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing Issue</SelectItem>
                        <SelectItem value="service">Service Quality</SelectItem>
                        <SelectItem value="installation">Installation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newComplaint.priority}
                      onValueChange={(value) => setNewComplaint((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of the issue"
                    value={newComplaint.subject}
                    onChange={(e) => setNewComplaint((prev) => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the issue..."
                    rows={6}
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button onClick={handleSubmitComplaint} className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Complaint
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Immediate Help?</CardTitle>
                <CardDescription>Contact our support team directly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="p-3 bg-pink-100 rounded-lg">
                      <Phone className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone Support</h4>
                      <p className="text-sm text-gray-600">1800-123-4567</p>
                      <p className="text-xs text-gray-500">24/7 Available</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="p-3 bg-pink-100 rounded-lg">
                      <Mail className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Support</h4>
                      <p className="text-sm text-gray-600">support@network.com</p>
                      <p className="text-xs text-gray-500">Response within 2 hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Complaints</CardTitle>
                  <div className="p-2 bg-pink-500 rounded-lg">
                    <Headphones className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{complaints.length}</div>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Resolved</CardTitle>
                  <div className="p-2 bg-green-500 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {complaints.filter((c) => c.status === "resolved" || c.status === "closed").length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Successfully resolved</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">In Progress</CardTitle>
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {complaints.filter((c) => c.status === "in-progress").length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Being worked on</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Avg Rating</CardTitle>
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">4.5</div>
                  <p className="text-xs text-gray-500 mt-1">Service satisfaction</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Complaint Categories</CardTitle>
                <CardDescription>Breakdown of your complaints by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Technical Issues</span>
                    <span className="font-medium">2 complaints</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Billing Issues</span>
                    <span className="font-medium">1 complaint</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Service Quality</span>
                    <span className="font-medium">0 complaints</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
