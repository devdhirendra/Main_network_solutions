"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck,
  Star,
  BarChart3,
  Gift,
  Plus,
  Upload,
  Settings,
  Search,
  Download,
  Edit,
  Trash2,
  CreditCard,
  FileText,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface VendorStats {
  totalProducts: number
  activeProducts: number
  totalOrders: number
  pendingOrders: number
  deliveredOrders: number
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  averageRating: number
  totalReviews: number
  lowStockItems: number
  paymentDue: number
}

interface RecentOrder {
  id: string
  operator: string
  items: string
  quantity: number
  amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  deliveryDate?: string
  trackingId?: string
}

interface ProductPerformance {
  name: string
  category: string
  sold: number
  revenue: number
  stock: number
  rating: number
  price: number
  id: string
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description: string
  images: string[]
  specifications: string
  warranty: string
  discount: number
  status: "active" | "inactive" | "pending"
  createdDate: string
}

interface Promotion {
  id: string
  title: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  validFrom: string
  validTo: string
  applicableProducts: string[]
  status: "active" | "inactive" | "expired"
}

interface Settlement {
  id: string
  period: string
  totalSales: number
  commission: number
  netAmount: number
  status: "pending" | "paid" | "processing"
  dueDate: string
  paidDate?: string
}

const products: Product[] = [
  {
    id: "PRD001",
    name: "TP-Link AC1200 Router",
    category: "Routers",
    price: 3500,
    stock: 23,
    description: "High-performance dual-band wireless router with advanced security features",
    images: ["/wireless-router-setup.png"],
    specifications: "AC1200, Dual Band, 4 Ethernet Ports, WPA3 Security",
    warranty: "2 years manufacturer warranty",
    discount: 10,
    status: "active",
    createdDate: "2024-01-15",
  },
  {
    id: "PRD002",
    name: "Fiber Optic Cable 2km",
    category: "Cables",
    price: 2800,
    stock: 15,
    description: "Premium quality single-mode fiber optic cable for long-distance connections",
    images: ["/fiber-cable.png"],
    specifications: "Single Mode, 9/125μm, LSZH Jacket, 2km Length",
    warranty: "5 years warranty",
    discount: 5,
    status: "active",
    createdDate: "2024-01-10",
  },
]

const promotions: Promotion[] = [
  {
    id: "PROMO001",
    title: "New Year Special",
    description: "Get 20% off on all router products",
    discountType: "percentage",
    discountValue: 20,
    validFrom: "2024-01-01",
    validTo: "2024-01-31",
    applicableProducts: ["Routers"],
    status: "active",
  },
  {
    id: "PROMO002",
    title: "Bulk Order Discount",
    description: "₹500 off on orders above ₹10,000",
    discountType: "fixed",
    discountValue: 500,
    validFrom: "2024-01-15",
    validTo: "2024-02-15",
    applicableProducts: ["all"],
    status: "active",
  },
]

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
  },
]

// Demo data
const fallbackStats: VendorStats = {
  totalProducts: 156,
  activeProducts: 142,
  totalOrders: 89,
  pendingOrders: 12,
  deliveredOrders: 67,
  totalRevenue: 2450000,
  monthlyRevenue: 185000,
  revenueGrowth: 15.3,
  averageRating: 4.6,
  totalReviews: 234,
  lowStockItems: 8,
  paymentDue: 125000,
}

const demoOrders: RecentOrder[] = [
  {
    id: "ORD-2024-001",
    operator: "City Networks",
    items: "TP-Link Routers, ONU Devices",
    quantity: 30,
    amount: 85000,
    status: "pending",
    orderDate: "2024-01-24",
  },
  {
    id: "ORD-2024-002",
    operator: "Metro Fiber",
    items: "Fiber Cable, Connectors",
    quantity: 200,
    amount: 45000,
    status: "shipped",
    orderDate: "2024-01-23",
    deliveryDate: "2024-01-26",
    trackingId: "TRK123456789",
  },
  {
    id: "ORD-2024-003",
    operator: "Speed Net ISP",
    items: "POE Switch, Testing Kit",
    quantity: 7,
    amount: 125000,
    status: "delivered",
    orderDate: "2024-01-22",
    deliveryDate: "2024-01-24",
    trackingId: "TRK987654321",
  },
  {
    id: "ORD-2024-004",
    operator: "Digital Connect",
    items: "Patch Cords, Splitters",
    quantity: 150,
    amount: 32000,
    status: "confirmed",
    orderDate: "2024-01-21",
  },
]

