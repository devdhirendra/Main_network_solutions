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
import {
  Search,
  Users,
  UserPlus,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react"
import { formatDate, formatCurrency, getStatusColor, exportToCSV } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Demo data for customers
const customers = [
  {
    id: "CUST001",
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    email: "rajesh@email.com",
    address: "House No. 123, Sector 15, Chandigarh",
    plan: "100 Mbps Premium",
    planPrice: 1200,
    status: "active",
    connectionDate: "2023-06-15",
    lastPayment: "2024-01-15",
    outstandingAmount: 0,
    ipAddress: "192.168.1.100",
    macAddress: "AA:BB:CC:DD:EE:FF",
    installationType: "fiber",
    technician: "Tech001",
  },
  {
    id: "CUST002",
    name: "Priya Singh",
    phone: "+91 9876543211",
    email: "priya@email.com",
    address: "Flat 45, Sector 22, Chandigarh",
    plan: "50 Mbps Basic",
    planPrice: 800,
    status: "pending",
    connectionDate: "2024-01-19",
    lastPayment: null,
    outstandingAmount: 800,
    ipAddress: "192.168.1.101",
    macAddress: "BB:CC:DD:EE:FF:AA",
    installationType: "fiber",
    technician: "Tech002",
  },
  {
    id: "CUST003",
    name: "Amit Sharma",
    phone: "+91 9876543212",
    email: "amit@email.com",
    address: "Shop 67, Industrial Area, Chandigarh",
    plan: "200 Mbps Business",
    planPrice: 2500,
    status: "active",
    connectionDate: "2023-08-20",
    lastPayment: "2024-01-10",
    outstandingAmount: 0,
    ipAddress: "192.168.1.102",
    macAddress: "CC:DD:EE:FF:AA:BB",
    installationType: "fiber",
    technician: "Tech001",
  },
  {
    id: "CUST004",
    name: "Neha Gupta",
    phone: "+91 9876543213",
    email: "neha@email.com",
    address: "House 89, Sector 35, Chandigarh",
    plan: "75 Mbps Standard",
    planPrice: 1000,
    status: "suspended",
    connectionDate: "2023-12-05",
    lastPayment: "2023-12-15",
    outstandingAmount: 2000,
    ipAddress: "192.168.1.103",
    macAddress: "DD:EE:FF:AA:BB:CC",
    installationType: "fiber",
    technician: "Tech003",
  },
  {
    id: "CUST005",
    name: "Suresh Patel",
    phone: "+91 9876543214",
    email: "suresh@email.com",
    address: "Villa 12, Sector 8, Chandigarh",
    plan: "150 Mbps Premium",
    planPrice: 1800,
    status: "active",
    connectionDate: "2023-09-10",
    lastPayment: "2024-01-12",
    outstandingAmount: 0,
    ipAddress: "192.168.1.104",
    macAddress: "EE:FF:AA:BB:CC:DD",
    installationType: "fiber",
    technician: "Tech002",
  },
]

// Demo data for plans
const availablePlans = [
  { id: "PLAN001", name: "25 Mbps Basic", speed: "25 Mbps", price: 500, type: "residential" },
  { id: "PLAN002", name: "50 Mbps Basic", speed: "50 Mbps", price: 800, type: "residential" },
  { id: "PLAN003", name: "75 Mbps Standard", speed: "75 Mbps", price: 1000, type: "residential" },
  { id: "PLAN004", name: "100 Mbps Premium", speed: "100 Mbps", price: 1200, type: "residential" },
  { id: "PLAN005", name: "150 Mbps Premium", speed: "150 Mbps", price: 1800, type: "residential" },
  { id: "PLAN006", name: "200 Mbps Business", speed: "200 Mbps", price: 2500, type: "business" },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false)
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showCustomerDetailsDialog, setShowCustomerDetailsDialog] = useState(false)
  const { toast } = useToast()

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesPlan = planFilter === "all" || customer.plan.includes(planFilter)
    return matchesSearch && matchesStatus && matchesPlan
  })

  const handleExport = () => {
    const exportData = customers.map((customer) => ({
      ID: customer.id,
      Name: customer.name,
      Phone: customer.phone,
      Email: customer.email,
      Address: customer.address,
      Plan: customer.plan,
      "Plan Price": customer.planPrice,
      Status: customer.status,
      "Connection Date": customer.connectionDate,
      "Last Payment": customer.lastPayment || "N/A",
      "Outstanding Amount": customer.outstandingAmount,
    }))
    exportToCSV(exportData, "customers")
    toast({
      title: "Export Successful",
      description: "Customer data has been exported to CSV file.",
    })
  }

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setShowCustomerDetailsDialog(true)
  }

  const handleEditCustomer = (customerId: string) => {
    toast({
      title: "Edit Customer",
      description: `Opening edit form for customer ${customerId}`,
    })
  }

  const handleDeleteCustomer = (customerId: string) => {
    toast({
      title: "Delete Customer",
      description: `Customer ${customerId} deletion requested`,
      variant: "destructive",
    })
  }

  const customerStats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    pending: customers.filter((c) => c.status === "pending").length,
    suspended: customers.filter((c) => c.status === "suspended").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.planPrice, 0),
    outstandingAmount: customers.reduce((sum, c) => sum + c.outstandingAmount, 0),
  }

  return (
    <DashboardLayout title="Customer Management" description="Manage your customers and their connections">
      <div className="space-y-6">
        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Customers</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{customerStats.total}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+12%</span>
                <span className="text-sm text-gray-500 ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Active</CardTitle>
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{customerStats.active}</div>
              <p className="text-sm text-gray-500 mt-2">
                {((customerStats.active / customerStats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Pending</CardTitle>
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{customerStats.pending}</div>
              <p className="text-sm text-gray-500 mt-2">Awaiting activation</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Outstanding</CardTitle>
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                {formatCurrency(customerStats.outstandingAmount)}
              </div>
              <p className="text-sm text-red-600 mt-2 font-medium">Needs collection</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="customers" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="customers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                All Customers
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Analytics
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showBulkUploadDialog} onOpenChange={setShowBulkUploadDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bulk Upload Customers</DialogTitle>
                    <DialogDescription>Upload a CSV file with customer data</DialogDescription>
                  </DialogHeader>
                  <BulkUploadForm onClose={() => setShowBulkUploadDialog(false)} />
                </DialogContent>
              </Dialog>
              <Dialog open={showAddCustomerDialog} onOpenChange={setShowAddCustomerDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>Create a new customer account</DialogDescription>
                  </DialogHeader>
                  <AddCustomerForm onClose={() => setShowAddCustomerDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="customers" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="disconnected">Disconnected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Basic">Basic Plans</SelectItem>
                  <SelectItem value="Standard">Standard Plans</SelectItem>
                  <SelectItem value="Premium">Premium Plans</SelectItem>
                  <SelectItem value="Business">Business Plans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Customers Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Customers ({filteredCustomers.length})
                </CardTitle>
                <CardDescription>Manage your customer base and connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Customer Details</TableHead>
                        <TableHead className="min-w-[150px]">Contact</TableHead>
                        <TableHead className="min-w-[120px]">Plan & Pricing</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[120px]">Connection Info</TableHead>
                        <TableHead className="min-w-[120px]">Outstanding</TableHead>
                        <TableHead className="min-w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.id}</div>
                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-[180px]">{customer.address}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                {customer.phone}
                              </div>
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-1 text-gray-400" />
                                <span className="truncate max-w-[120px]">{customer.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <Badge variant="outline" className="mb-1">
                                {customer.plan}
                              </Badge>
                              <div className="flex items-center text-sm font-medium">
                                <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
                                {formatCurrency(customer.planPrice)}/mo
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                {formatDate(customer.connectionDate)}
                              </div>
                              <div className="flex items-center">
                                <Wifi className="h-3 w-3 mr-1 text-gray-400" />
                                {customer.ipAddress}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`font-medium ${customer.outstandingAmount > 0 ? "text-red-600" : "text-green-600"}`}
                            >
                              {customer.outstandingAmount > 0 ? formatCurrency(customer.outstandingAmount) : "Paid"}
                            </div>
                            {customer.lastPayment && (
                              <div className="text-xs text-gray-500">Last: {formatDate(customer.lastPayment)}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleViewCustomer(customer)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditCustomer(customer.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteCustomer(customer.id)}>
                                <Trash2 className="h-4 w-4" />
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
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Customer Distribution by Plan</CardTitle>
                  <CardDescription>Breakdown of customers by service plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availablePlans.map((plan) => {
                      const count = customers.filter((c) => c.plan.includes(plan.name.split(" ")[1])).length
                      const percentage = customerStats.total > 0 ? (count / customerStats.total) * 100 : 0
                      return (
                        <div key={plan.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{plan.name}</span>
                            <span>
                              {count} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Monthly revenue and outstanding amounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {formatCurrency(customerStats.totalRevenue)}
                      </div>
                      <p className="text-sm text-gray-500">Monthly Recurring Revenue</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{customerStats.active}</div>
                        <p className="text-sm text-gray-500">Paying Customers</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">
                          {formatCurrency(customerStats.outstandingAmount)}
                        </div>
                        <p className="text-sm text-gray-500">Outstanding</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(customerStats.totalRevenue / customerStats.total)}
                      </div>
                      <p className="text-sm text-gray-500">Average Revenue Per User</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Customer Details Dialog */}
        <Dialog open={showCustomerDetailsDialog} onOpenChange={setShowCustomerDetailsDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>Complete information about the customer</DialogDescription>
            </DialogHeader>
            {selectedCustomer && <CustomerDetailsView customer={selectedCustomer} />}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

// Add Customer Form Component
function AddCustomerForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    plan: "",
    installationType: "fiber",
    technician: "",
    connectionDate: "",
    notes: "",
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Customer form submitted:", formData)
    toast({
      title: "Customer Added",
      description: `${formData.name} has been added successfully.`,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="address">Full Address *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="plan">Service Plan *</Label>
          <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              {availablePlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.name}>
                  {plan.name} - {formatCurrency(plan.price)}/mo
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="installationType">Installation Type</Label>
          <Select
            value={formData.installationType}
            onValueChange={(value) => setFormData({ ...formData, installationType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fiber">Fiber</SelectItem>
              <SelectItem value="cable">Cable</SelectItem>
              <SelectItem value="wireless">Wireless</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="technician">Assigned Technician</Label>
          <Select
            value={formData.technician}
            onValueChange={(value) => setFormData({ ...formData, technician: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tech001">Technician 1</SelectItem>
              <SelectItem value="Tech002">Technician 2</SelectItem>
              <SelectItem value="Tech003">Technician 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="connectionDate">Connection Date</Label>
          <Input
            id="connectionDate"
            type="date"
            value={formData.connectionDate}
            onChange={(e) => setFormData({ ...formData, connectionDate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Any additional notes or special instructions..."
        />
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Customer</Button>
      </div>
    </form>
  )
}

// Bulk Upload Form Component
function BulkUploadForm({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      })
      return
    }
    console.log("Bulk upload file:", file)
    toast({
      title: "Upload Started",
      description: "Processing your CSV file. You'll be notified when complete.",
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="file">CSV File *</Label>
        <Input id="file" type="file" accept=".csv" onChange={handleFileChange} required />
        <p className="text-sm text-gray-500 mt-1">Upload a CSV file with customer data. Maximum file size: 10MB</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Name, Phone, Email, Address, Plan (required columns)</li>
          <li>• Use comma-separated values</li>
          <li>• Include header row</li>
          <li>• Maximum 1000 records per file</li>
        </ul>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Upload Customers</Button>
      </div>
    </form>
  )
}

// Customer Details View Component
function CustomerDetailsView({ customer }: { customer: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer ID:</span>
                <span className="font-medium">{customer.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">{customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{customer.email}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Address</h3>
            <p className="text-sm text-gray-600">{customer.address}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Service Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Plan:</span>
                <Badge variant="outline">{customer.plan}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly Fee:</span>
                <span className="font-medium">{formatCurrency(customer.planPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Connection Date:</span>
                <span className="font-medium">{formatDate(customer.connectionDate)}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Technical Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">IP Address:</span>
                <span className="font-mono">{customer.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">MAC Address:</span>
                <span className="font-mono">{customer.macAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Installation Type:</span>
                <span className="font-medium capitalize">{customer.installationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Technician:</span>
                <span className="font-medium">{customer.technician}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500">Last Payment:</span>
            <div className="font-medium mt-1">
              {customer.lastPayment ? formatDate(customer.lastPayment) : "No payments yet"}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500">Outstanding Amount:</span>
            <div className={`font-medium mt-1 ${customer.outstandingAmount > 0 ? "text-red-600" : "text-green-600"}`}>
              {customer.outstandingAmount > 0 ? formatCurrency(customer.outstandingAmount) : "Paid"}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500">Next Due Date:</span>
            <div className="font-medium mt-1">
              {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
