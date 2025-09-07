"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface AddOperatorFormProps {
  onClose: () => void
  onSuccess?: () => void   // ✅ added
}

export default function AddOperatorForm({ onClose, onSuccess }: AddOperatorFormProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: { state: "", district: "", area: "" },
    gstNumber: "",
    businessType: "individual",
    technicianCount: 0,
    customerCount: 0,
    serviceCapacity: { connections: 0, olts: 0 },
    planAssigned: "monthly",
    dashboardPermissions: {
      inventory: true,
      staffCount: true,
      billing: true,
    },
    apiAccess: {
      whatsapp: false,
      paymentGateway: false,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(`Operator ${formData.companyName} created successfully!`)
    console.log("Form submitted:", formData)

    // ✅ trigger success callback if provided
    if (onSuccess) {
      onSuccess()
    }

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="ownerName">Owner/Manager Name *</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
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
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.address.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={formData.address.district}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, district: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="area">Area</Label>
            <Input
              id="area"
              value={formData.address.area}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, area: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input
              id="gstNumber"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="businessType">Business Type</Label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => setFormData({ ...formData, businessType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="planAssigned">Plan Assigned</Label>
            <Select
              value={formData.planAssigned}
              onValueChange={(value) => setFormData({ ...formData, planAssigned: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="free_trial">Free Trial</SelectItem>
                <SelectItem value="custom">Custom Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Service Capacity */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Service Capacity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="connections">Max Connections</Label>
            <Input
              id="connections"
              type="number"
              value={formData.serviceCapacity.connections}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  serviceCapacity: { ...formData.serviceCapacity, connections: Number.parseInt(e.target.value) || 0 },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="olts">Number of OLTs</Label>
            <Input
              id="olts"
              type="number"
              value={formData.serviceCapacity.olts}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  serviceCapacity: { ...formData.serviceCapacity, olts: Number.parseInt(e.target.value) || 0 },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Dashboard Permissions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="inventory">Inventory Management</Label>
              <p className="text-sm text-gray-500">Allow access to inventory module</p>
            </div>
            <Switch
              id="inventory"
              checked={formData.dashboardPermissions.inventory}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  dashboardPermissions: { ...formData.dashboardPermissions, inventory: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="billing">Billing Access</Label>
              <p className="text-sm text-gray-500">Allow access to billing and payments</p>
            </div>
            <Switch
              id="billing"
              checked={formData.dashboardPermissions.billing}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  dashboardPermissions: { ...formData.dashboardPermissions, billing: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* API Access */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">API Access</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="whatsapp">WhatsApp Integration</Label>
              <p className="text-sm text-gray-500">Enable WhatsApp messaging features</p>
            </div>
            <Switch
              id="whatsapp"
              checked={formData.apiAccess.whatsapp}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  apiAccess: { ...formData.apiAccess, whatsapp: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="paymentGateway">Payment Gateway</Label>
              <p className="text-sm text-gray-500">Enable online payment processing</p>
            </div>
            <Switch
              id="paymentGateway"
              checked={formData.apiAccess.paymentGateway}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  apiAccess: { ...formData.apiAccess, paymentGateway: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="w-full sm:w-auto bg-transparent"
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          Create Operator
        </Button>
      </div>
    </form>
  )
}
