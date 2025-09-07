"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CheckCircle,
  Clock,
  MapPin,
  User,
  Phone,
  AlertTriangle,
  Play,
  Navigation,
  Package,
  Calendar,
  TrendingUp,
  Activity,
  Wrench,
  Users,
  Target,
  Zap,
} from "lucide-react"

// Mock data for technician dashboard
const mockTasks = [
  {
    id: "TASK-001",
    type: "installation",
    title: "Fiber Installation - New Connection",
    customer: {
      name: "Rajesh Kumar",
      phone: "+91 9876543210",
      address: "House 123, Sector 15, Chandigarh",
    },
    priority: "high",
    status: "assigned",
    dueTime: "10:00 AM",
    estimatedDuration: "2 hours",
    location: { lat: 30.7333, lng: 76.7794 },
  },
  {
    id: "TASK-002",
    type: "maintenance",
    title: "Router Replacement",
    customer: {
      name: "Priya Singh",
      phone: "+91 9876543211",
      address: "Flat 45, Sector 22, Chandigarh",
    },
    priority: "medium",
    status: "in_progress",
    dueTime: "2:00 PM",
    estimatedDuration: "1 hour",
    location: { lat: 30.7614, lng: 76.7911 },
    startedAt: "1:30 PM",
  },
  {
    id: "TASK-003",
    type: "repair",
    title: "Signal Issue Investigation",
    customer: {
      name: "Amit Sharma",
      phone: "+91 9876543212",
      address: "Shop 67, Sector 35, Chandigarh",
    },
    priority: "high",
    status: "assigned",
    dueTime: "4:00 PM",
    estimatedDuration: "1.5 hours",
    location: { lat: 30.6942, lng: 76.7611 },
  },
]

const mockStats = {
  tasksCompleted: 12,
  tasksInProgress: 2,
  tasksPending: 3,
  customersSatisfied: 45,
  avgResponseTime: "25 min",
  completionRate: 94,
  monthlyTarget: 50,
  currentMonth: 35,
}

const mockInventory = [
  { name: "Fiber Cable", stock: 15, minStock: 10, status: "good" },
  { name: "ONT Devices", stock: 3, minStock: 5, status: "low" },
  { name: "Routers", stock: 8, minStock: 5, status: "good" },
  { name: "Splitters", stock: 0, minStock: 3, status: "out" },
]

const mockRecentActivities = [
  {
    id: 1,
    type: "task_completed",
    description: "Completed fiber installation at House 89, Sector 18",
    time: "2 hours ago",
    customer: "Neha Gupta",
  },
  {
    id: 2,
    type: "inventory_used",
    description: "Used 50m fiber cable for installation",
    time: "2 hours ago",
    item: "Fiber Cable",
  },
  {
    id: 3,
    type: "task_started",
    description: "Started router replacement at Flat 45, Sector 22",
    time: "30 minutes ago",
    customer: "Priya Singh",
  },
  {
    id: 4,
    type: "customer_call",
    description: "Received call from Rajesh Kumar regarding installation",
    time: "1 hour ago",
    customer: "Rajesh Kumar",
  },
]

export default function TechnicianDashboardPage() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [tasks, setTasks] = useState(mockTasks)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!user) {
    return <div>Loading...</div>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "assigned":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "installation":
        return <Zap className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "repair":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "low":
        return "text-yellow-600"
      case "out":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const handleStartTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: "in_progress", startedAt: currentTime.toLocaleTimeString() } : task,
      ),
    )
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)))
  }

  const handleNavigate = (location: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`
    window.open(url, "_blank")
  }

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-50 via-blue-50 to-green-50 rounded-lg p-6 border-0 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileDetail.avatar || "/placeholder.svg"} alt={user.profileDetail.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.profileDetail.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.profileDetail.name}!</h1>
              <p className="text-gray-600">
                {currentTime.toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-500">Current time: {currentTime.toLocaleTimeString("en-IN")}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Badge className="bg-orange-100 text-orange-800 text-center">Field Technician</Badge>
            <Badge className="bg-green-100 text-green-800 text-center">Active</Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{mockStats.tasksCompleted}</div>
            <p className="text-xs text-green-600 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{mockStats.tasksInProgress}</div>
            <p className="text-xs text-blue-600 mt-1">Active tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{mockStats.tasksPending}</div>
            <p className="text-xs text-orange-600 mt-1">Assigned tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{mockStats.completionRate}%</div>
            <p className="text-xs text-purple-600 mt-1">Success rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
            <CardDescription>Your scheduled tasks for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTaskTypeIcon(task.type)}
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{task.customer.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{task.customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{task.customer.address}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Due: {task.dueTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-4 w-4" />
                          <span>Est: {task.estimatedDuration}</span>
                        </div>
                        {task.startedAt && (
                          <div className="flex items-center space-x-1">
                            <Play className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-600">Started: {task.startedAt}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-4">
                    <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ").toUpperCase()}</Badge>

                    <div className="flex flex-wrap gap-2">
                      {task.status === "assigned" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartTask(task.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}

                      {task.status === "in_progress" && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteTask(task.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}

                      <Button size="sm" variant="outline" onClick={() => handleNavigate(task.location)}>
                        <Navigation className="h-4 w-4 mr-1" />
                        Navigate
                      </Button>

                      <Button size="sm" variant="outline" onClick={() => handleCallCustomer(task.customer.phone)}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & Inventory */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-orange-600 hover:bg-orange-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Check In/Out
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Package className="h-4 w-4 mr-2" />
                View Inventory
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                Customer Support
              </Button>
            </CardContent>
          </Card>

          {/* Inventory Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockInventory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Min: {item.minStock}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getInventoryStatusColor(item.status)}`}>{item.stock}</p>
                    <p className="text-xs text-gray-500">in stock</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Performance
            </CardTitle>
            <CardDescription>Your progress towards monthly targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tasks Completed</span>
                <span className="font-medium">
                  {mockStats.currentMonth}/{mockStats.monthlyTarget}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${(mockStats.currentMonth / mockStats.monthlyTarget) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-900">{mockStats.customersSatisfied}</p>
                <p className="text-xs text-blue-600">Happy Customers</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-900">{mockStats.avgResponseTime}</p>
                <p className="text-xs text-green-600">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your latest work activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