const topProducts: ProductPerformance[] = [
  {
    id: "PRD001",
    name: "TP-Link AC1200 Router",
    category: "Routers",
    sold: 45,
    revenue: 135000,
    stock: 23,
    rating: 4.8,
    price: 3500,
  },
  {
    id: "PRD002",
    name: "Fiber Optic Cable 2km",
    category: "Cables",
    sold: 32,
    revenue: 96000,
    stock: 15,
    rating: 4.6,
    price: 2800,
  },
  {
    id: "PRD003",
    name: "GPON ONU Device",
    category: "ONUs",
    sold: 28,
    revenue: 84000,
    stock: 8,
    rating: 4.7,
    price: 4200,
  },
  {
    id: "PRD004",
    name: "24-Port POE Switch",
    category: "Switches",
    sold: 18,
    revenue: 108000,
    stock: 12,
    rating: 4.5,
    price: 8500,
  },
  {
    id: "PRD005",
    name: "Fiber Splicing Kit",
    category: "Tools",
    sold: 15,
    revenue: 75000,
    stock: 5,
    rating: 4.9,
    price: 12000,
  },
]

export default function VendorDashboardPage() {
  const [vendorStats, setVendorStats] = useState<VendorStats>(fallbackStats)
  const [orders, setOrders] = useState<RecentOrder[]>(demoOrders)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [priceRange, setPriceRange] = useState([1000, 10000])
  const [discountRange, setDiscountRange] = useState([5])
  const [commissionRange, setCommissionRange] = useState([5])
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Routers",
    price: "",
    stock: "",
    description: "",
    specifications: "",
    warranty: "",
    discount: "",
  })
  const [newPromotion, setNewPromotion] = useState({
    title: "",
    description: "",
    discountType: "percentage" as const,
    discountValue: "",
    validFrom: "",
    validTo: "",
    applicableProducts: "all",
  })

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStockStatusColor = (stock: number) => {
    if (stock <= 5) return "text-red-600"
    if (stock <= 15) return "text-yellow-600"
    return "text-green-600"
  }

  const getPromotionStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const handleCreateProduct = () => {
    const product = {
      ...newProduct,
      id: `PRD${String(products.length + 1).padStart(3, "0")}`,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock),
      discount: Number.parseFloat(newProduct.discount),
      images: ["/diverse-products-still-life.png"],
      status: "active" as const,
      createdDate: new Date().toISOString().split("T")[0],
    }

    console.log("Creating product:", product)
    setNewProduct({
      name: "",
      category: "Routers",
      price: "",
      stock: "",
      description: "",
      specifications: "",
      warranty: "",
      discount: "",
    })
    setIsProductDialogOpen(false)
    toast({
      title: "Product Created",
      description: `${product.name} has been added to your catalog.`,
    })
  }

  const handleCreatePromotion = () => {
    const promotion = {
      ...newPromotion,
      id: `PROMO${String(promotions.length + 1).padStart(3, "0")}`,
      discountValue: Number.parseFloat(newPromotion.discountValue),
      status: "active" as const,
    }

    console.log("Creating promotion:", promotion)
    setNewPromotion({
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      validFrom: "",
      validTo: "",
      applicableProducts: "all",
    })
    setIsPromotionDialogOpen(false)
    toast({
      title: "Promotion Created",
      description: `${promotion.title} has been activated.`,
    })
  }

  const handleOrderAction = (orderId: string, action: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        let newStatus = order.status
        if (action === "accept") newStatus = "confirmed"
        if (action === "ship") newStatus = "shipped"
        if (action === "reject") newStatus = "cancelled"

        return {
          ...order,
          status: newStatus as any,
          trackingId: action === "ship" ? `TRK${Date.now()}` : order.trackingId,
        }
      }
      return order
    })

    setOrders(updatedOrders)
    toast({
      title: "Order Updated",
      description: `Order ${orderId} has been ${action}ed successfully.`,
    })
  }

  const filteredProducts = topProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  const refreshData = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Loading dashboard data...</span>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Products</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{vendorStats.totalProducts}</div>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">{vendorStats.activeProducts} active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Orders</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{vendorStats.totalOrders}</div>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 text-yellow-600 mr-1" />
              <span className="text-sm text-yellow-600 font-medium">{vendorStats.pendingOrders} pending</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(vendorStats.totalRevenue)}</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">+{vendorStats.revenueGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Customer Rating</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Star className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{vendorStats.averageRating}/5.0}</div>
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-yellow-600 mr-1" />
              <span className="text-sm text-gray-600 font-medium">{vendorStats.totalReviews} reviews</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            E-commerce Management & Pricing
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Settings
            </Button>
          </CardTitle>
          <CardDescription>
            Use sliders to manage pricing, discounts, and commission rates for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Product Price Range (₹)</Label>
                <div className="mt-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={20000}
                    min={500}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>₹500</span>
                    <span className="font-medium text-green-600">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </span>
                    <span>₹20,000</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Filter products by price range for better inventory management
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Default Discount Rate (%)</Label>
                <div className="mt-3">
                  <Slider
                    value={discountRange}
                    onValueChange={setDiscountRange}
                    max={50}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>0%</span>
                    <span className="font-medium text-green-600">{discountRange[0]}%</span>
                    <span>50%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Set default discount rates for new promotions and bulk orders
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Commission Rate (%)</Label>
                <div className="mt-3">
                  <Slider
                    value={commissionRange}
                    onValueChange={setCommissionRange}
                    max={15}
                    min={2}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>2%</span>
                    <span className="font-medium text-green-600">{commissionRange[0]}%</span>
                    <span>15%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Platform commission rate for sales and settlements</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Pricing Strategy</h4>
                <p className="text-sm text-gray-600">
                  Products in ₹{priceRange[0]}-₹{priceRange[1]} range with {discountRange[0]}% discount,{" "}
                  {commissionRange[0]}% commission
                </p>
              </div>
              <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                Apply Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(vendorStats.monthlyRevenue)}</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delivered Orders</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{vendorStats.deliveredOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{vendorStats.lowStockItems}</div>
            <p className="text-xs text-gray-500 mt-1">Requires restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Payment Due</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(vendorStats.paymentDue)}</div>
            <p className="text-xs text-gray-500 mt-1">Pending settlement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-green-600" />
                  Product Management
                </CardTitle>
                <CardDescription>Manage your product catalog and inventory</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>Create a new product listing for your marketplace</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="productName">Product Name</Label>
                          <Input
                            id="productName"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Enter product name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Routers">Routers</SelectItem>
                              <SelectItem value="Cables">OFC Cables</SelectItem>
                              <SelectItem value="ONUs">ONUs</SelectItem>
                              <SelectItem value="Switches">Switches</SelectItem>
                              <SelectItem value="Tools">Splicing Tools</SelectItem>
                              <SelectItem value="Accessories">Patch Cords & Splitters</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price (₹)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="3500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stock">Stock Quantity</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            placeholder="50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discount">Discount (%)</Label>
                          <Input
                            id="discount"
                            type="number"
                            value={newProduct.discount}
                            onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                            placeholder="10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          placeholder="Detailed product description"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specifications">Specifications</Label>
                        <Textarea
                          id="specifications"
                          value={newProduct.specifications}
                          onChange={(e) => setNewProduct({ ...newProduct, specifications: e.target.value })}
                          placeholder="Technical specifications"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="warranty">Warranty</Label>
                        <Input
                          id="warranty"
                          value={newProduct.warranty}
                          onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
                          placeholder="2 years manufacturer warranty"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Product Images</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateProduct} className="bg-green-600 hover:bg-green-700">
                        Create Product
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Routers">Routers</SelectItem>
                    <SelectItem value="Cables">Cables</SelectItem>
                    <SelectItem value="ONUs">ONUs</SelectItem>
                    <SelectItem value="Switches">Switches</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Sold</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getStockStatusColor(product.stock)}`}>{product.stock}</span>
                      </TableCell>
                      <TableCell>{product.sold}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="h-5 w-5 mr-2 text-purple-600" />
              Promotions & Offers
            </CardTitle>
            <CardDescription>Manage discounts and special offers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Promotion
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Promotion</DialogTitle>
                    <DialogDescription>Set up a new discount or special offer</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="promoTitle">Promotion Title</Label>
                      <Input
                        id="promoTitle"
                        value={newPromotion.title}
                        onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                        placeholder="Valentine's Special"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promoDescription">Description</Label>
                      <Textarea
                        id="promoDescription"
                        value={newPromotion.description}
                        onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                        placeholder="Get 20% off on all router products"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="discountType">Discount Type</Label>
                        <Select
                          value={newPromotion.discountType}
                          onValueChange={(value) => setNewPromotion({ ...newPromotion, discountType: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discountValue">Discount Value</Label>
                        <Input
                          id="discountValue"
                          type="number"
                          value={newPromotion.discountValue}
                          onChange={(e) => setNewPromotion({ ...newPromotion, discountValue: e.target.value })}
                          placeholder="20"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="validFrom">Valid From</Label>
                        <Input
                          id="validFrom"
                          type="date"
                          value={newPromotion.validFrom}
                          onChange={(e) => setNewPromotion({ ...newPromotion, validFrom: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="validTo">Valid To</Label>
                        <Input
                          id="validTo"
                          type="date"
                          value={newPromotion.validTo}
                          onChange={(e) => setNewPromotion({ ...newPromotion, validTo: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="applicableProducts">Applicable Products</Label>
                      <Select
                        value={newPromotion.applicableProducts}
                        onValueChange={(value) => setNewPromotion({ ...newPromotion, applicableProducts: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="Routers">Routers Only</SelectItem>
                          <SelectItem value="Cables">Cables Only</SelectItem>
                          <SelectItem value="ONUs">ONUs Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePromotion} className="bg-purple-600 hover:bg-purple-700">
                      Create Promotion
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {promotions.map((promotion) => (
                <div key={promotion.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{promotion.title}</h4>
                      <p className="text-sm text-gray-600">{promotion.description}</p>
                    </div>
                    <Badge className={getPromotionStatusColor(promotion.status)}>{promotion.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-gray-500">
                      {promotion.discountType === "percentage"
                        ? `${promotion.discountValue}%`
                        : `₹${promotion.discountValue}`}{" "}
                      off
                    </div>
                    <div className="text-xs text-gray-500">
                      {promotion.validFrom} to {promotion.validTo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                Order Management
              </CardTitle>
              <CardDescription>Track and manage incoming orders</CardDescription>
            </div>
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>All Orders</DialogTitle>
                  <DialogDescription>Complete order history and management</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pending" className="space-y-4">
                    {orders
                      .filter((order) => order.status === "pending")
                      .map((order) => (
                        <div key={order.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{order.id}</h4>
                              <p className="text-sm text-gray-600">{order.operator}</p>
                              <p className="text-sm text-gray-500">{order.items}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                              <p className="text-sm text-gray-500">{order.quantity} items</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleOrderAction(order.id, "accept")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleOrderAction(order.id, "reject")}>
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{order.id}</h4>
                    <p className="text-sm text-gray-600">{order.operator}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                    <Badge className={getOrderStatusColor(order.status)} size="sm">
                      {order.status}
                    </Badge>
                    {order.status === "pending" && (
                      <div className="flex space-x-1 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleOrderAction(order.id, "accept")}
                          className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOrderAction(order.id, "reject")}
                          className="text-xs px-2 py-1"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {order.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() => handleOrderAction(order.id, "ship")}
                        className="bg-purple-600 hover:bg-purple-700 text-xs px-2 py-1 mt-2"
                      >
                        Mark as Shipped
                      </Button>
                    )}
                    {order.trackingId && <p className="text-xs text-gray-500 mt-1">Tracking: {order.trackingId}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-green-600" />
              Payment & Settlement
            </CardTitle>
            <CardDescription>Track payments and settlement reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settlements.map((settlement) => (
                <div key={settlement.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{settlement.period}</h4>
                      <p className="text-sm text-gray-600">Total Sales: {formatCurrency(settlement.totalSales)}</p>
                      <p className="text-sm text-gray-500">Commission: {formatCurrency(settlement.commission)}</p>
                    </div>
                    <Badge className={getSettlementStatusColor(settlement.status)}>{settlement.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Net Amount: {formatCurrency(settlement.netAmount)}</p>
                      <p className="text-xs text-gray-500">
                        Due: {settlement.dueDate}
                        {settlement.paidDate && ` | Paid: ${settlement.paidDate}`}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(vendorStats.paymentDue)}</p>
                    <p className="text-sm text-gray-500">Pending Payment</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{commissionRange[0]}%</p>
                    <p className="text-sm text-gray-500">Commission Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Your best-selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                      <span className="text-sm font-medium text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">{product.sold} sold</span>
                      <span className={`font-medium ${getStockStatusColor(product.stock)}`}>{product.stock} left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>Performance metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Order Fulfillment Rate</span>
                  <span className="text-sm text-gray-600">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                  <span className="text-sm text-gray-600">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">On-time Delivery</span>
                  <span className="text-sm text-gray-600">89%</span>
                </div>
                <Progress value={89} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Return Rate</span>
                  <span className="text-sm text-gray-600">3%</span>
                </div>
                <Progress value={3} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">₹1.2M</p>
                    <p className="text-sm text-gray-500">This Quarter</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">15.3%</p>
                    <p className="text-sm text-gray-500">Growth Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used vendor actions and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Plus className="h-6 w-6" />
              <span className="text-sm">Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm">View Orders</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Package className="h-6 w-6" />
              <span className="text-sm">Manage Inventory</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Gift className="h-6 w-6" />
              <span className="text-sm">Create Promotion</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Payment Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Sales Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
