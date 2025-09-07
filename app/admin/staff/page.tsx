"use client"

import type React from "react"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Users,
  Phone,
  Eye,
  Edit,
  Trash2,
  Download,
  UserPlus,
  Activity,
  Shield,
  Mail,
  Plus,
  Filter,
  RefreshCw,
} from "lucide-react"
import { formatDate, getStatusColor, exportToCSV } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { staffApi } from "@/lib/api"
import type { User } from "@/lib/api"

type Staff = User

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false)
  const [showEditStaffDialog, setShowEditStaffDialog] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [activeTab, setActiveTab] = useState("staff")
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchStaffData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching staff data from API...")

      const staffData = await staffApi.getAll()
      console.log("[v0] Staff data fetched:", staffData.length)

      setStaff(staffData)
    } catch (error) {
      console.error("[v0] Error fetching staff data:", error)
      toast({
        title: "Error Loading Data",
        description: "Failed to load staff data. Please try again.",
        variant: "destructive",
      })
      setStaff([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffData()
  }, [])

  const filteredStaff = staff.filter((staffMember) => {
    const matchesSearch =
      staffMember.profileDetail.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || staffMember.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleExport = () => {
    const exportData = filteredStaff.map((staffMember) => ({
      Name: staffMember.profileDetail.name,
      Email: staffMember.email,
      Role: staffMember.role,
      Phone: staffMember.profileDetail.phone,
      "Assigned To": staffMember.profileDetail.assignedTo || "N/A",
      "Created Date": formatDate(staffMember.createdAt),
      "Updated Date": formatDate(staffMember.updatedAt),
    }))
    exportToCSV(exportData, "admin-staff")
    toast({
      title: "Export Successful",
      description: "Admin staff data exported successfully!",
    })
  }

  const handleViewStaff = (staffId: string) => {
    toast({
      title: "View Staff",
      description: `Viewing staff details for ID: ${staffId}`,
    })
  }

  const handleEditStaff = (staffId: string) => {
    const staffMember = staff.find((s) => s.user_id === staffId)
    if (staffMember) {
      setEditingStaff(staffMember)
      setShowEditStaffDialog(true)
    }
  }

  const handleDeleteStaff = async (staffMember: Staff) => {
    try {
      console.log("[v0] Deleting staff member:", staffMember.user_id)
      
      // Use the staff API to delete staff members (not admin API)
      await staffApi.delete(staffMember.user_id)

      toast({
        title: "Staff Deleted",
        description: `${staffMember.profileDetail.name} has been deleted successfully.`,
      })

      // Refresh the data
      fetchStaffData()
    } catch (error) {
      console.error("[v0] Error deleting staff:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete staff member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddStaffSuccess = () => {
    setShowAddStaffDialog(false)
    fetchStaffData()
    toast({
      title: "Staff Added",
      description: "New staff member has been added successfully!",
    })
  }

  const totalStaff = staff.length
  const activeStaff = staff.length

  return (
    <DashboardLayout title="Admin Settings" description="System configuration and user management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Staff</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalStaff}</div>
              <p className="text-sm text-gray-500 mt-2">{activeStaff} active users</p>
            </CardContent>
          </Card>

          {/* Other stat cards remain the same... */}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="staff">Admin Staff</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={fetchStaffData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="flex-1 sm:flex-none bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {activeTab === "staff" ? (
                <>
                  <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Staff
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Admin Staff</DialogTitle>
                        <DialogDescription>Create a new admin user account</DialogDescription>
                      </DialogHeader>
                      <AddStaffForm onClose={() => setShowAddStaffDialog(false)} onSuccess={handleAddStaffSuccess} />
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showEditStaffDialog} onOpenChange={setShowEditStaffDialog}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Staff Member</DialogTitle>
                        <DialogDescription>Update staff member information</DialogDescription>
                      </DialogHeader>
                      {editingStaff && (
                        <EditStaffForm
                          staff={editingStaff}
                          onClose={() => setShowEditStaffDialog(false)}
                          onSuccess={() => {
                            setShowEditStaffDialog(false)
                            fetchStaffData()
                            toast({
                              title: "Staff Updated",
                              description: "Staff member has been updated successfully!",
                            })
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <Button variant="outline" className="flex-1 sm:flex-none" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role (Coming Soon)
                </Button>
              )}
            </div>
          </div>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Admin Staff ({filteredStaff.length})</CardTitle>
                <CardDescription>Manage administrative users and their access</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading staff data...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Staff Details</TableHead>
                          <TableHead className="min-w-[150px]">Contact</TableHead>
                          <TableHead className="min-w-[150px]">Role & Assignment</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                          <TableHead className="min-w-[150px]">Created Date</TableHead>
                          <TableHead className="min-w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStaff.map((staffMember) => (
                          <TableRow key={staffMember.user_id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{staffMember.profileDetail.name}</div>
                                  <div className="text-sm text-gray-500">ID: {staffMember.user_id.slice(0, 8)}</div>
                                  <div className="text-xs text-gray-400">
                                    Joined: {formatDate(staffMember.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {staffMember.profileDetail.phone}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="h-3 w-3 mr-1" />
                                  <span className="truncate max-w-[150px]">{staffMember.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <Badge variant="outline" className="capitalize mb-1">
                                  {staffMember.role}
                                </Badge>
                                <div className="text-sm text-gray-500">
                                  {staffMember.profileDetail.assignedTo || "Unassigned"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">{formatDate(staffMember.createdAt)}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewStaff(staffMember.user_id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditStaff(staffMember.user_id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteStaff(staffMember)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredStaff.length === 0 && !loading && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                              No staff members found. {searchTerm && "Try adjusting your search terms."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab - Disabled for now since it's not integrated with API */}
          <TabsContent value="roles" className="space-y-6">
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Roles & Permissions</h3>
              <p className="text-gray-500 mt-2">This feature is coming soon.</p>
              <p className="text-sm text-gray-400 mt-1">Role management will be available in the next update.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function AddStaffForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    assignedTo: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Adding new staff member:", formData.name)

      await staffApi.add({
        email: formData.email,
        password: formData.password,
        profileDetail: {
          name: formData.name,
          phone: formData.phone,
          assignedTo: formData.assignedTo,
        },
      })

      console.log("[v0] Staff member added successfully")
      onSuccess()
    } catch (error) {
      console.error("[v0] Error adding staff member:", error)
      toast({
        title: "Add Failed",
        description: "Failed to add staff member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="Operator ID or assignment"
            disabled={loading}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            disabled={loading}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Staff Member"}
        </Button>
      </div>
    </form>
  )
}

function EditStaffForm({ staff, onClose, onSuccess }: { staff: Staff; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: staff.profileDetail.name || "",
    email: staff.email || "",
    phone: staff.profileDetail.phone || "",
    assignedTo: staff.profileDetail.assignedTo || "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      console.log("[v0] Updating staff member:", staff.user_id)

      const updateData = {
        email: formData.email,
        profileDetail: {
          name: formData.name,
          phone: formData.phone,
          assignedTo: formData.assignedTo,
        },
      }

      // Use staff API for staff members
      await staffApi.update(staff.user_id, updateData)

      console.log("[v0] Staff member updated successfully")
      onSuccess()
    } catch (error) {
      console.error("[v0] Error updating staff member:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update staff member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">Full Name *</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="edit-email">Email *</Label>
          <Input
            id="edit-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-phone">Phone Number</Label>
          <Input
            id="edit-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="edit-assignedTo">Assigned To</Label>
          <Input
            id="edit-assignedTo"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="Operator ID or assignment"
            disabled={loading}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Staff Member"}
        </Button>
      </div>
    </form>
  )
}