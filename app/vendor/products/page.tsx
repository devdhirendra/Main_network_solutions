"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Package, Plus, Search, Edit, Trash2, Eye, Star } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description: string
  specifications: string
  warranty: string
  discount: number
  status: "active" | "inactive" | "pending"
  rating: number
  sold: number
  createdDate: string
}

const products: Product[] = [
  {
    id: "PRD001",
    name: "TP-Link AC1200 Router",
    category: "Routers",
    price: 3500,
    stock: 23,
    description: "High-performance dual-band wireless router with advanced security features",
    specifications: "AC1200, Dual Band, 4 Ethernet Ports, WPA3 Security",
    warranty: "2 years manufacturer warranty",
    discount: 10,
    status: "active",
    rating: 4.8,
    sold: 45,
    createdDate: "2024-01-15",
  },
  {
    id: "PRD002",
    name: "Fiber Optic Cable 2km",
    category: "Cables",
    price: 2800,
    stock: 15,
    description: "Premium quality single-mode fiber optic cable for long-distance connections",
    specifications: "Single Mode, 9/125μm, LSZH Jacket, 2km Length",
    warranty: "5 years warranty",
    discount: 5,
    status: "active",
    rating: 4.6,
    sold: 32,
    createdDate: "2024-01-10",
  },
  {
    id: "PRD003",
    name: "GPON ONU Device",
    category: "ONUs",
    price: 4200,
    stock: 8,
    description: "Advanced GPON ONU with high-speed internet connectivity",
    specifications: "GPON, 4 Ethernet Ports, WiFi 6, Voice Support",
    warranty: "3 years warranty",
    discount: 15,
    status: "active",
    rating: 4.7,
    sold: 28,
    createdDate: "2024-01-08",
  },
]

export default function ProductsPage() {
  const [productList, setProductList] = useState<Product[]>(products)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { toast } = useToast()

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

  const filteredProducts = productList.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStockStatusColor = (stock: number) => {
    if (stock <= 5) return "text-red-600"
    if (stock <= 15) return "text-yellow-600"
    return "text-green-600"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddProduct = () => {
    const product: Product = {
      id: `PRD${String(productList.length + 1).padStart(3, "0")}`,
      name: newProduct.name,
      category: newProduct.category,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock),
      description: newProduct.description,
      specifications: newProduct.specifications,
      warranty: newProduct.warranty,
      discount: Number.parseFloat(newProduct.discount),
      status: "active",
      rating: 0,
      sold: 0,
      createdDate: new Date().toISOString().split("T")[0],
    }

    setProductList([...productList, product])
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
    setIsAddDialogOpen(false)
    toast({
      title: "Product Added",
      description: `${product.name} has been added to your catalog.`,
    })
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      specifications: product.specifications,
      warranty: product.warranty,
      discount: product.discount.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!selectedProduct) return

    const updatedProducts = productList.map((product) =>
      product.id === selectedProduct.id
        ? {
            ...product,
            name: newProduct.name,
            category: newProduct.category,
            price: Number.parseFloat(newProduct.price),
            stock: Number.parseInt(newProduct.stock),
            description: newProduct.description,
            specifications: newProduct.specifications,
            warranty: newProduct.warranty,
            discount: Number.parseFloat(newProduct.discount),
          }
        : product,
    )

    setProductList(updatedProducts)
    setIsEditDialogOpen(false)
    setSelectedProduct(null)
    toast({
      title: "Product Updated",
      description: `${newProduct.name} has been updated successfully.`,
    })
  }

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = productList.filter((product) => product.id !== productId)
    setProductList(updatedProducts)
    toast({
      title: "Product Deleted",
      description: "Product has been removed from your catalog.",
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
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
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-green-600" />
            Product Catalog
          </CardTitle>
          <CardDescription>View and manage all your products</CardDescription>
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
                  <TableHead>Status</TableHead>
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
                      <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
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

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editProductName">Product Name</Label>
                <Input
                  id="editProductName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCategory">Category</Label>
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
                <Label htmlFor="editPrice">Price (₹)</Label>
                <Input
                  id="editPrice"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="3500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStock">Stock Quantity</Label>
                <Input
                  id="editStock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDiscount">Discount (%)</Label>
                <Input
                  id="editDiscount"
                  type="number"
                  value={newProduct.discount}
                  onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Detailed product description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSpecifications">Specifications</Label>
              <Textarea
                id="editSpecifications"
                value={newProduct.specifications}
                onChange={(e) => setNewProduct({ ...newProduct, specifications: e.target.value })}
                placeholder="Technical specifications"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editWarranty">Warranty</Label>
              <Input
                id="editWarranty"
                value={newProduct.warranty}
                onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
                placeholder="2 years manufacturer warranty"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} className="bg-green-600 hover:bg-green-700">
              Update Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
