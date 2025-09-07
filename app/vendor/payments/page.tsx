"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Download, Search, FileText, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Settlement {
  id: string
  period: string
  totalSales: number
  commission: number
  netAmount: number
  status: "pending" | "paid" | "processing"
  dueDate: string
  paidDate?: string
  transactionId?: string
}

interface PaymentHistory {
  id: string
  orderId: string
  amount: number
  commission: number
  netAmount: number
  paymentDate: string
  status: "completed" | "pending" | "failed"
  paymentMethod: string
}

const settlements: Settlement[] = [
  {
    id: "SET001",
    period: "January 2024",
    totalSales: 185000,
    commission: 9250,
    netAmount: 175750,
    status: "pending",
    dueDate: "2024-02-05",
  },
  {
    id: "SET002",
    period: "December 2023",
    totalSales: 165000,
    commission: 8250,
    netAmount: 156750,
    status: "paid",
    dueDate: "2024-01-05",
    paidDate: "2024-01-03",
    transactionId: "TXN123456789",
  },
  {
    id: "SET003",
    period: "November 2023",
    totalSales: 142000,
    commission: 7100,
    netAmount: 134900,
    status: "paid",
    dueDate: "2023-12-05",
    paidDate: "2023-12-02",
    transactionId: "TXN987654321",
  },
]

const paymentHistory: PaymentHistory[] = [
  {
    id: "PAY001",
    orderId: "ORD-2024-001",
    amount: 85000,
    commission: 4250,
    netAmount: 80750,
    paymentDate: "2024-01-25",
    status: "completed",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "PAY002",
    orderId: "ORD-2024-002",
    amount: 45000,
    commission: 2250,
    netAmount: 42750,
    paymentDate: "2024-01-24",
    status: "completed",
    paymentMethod: "UPI",
  },
  {
    id: "PAY003",
    orderId: "ORD-2024-003",
    amount: 125000,
    commission: 6250,
    netAmount: 118750,
    paymentDate: "2024-01-23",
    status: "pending",
    paymentMethod: "Bank Transfer",
  },
]

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const getSettlementStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalPendingAmount = settlements.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.netAmount, 0)

  const totalPaidAmount = settlements.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.netAmount, 0)

  const totalCommission = settlements.reduce((sum, s) => sum + s.commission, 0)

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Settlement</h1>
          <p className="text-gray-600">Track your payments, settlements, and financial reports</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Paid</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalPaidAmount)}</div>
            <p className="text-xs text-green-600 mt-1">Settled payments</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending Amount</CardTitle>
            <div className="p-2 bg-yellow-500 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalPendingAmount)}</div>
            <p className="text-xs text-yellow-600 mt-1">Awaiting settlement</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Commission</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalCommission)}</div>
            <p className="text-xs text-blue-600 mt-1">Platform fees</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Commission Rate</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">5.0%</div>
            <p className="text-xs text-purple-600 mt-1">Current rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settlements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settlements">Settlement Reports</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="settlements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Settlement Reports
              </CardTitle>
              <CardDescription>Monthly settlement reports and payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search settlements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Settlement ID</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settlements.map((settlement) => (
                      <TableRow key={settlement.id}>
                        <TableCell className="font-medium">{settlement.id}</TableCell>
                        <TableCell>{settlement.period}</TableCell>
                        <TableCell>{formatCurrency(settlement.totalSales)}</TableCell>
                        <TableCell className="text-red-600">-{formatCurrency(settlement.commission)}</TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(settlement.netAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSettlementStatusColor(settlement.status)}>{settlement.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(settlement.dueDate)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
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

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                Payment History
              </CardTitle>
              <CardDescription>Individual payment transactions and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Search payments..." className="pl-10" />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.orderId}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell className="text-red-600">-{formatCurrency(payment.commission)}</TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(payment.netAmount)}
                        </TableCell>
                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(payment.status)}>{payment.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Settlements</CardTitle>
            <CardDescription>Payments due for settlement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settlements
                .filter((s) => s.status === "pending")
                .map((settlement) => (
                  <div key={settlement.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{settlement.period}</h4>
                        <p className="text-sm text-gray-600">Settlement ID: {settlement.id}</p>
                      </div>
                      <Badge className={getSettlementStatusColor(settlement.status)}>{settlement.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total Sales</p>
                        <p className="font-medium">{formatCurrency(settlement.totalSales)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Net Amount</p>
                        <p className="font-medium text-green-600">{formatCurrency(settlement.netAmount)}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">Due Date: {formatDate(settlement.dueDate)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Configure your payment preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bank Transfer</p>
                      <p className="text-sm text-gray-600">Primary payment method</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p>Account: ****1234</p>
                  <p>Bank: State Bank of India</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">UPI</p>
                      <p className="text-sm text-gray-600">Alternative payment method</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm">
                    Setup UPI
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Payment Schedule</h4>
                <div className="text-sm text-blue-700">
                  <p>• Settlements are processed monthly</p>
                  <p>• Payments are made within 5 business days</p>
                  <p>• Commission rate: 5.0%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
