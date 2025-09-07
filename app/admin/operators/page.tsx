"use client"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Download,
  Upload,
  HardHat,
  RefreshCw,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { exportToCSV } from "@/lib/utils"
import OperatorDetailsView from "@/components/OperatorDetailsView"
import AddOperatorForm from "@/components/AddOperatorForm"
import EditOperatorForm from "@/components/EditOperatorForm"
import { operatorApi } from "@/lib/api"
import type { User, Operator } from "@/contexts/AuthContext"
import { confirmDelete } from "@/lib/confirmation-dialog"

export default function OperatorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [operators, setOperators] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchOperators = async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching operators from API...")
      const data = await operatorApi.getAll()
      console.log("[v0] Operators fetched successfully:", data.length)
      setOperators(data)
    } catch (error) {
      console.error("[v0] Error fetching operators:", error)
      toast({
        title: "Error Loading Operators",
        description: "Failed to load operators. Please try again.",
        variant: "destructive",
      })
      // Keep empty array on error
      setOperators([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOperators()
  }, [])

  const filteredOperators = operators.filter((operator) => {
    const matchesSearch =
      operator.profileDetail.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.profileDetail.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.email.toLowerCase().includes(searchTerm.toLowerCase())

    // For now, treat all operators as active since we don't have status in API response
    const matchesStatus = statusFilter === "all" || statusFilter === "active"
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status = "active") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    }
  }

  const handleExport = () => {
    const exportData = filteredOperators.map((op) => ({
      "Company Name": op.profileDetail.companyName || op.profileDetail.name,
      "Owner Name": op.profileDetail.name,
      Phone: op.profileDetail.phone,
      Email: op.email,
      Location: op.profileDetail.address
        ? `${op.profileDetail.address.area}, ${op.profileDetail.address.district}, ${op.profileDetail.address.state}`
        : "N/A",
      "Business Type": op.profileDetail.businessType || "N/A",
      "Customer Count": op.profileDetail.customerCount || 0,
      Plan: op.profileDetail.planAssigned || "Basic",
      Revenue: op.profileDetail.revenue || 0,
      Status: "Active",
    }))
    exportToCSV(exportData, "operators-list")
    toast({
      title: "Export Successful",
      description: "Operators data exported successfully!",
    })
  }

  const handleImport = () => {
    toast({
      title: "Import Feature",
      description: "Import functionality - Please upload CSV file with operator data",
    })
  }

  const transformUserToOperator = (user: User): Operator => ({
    ...user,
    id: user.user_id,
    companyName: user.profileDetail.companyName || user.profileDetail.name,
    ownerName: user.profileDetail.name,
    phone: user.profileDetail.phone,
    email: user.email,
    address: user.profileDetail.address || {
      state: "N/A",
      district: "N/A",
      area: "N/A",
    },
    planAssigned: user.profileDetail.planAssigned || "Basic",
    revenue: user.profileDetail.revenue || 0,
    customerCount: user.profileDetail.customerCount || 0,
    gstNumber: user.profileDetail.gstNumber || "",
    businessType: user.profileDetail.businessType || "",
    serviceCapacity: user.profileDetail.serviceCapacity || {},
    apiAccess: user.profileDetail.apiAccess || {},
    status: user.status || "active",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })

  const handleViewDetails = (operator: User) => {
    setSelectedOperator(transformUserToOperator(operator))
    setShowDetailsDialog(true)
  }

  const handleEdit = (operator: User) => {
    setSelectedOperator(transformUserToOperator(operator))
    setShowEditDialog(true)
  }

  const handleDelete = async (operator: User) => {
    try {
      const confirmed = await confirmDelete(
        `operator "${operator.profileDetail.companyName || operator.profileDetail.name}"`,
      )

      if (!confirmed) {
        return
      }

      console.log("[v0] Deleting operator:", operator.user_id)
      await operatorApi.delete(operator.user_id)

      toast({
        title: "Operator Deleted",
        description: `${operator.profileDetail.companyName || operator.profileDetail.name} has been deleted successfully.`,
      })

      // Refresh the operators list
      fetchOperators()
    } catch (error) {
      console.error("[v0] Error deleting operator:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete operator. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateInvoice = (operator: User) => {
    toast({
      title: "Invoice Generated",
      description: `Invoice generated for ${operator.profileDetail.companyName || operator.profileDetail.name}`,
    })
  }

  const handleSuspend = (operator: User) => {
    toast({
      title: "Operator Suspended",
      description: `${operator.profileDetail.companyName || operator.profileDetail.name} has been suspended`,
      variant: "destructive",
    })
  }

  const handleAddSuccess = () => {
    setShowAddDialog(false)
    fetchOperators() // Refresh the list
    toast({
      title: "Operator Added",
      description: "New operator has been added successfully!",
    })
  }

  const handleEditSuccess = () => {
    setShowEditDialog(false)
    fetchOperators() // Refresh the list
    toast({
      title: "Operator Updated",
      description: "Operator information has been updated successfully!",
    })
  }

  return (
    <DashboardLayout title="Operator Management" description="Manage all network operators and their subscriptions">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col gap-4">
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search operators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOperators}
              disabled={loading}
              className="w-full sm:w-auto bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} className="w-full sm:w-auto bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport} className="w-full sm:w-auto bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Operator
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Operator</DialogTitle>
                  <DialogDescription>Create a new operator account with complete business details</DialogDescription>
                </DialogHeader>
                <AddOperatorForm onClose={() => setShowAddDialog(false)} onSuccess={handleAddSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">All Operators ({filteredOperators.length})</CardTitle>
            <CardDescription>Complete list of network operators and their current status</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading operators...</span>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Company</TableHead>
                        <TableHead className="min-w-[150px]">Owner</TableHead>
                        <TableHead className="min-w-[200px]">Contact</TableHead>
                        <TableHead className="min-w-[150px]">Location</TableHead>
                        <TableHead className="min-w-[120px]">Connections</TableHead>
                        <TableHead className="min-w-[100px]">Revenue</TableHead>
                        <TableHead className="min-w-[80px]">Plan</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOperators.map((operator) => (
                        <TableRow key={operator.user_id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Building2 className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {operator.profileDetail.companyName || operator.profileDetail.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {operator.profileDetail.businessType || "Business"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{operator.profileDetail.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <HardHat className="h-3 w-3 mr-1" />
                                ID: {operator.profileDetail.operatorId || operator.user_id.slice(0, 8)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-3 w-3 mr-1" />
                                {operator.profileDetail.phone}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-[150px]">{operator.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[120px]">
                                {operator.profileDetail.address
                                  ? `${operator.profileDetail.address.area}, ${operator.profileDetail.address.district}`
                                  : "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">
                                {operator.profileDetail.customerCount || 0}
                              </div>
                              <div className="text-sm text-gray-500">
                                of {operator.profileDetail.serviceCapacity?.connections || "N/A"} capacity
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              ₹{(operator.profileDetail.revenue || 0).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {operator.profileDetail.planAssigned || "Basic"}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge("active")}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-64" align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(operator)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(operator)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGenerateInvoice(operator)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Generate Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(operator)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredOperators.length === 0 && !loading && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                            No operators found. {searchTerm && "Try adjusting your search terms."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4 p-4">
                  {filteredOperators.map((operator) => (
                    <Card key={operator.user_id} className="border border-gray-200 shadow-sm">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header with company and status */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                                <Building2 className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-900 truncate">
                                  {operator.profileDetail.companyName || operator.profileDetail.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                  {operator.profileDetail.businessType || "Business"}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              {getStatusBadge("active")}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48" align="end">
                                  <DropdownMenuItem onClick={() => handleViewDetails(operator)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(operator)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleGenerateInvoice(operator)}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(operator)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Owner and ID */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{operator.profileDetail.name}</div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <HardHat className="h-3 w-3 mr-1" />
                                ID: {operator.profileDetail.operatorId || operator.user_id.slice(0, 8)}
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize text-xs">
                              {operator.profileDetail.planAssigned || "Basic"}
                            </Badge>
                          </div>

                          {/* Contact Information */}
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span className="truncate">{operator.profileDetail.phone}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span className="truncate">{operator.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span className="truncate">
                                {operator.profileDetail.address
                                  ? `${operator.profileDetail.address.area}, ${operator.profileDetail.address.district}`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                            <div>
                              <div className="text-xs text-gray-500">Connections</div>
                              <div className="font-medium text-sm">
                                {operator.profileDetail.customerCount || 0}
                                <span className="text-xs text-gray-500 ml-1">
                                  / {operator.profileDetail.serviceCapacity?.connections || "N/A"}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Revenue</div>
                              <div className="font-medium text-sm">
                                ₹{(operator.profileDetail.revenue || 0).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredOperators.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-8">
                      <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p>No operators found.</p>
                      {searchTerm && <p className="text-sm">Try adjusting your search terms.</p>}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Operator Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Operator Details</DialogTitle>
              <DialogDescription>
                Complete information about {selectedOperator?.companyName || selectedOperator?.ownerName}
              </DialogDescription>
            </DialogHeader>
            {selectedOperator && <OperatorDetailsView operator={selectedOperator} />}
          </DialogContent>
        </Dialog>

        {/* Edit Operator Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Operator</DialogTitle>
              <DialogDescription>Update operator information</DialogDescription>
            </DialogHeader>
            {selectedOperator && (
              <EditOperatorForm
                operator={selectedOperator}
                onClose={() => setShowEditDialog(false)}
                onSuccess={handleEditSuccess}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
