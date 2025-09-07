"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import {
  UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  Camera,
  Bell,
  Lock,
  CreditCard,
  Wifi,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CustomerAccountPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+91 98765 43210",
    address: "123 Main Street, Downtown, Mumbai, Maharashtra 400001",
    joinDate: "2023-06-15",
    customerID: "CUST001234",
    plan: "Premium Fiber 100 Mbps",
    status: "Active",
  })
  const [preferences, setPreferences] = useState({
    notifications: [true, false, true],
    dataUsageAlert: [80],
    autoRenewal: true,
    paperlessBilling: true,
  })
  const { toast } = useToast()

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your account information has been successfully updated.",
    })
  }

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Preference Updated",
      description: "Your account preferences have been saved.",
    })
  }

  return (
    <DashboardLayout title="My Account" description="Manage your account information and preferences">
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and contact details</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  >
                    {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" alt={profileData.name} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xl">
                        {profileData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">{profileData.name}</h3>
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-pink-100 text-pink-800">Customer</Badge>
                      <Badge className="bg-green-100 text-green-800">{profileData.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">Customer ID: {profileData.customerID}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Member Since</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="joinDate"
                        value={new Date(profileData.joinDate).toLocaleDateString()}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                    </div>
                    <Button
                      variant={preferences.notifications[0] ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        handlePreferenceChange("notifications", [
                          !preferences.notifications[0],
                          preferences.notifications[1],
                          preferences.notifications[2],
                        ])
                      }
                    >
                      {preferences.notifications[0] ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via SMS</p>
                      </div>
                    </div>
                    <Button
                      variant={preferences.notifications[1] ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        handlePreferenceChange("notifications", [
                          preferences.notifications[0],
                          !preferences.notifications[1],
                          preferences.notifications[2],
                        ])
                      }
                    >
                      {preferences.notifications[1] ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Service Alerts</p>
                        <p className="text-sm text-gray-500">Critical service notifications</p>
                      </div>
                    </div>
                    <Button
                      variant={preferences.notifications[2] ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        handlePreferenceChange("notifications", [
                          preferences.notifications[0],
                          preferences.notifications[1],
                          !preferences.notifications[2],
                        ])
                      }
                    >
                      {preferences.notifications[2] ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Usage Preferences</CardTitle>
                <CardDescription>Set your data usage alert threshold</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Data Usage Alert: {preferences.dataUsageAlert[0]}%</Label>
                  <Slider
                    value={preferences.dataUsageAlert}
                    onValueChange={(value) => handlePreferenceChange("dataUsageAlert", value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    You'll receive an alert when you reach {preferences.dataUsageAlert[0]}% of your monthly data limit
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Preferences</CardTitle>
                <CardDescription>Manage your billing and payment preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Auto Renewal</p>
                      <p className="text-sm text-gray-500">Automatically renew your plan</p>
                    </div>
                  </div>
                  <Button
                    variant={preferences.autoRenewal ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePreferenceChange("autoRenewal", !preferences.autoRenewal)}
                  >
                    {preferences.autoRenewal ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Paperless Billing</p>
                      <p className="text-sm text-gray-500">Receive bills via email</p>
                    </div>
                  </div>
                  <Button
                    variant={preferences.paperlessBilling ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePreferenceChange("paperlessBilling", !preferences.paperlessBilling)}
                  >
                    {preferences.paperlessBilling ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-gray-500">Update your account password</p>
                      </div>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Login Activity</p>
                        <p className="text-sm text-gray-500">View recent login attempts</p>
                      </div>
                    </div>
                    <Button variant="outline">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Manage your current plan and subscription details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-pink-500 rounded-lg">
                      <Wifi className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{profileData.plan}</h3>
                      <p className="text-sm text-gray-500">High-speed fiber internet</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                        <span className="text-sm text-gray-500">Next billing: Jan 15, 2024</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹1,999</p>
                    <p className="text-sm text-gray-500">per month</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-pink-600">100</p>
                    <p className="text-sm text-gray-500">Mbps Speed</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-pink-600">Unlimited</p>
                    <p className="text-sm text-gray-500">Data</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-pink-600">24/7</p>
                    <p className="text-sm text-gray-500">Support</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button className="flex-1">Upgrade Plan</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Change Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
