const API_BASE_URL = "https://nsbackend-silk.vercel.app/api"

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  token?: string
  user_id?: string
}

export interface User {
  user_id: string
  email: string
  role: "admin" | "operator" | "technician" | "vendor" | "customer" | "staff"
  profileDetail: {
    name: string
    phone: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
  Permissions: Record<string, any>
}

export interface LoginResponse {
  token: string
  user_id: string
  role: "admin" | "operator" | "technician" | "vendor" | "customer" | "staff"
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }

        // Handle specific authentication errors
        if (response.status === 401) {
          // Token expired or invalid
          this.clearToken()
          throw new Error("AUTHENTICATION_FAILED")
        } else if (response.status === 403) {
          throw new Error("ACCESS_DENIED")
        } else if (response.status === 404) {
          throw new Error("USER_NOT_FOUND")
        } else if (response.status >= 500) {
          throw new Error("SERVER_ERROR")
        }

        throw new Error(errorData.error || errorData.message || "API request failed")
      }

      const data = await response.json()
      console.log("API Response:", data)
      return data
    } catch (error) {
      console.error("API request error:", error)
      throw error
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.request<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      if (response.token) {
        this.setToken(response.token)
      }

      return {
        token: response.token!,
        user_id: response.user_id!,
        role: response.role!,
      }
    } catch (error) {
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message === "USER_NOT_FOUND") {
          throw new Error("No account found with this email address")
        } else if (error.message === "AUTHENTICATION_FAILED") {
          throw new Error("Invalid email or password")
        } else if (error.message === "SERVER_ERROR") {
          throw new Error("Server is temporarily unavailable. Please try again later.")
        }
      }
      throw error
    }
  }

  async registerAdmin(data: {
    email: string
    password: string
    profileDetail: {
      name: string
      phone: string
    }
  }): Promise<ApiResponse> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        role: "admin",
      }),
    })
  }

  async getAllAdmins(): Promise<User[]> {
    const response = await this.request<User[]>("/admin/all")
    return response.data || (response as User[])
  }

  async addAdmin(data: {
    email: string
    password: string
    profileDetail: {
      name: string
      phone: string
    }
  }): Promise<ApiResponse> {
    return this.request("/admin/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAdmin(userId: string): Promise<User> {
    const response = await this.request<User>(`/admin/profile/${userId}`)
    return response.data || (response as User)
  }

  async updateAdmin(
    userId: string,
    data: {
      email?: string
      password?: string
      profileDetail?: {
        name?: string
        phone?: string
      }
    },
  ): Promise<ApiResponse> {
    return this.request(`/admin/profile/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteAdmin(userId: string): Promise<ApiResponse> {
    return this.request(`/admin/profile/${userId}`, {
      method: "DELETE",
    })
  }

  async getAllOperators(): Promise<User[]> {
    const response = await this.request<User[]>("/admin/operator/all")
    return response.data || (response as User[])
  }

  async addOperator(data: {
    email: string
    password: string
    profileDetail: {
      name: string
      phone: string
      email: string
      companyName: string
      address: {
        state: string
        district: string
        area: string
      }
      planAssigned: string
      customerCount: number
      revenue: number
      gstNumber: string
      businessType: string
      serviceCapacity: {
        connections: number
        olts: number
      }
      apiAccess: {
        whatsapp: boolean
        paymentGateway: boolean
      }
    }
  }): Promise<ApiResponse> {
    return this.request("/admin/operator/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getOperator(userId: string): Promise<User> {
    const response = await this.request<User>(`/admin/operator/${userId}`)
    return response.data || (response as User)
  }

  async getOperatorProfile(userId: string): Promise<User> {
    const response = await this.request<User>(`/operator/profile/${userId}`)
    return response.data || (response as User)
  }

  async updateOperator(userId: string, data: any): Promise<ApiResponse> {
    return this.request(`/admin/operator/profile/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteOperator(userId: string): Promise<ApiResponse> {
    return this.request(`/admin/operator/profile/${userId}`, {
      method: "DELETE",
    })
  }

  async getAllTechnicians(): Promise<User[]> {
    const response = await this.request<User[]>("/admin/technician/all")
    return response.data || (response as User[])
  }

  async addTechnician(data: {
    email: string
    password: string
    profileDetail: {
      name: string
      phone: string
      area: string
      specialization: string
      salary: string
      assignedOperatorId: string
    }
  }): Promise<ApiResponse> {
    return this.request("/admin/technician/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getTechnician(userId: string): Promise<User> {
    const response = await this.request<User>(`/admin/technician/${userId}`)
    return response.data || (response as User)
  }

  async getTechnicianProfile(userId: string): Promise<User> {
    const response = await this.request<User>(`/technician/profile/${userId}`)
    return response.data || (response as User)
  }

  async updateTechnician(userId: string, data: any): Promise<ApiResponse> {
    return this.request(`/admin/technician/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteTechnician(userId: string): Promise<ApiResponse> {
    return this.request(`/admin/technician/${userId}`, {
      method: "DELETE",
    })
  }

  async getAllStaff(): Promise<User[]> {
    const response = await this.request<User[]>("/admin/staff/all")
    return response.data || (response as User[])
  }

  async addStaff(data: {
    email: string
    password: string
    profileDetail: {
      name: string
      phone: string
      assignedTo: string
    }
  }): Promise<ApiResponse> {
    return this.request("/admin/staff/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getStaff(userId: string): Promise<User> {
    const response = await this.request<User>(`/admin/staff/profile/${userId}`)
    return response.data || (response as User)
  }

  async updateStaff(userId: string, data: any): Promise<ApiResponse> {
    return this.request(`/admin/staff/profile/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteStaff(userId: string): Promise<ApiResponse> {
    return this.request(`/admin/staff/profile/${userId}`, {
      method: "DELETE",
    })
  }

  async getStaffProfile(userId: string): Promise<User> {
    const response = await this.request<User>(`/staff/profile/${userId}`)
    return response.data || (response as User)
  }

  async getAllVendors(): Promise<User[]> {
    const response = await this.request<User[]>("/admin/vendor/all")
    return response.data || (response as User[])
  }

  async addVendor(data: {
    email: string
    password: string
    profileDetail: {
      name: string
      phone: string
      companyName: string
      address: {
        state: string
        district: string
        area: string
      }
    }
  }): Promise<ApiResponse> {
    return this.request("/admin/vendor/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getVendor(userId: string): Promise<User> {
    const response = await this.request<User>(`/admin/vendor/${userId}`)
    return response.data || (response as User)
  }

  async updateVendor(userId: string, data: any): Promise<ApiResponse> {
    return this.request(`/admin/vendor/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteVendor(userId: string): Promise<ApiResponse> {
    return this.request(`/admin/vendor/${userId}`, {
      method: "DELETE",
    })
  }

  async getVendorProfile(userId: string): Promise<User> {
    const response = await this.request<User>(`/vendor/profile/${userId}`)
    return response.data || (response as User)
  }

  async getAllCustomers(): Promise<User[]> {
    const response = await this.request<User[]>("/admin/customer/all")
    return response.data || (response as User[])
  }

  async addCustomer(data: {
    email: string
    password: string
    profileDetail: {
      name: string
      phone: string
      address: string
      planId: string
      connectionType: string
      monthlyRate: number
    }
  }): Promise<ApiResponse> {
    return this.request("/admin/customer/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCustomer(userId: string): Promise<User> {
    const response = await this.request<User>(`/admin/customer/profile/${userId}`)
    return response.data || (response as User)
  }

  async updateCustomer(userId: string, data: any): Promise<ApiResponse> {
    return this.request(`/admin/customer/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCustomer(userId: string): Promise<ApiResponse> {
    return this.request(`/admin/customer/${userId}`, {
      method: "DELETE",
    })
  }

  async getCustomerProfile(userId: string): Promise<User> {
    const response = await this.request<User>(`/customer/profile/${userId}`)
    return response.data || (response as User)
  }

  async getAllComplaints(): Promise<any[]> {
    const response = await this.request<any[]>("/admin/complain/all")
    return response.data || (response as any[])
  }

  async addComplaint(data: {
    title: string
    description: string
    priority: "low" | "medium" | "high"
    category: string
    customerId?: string
  }): Promise<ApiResponse> {
    return this.request("/admin/complain/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateComplaint(
    complaintId: string,
    data: {
      status?: string
      priority?: string
      assignedTo?: string
      resolution?: string
    },
  ): Promise<ApiResponse> {
    return this.request(`/admin/complain/${complaintId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteComplaint(complaintId: string): Promise<ApiResponse> {
    return this.request(`/admin/complain/${complaintId}`, {
      method: "DELETE",
    })
  }

  async getVendorProducts(vendorId: string): Promise<any[]> {
    const response = await this.request<any[]>(`/vendor/products/${vendorId}`)
    return response.data || (response as any[])
  }

  async addVendorProduct(data: {
    name: string
    category: string
    price: number
    stock: number
    description: string
    specifications: string
    warranty: string
    discount?: number
  }): Promise<ApiResponse> {
    return this.request("/vendor/products", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateVendorProduct(productId: string, data: any): Promise<ApiResponse> {
    return this.request(`/vendor/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteVendorProduct(productId: string): Promise<ApiResponse> {
    return this.request(`/vendor/products/${productId}`, {
      method: "DELETE",
    })
  }

  async getVendorOrders(vendorId: string): Promise<any[]> {
    const response = await this.request<any[]>(`/vendor/orders/${vendorId}`)
    return response.data || (response as any[])
  }

  async updateOrderStatusVendor(orderId: string, status: string, trackingId?: string): Promise<ApiResponse> {
    return this.request(`/vendor/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, trackingId }),
    })
  }
//   async getMarketplaceProducts(): Promise<any[]> {
//   const response = await this.request<any[]>("/inventory/stock/products");
//   return response.data || (response as any[]);
// }
// async createMarketplaceOrder(data: {
//   productName: string;
//   quantity: number;
//   operatorId: string;
//   vendorId: string;
//   status?: string;
// }): Promise<ApiResponse> {
//   return this.request("/orders", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }

// Get All Orders
// Add these methods to your ApiClient class in api.ts

// Marketplace Products
async getMarketplaceProducts(): Promise<any[]> {
  const response = await this.request<any[]>("/inventory/stock/products");
  return response.data || (response as any[]);
}

// Create Order (fixed)
async createMarketplaceOrder(data: {
  productName: string;
  quantity: number;
  operatorId: string;
  vendorId: string;
  status?: string;
}): Promise<ApiResponse> {
  return this.request("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Get All Orders
async getMarketplaceOrders(): Promise<any[]> {
  const response = await this.request<any[]>("/orders");
  return response.data || (response as any[]);
}

// Update Order
async updateMarketplaceOrder(
  orderId: string, 
  data: {
    status?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    quantity?: number;
  }
): Promise<ApiResponse> {
  return this.request(`/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Add Product
async addMarketplaceProduct(data: {
  itemName: string;
  quantity: number;
  supplier: string;
  unitPrice: number;
  category: string;
  brand: string;
  description: string;
  specification?: string;
  ModelNumber?: string;
  costPrice?: number;
  sellingPrice?: number;
  role: string;
}): Promise<ApiResponse> {
  return this.request("/inventory/stock/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

  // async getMarketplaceProducts(filters?: {
  //   category?: string
  //   minPrice?: number
  //   maxPrice?: number
  //   vendorId?: string
  // }): Promise<any[]> {
  //   const queryParams = new URLSearchParams()
  //   if (filters) {
  //     Object.entries(filters).forEach(([key, value]) => {
  //       if (value !== undefined) {
  //         queryParams.append(key, value.toString())
  //       }
  //     })
  //   }
  //   const endpoint = `/marketplace/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  //   const response = await this.request<any[]>(endpoint)
  //   return response.data || (response as any[])
  // }

  async createOrder(data: {
    vendorId: string
    products: Array<{
      productId: string
      quantity: number
      price: number
    }>
    shippingAddress: string
    paymentMethod: string
  }): Promise<ApiResponse> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAllOrders(): Promise<any[]> {
    const response = await this.request<any[]>("/orders")
    return response.data || (response as any[])
  }

  async getOrder(orderId: string): Promise<any> {
    const response = await this.request(`/orders/${orderId}`)
    return response.data || (response as any)
  }

  async updateOrder(orderId: string, data: any): Promise<ApiResponse> {
    return this.request(`/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteOrder(orderId: string): Promise<ApiResponse> {
    return this.request(`/orders/${orderId}`, {
      method: "DELETE",
    })
  }

  async getNotifications(userId: string): Promise<any[]> {
    const response = await this.request<any[]>(`/notifications/${userId}`)
    return response.data || (response as any[])
  }

  async markNotificationRead(notificationId: string): Promise<ApiResponse> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: "PUT",
    })
  }

  async sendNotification(data: {
    recipientId: string
    title: string
    message: string
    type: string
  }): Promise<ApiResponse> {
    return this.request("/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getBillingHistory(customerId: string): Promise<any[]> {
    const response = await this.request<any[]>(`/billing/history/${customerId}`)
    return response.data || (response as any[])
  }

  async generateInvoice(
    customerId: string,
    data: {
      amount: number
      dueDate: string
      description: string
    },
  ): Promise<ApiResponse> {
    return this.request(`/billing/invoice/${customerId}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async processPayment(data: {
    customerId: string
    amount: number
    paymentMethod: string
    invoiceId?: string
  }): Promise<ApiResponse> {
    return this.request("/billing/payment", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async addStock(data: {
    itemName: string
    quantity: number
    supplier: string
    unitPrice: number
    category: string
  }): Promise<ApiResponse> {
    return this.request("/inventory/operator/add", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async assignStockToTechnician(
    itemId: string,
    data: {
      technicianId: string
      quantity: number
    },
  ): Promise<ApiResponse> {
    return this.request(`/inventory/operator/assign/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async returnItems(
    itemId: string,
    data: {
      quantity: number
    },
  ): Promise<ApiResponse> {
    return this.request(`/inventory/technician/return/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async confirmInstallation(itemId: string): Promise<ApiResponse> {
    return this.request(`/inventory/customer/confirm/${itemId}`, {
      method: "PUT",
    })
  }

  async createLeaveRequest(
    technicianId: string,
    data: {
      leaveType: string
      startDate: string
      endDate: string
      reason: string
      documents?: string[]
    },
  ): Promise<ApiResponse> {
    return this.request(`/leave/requests/${technicianId}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAllLeaveRequests(): Promise<any[]> {
    const response = await this.request<any[]>("/leave/requests")
    return response.data || (response as any[])
  }

  async getTechnicianLeaveRequests(technicianId: string): Promise<any[]> {
    const response = await this.request<any[]>(`/leave/requests/my/${technicianId}`)
    return response.data || (response as any[])
  }

  async updateLeaveRequest(
    leaveId: string,
    data: {
      reason?: string
      endDate?: string
    },
  ): Promise<ApiResponse> {
    return this.request(`/leave/requests/${leaveId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async approveLeaveRequest(leaveId: string): Promise<ApiResponse> {
    return this.request(`/leave/requests/${leaveId}/approve`, {
      method: "PUT",
    })
  }

  async rejectLeaveRequest(leaveId: string): Promise<ApiResponse> {
    return this.request(`/leave/requests/${leaveId}/reject`, {
      method: "PUT",
    })
  }

  async deleteLeaveRequest(leaveId: string): Promise<ApiResponse> {
    return this.request(`/leave/requests/${leaveId}`, {
      method: "DELETE",
    })
  }

  async addProduct(data: {
    name: string
    category: string
    price: number
    description: string
    specifications: any
    images: string[]
  }): Promise<ApiResponse> {
    return this.request("/products/add", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getProducts(): Promise<any[]> {
    const response = await this.request<any[]>("/products")
    return response.data || (response as any[])
  }

  async getProductCatalog(): Promise<any[]> {
    const response = await this.request<any[]>("/products/catalog")
    return response.data || (response as any[])
  }

  async placeOrder(data: {
    productId: string
    quantity: number
    vendorId: string
  }): Promise<ApiResponse> {
    return this.request("/order/Places", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getOrders(): Promise<any[]> {
    const response = await this.request<any[]>("/orders")
    return response.data || (response as any[])
  }

  async updateOrderStatus(
    orderId: string,
    data: {
      status: string
      trackingNumber?: string
      estimatedDelivery?: string
    },
  ): Promise<ApiResponse> {
    return this.request(`/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async getStockAlerts(): Promise<any[]> {
    const response = await this.request<any[]>("/stock/alerts")
    return response.data || (response as any[])
  }

  async getStockMovements(): Promise<any[]> {
    const response = await this.request<any[]>("/inventory/stock/movements")
    return response.data || (response as any[])
  }

  async stockAdjustment(data: {
    itemId: string
    adjustment: number
    reason: string
  }): Promise<ApiResponse> {
    return this.request("/stock/adjustment", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCategories(): Promise<any[]> {
    const response = await this.request<any[]>("/stock/categories")
    return response.data || (response as any[])
  }

  async addCategory(data: {
    name: string
    description: string
  }): Promise<ApiResponse> {
    return this.request("/stock/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAllStockProducts(): Promise<any[]> {
    const response = await this.request<any[]>("/inventory/stock/products")
    return response.data || (response as any[])
  }

  async addStockItem(data: {
    itemName: string
    quantity: number
    supplier: string
    unitPrice: number
    category: string
    brand: string
    phoneNumber?: string
    description?: string
    specification?: string
    ModelNumber?: string
    costPrice?: number
    sellingPrice?: number
    ProductImage?: string
    warantyInfo?: string
    discount?: string
    rating?: number
    unitType?: string
    sold?: number
    status?: string
    role: string
  }): Promise<ApiResponse> {
    return this.request("/inventory/stock/add", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateStockItem(
    id: string,
    data: {
      quantity?: number
      unitPrice?: number
      status?: string
      role: string
    },
  ): Promise<ApiResponse> {
    return this.request(`/inventory/update/stock/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteStockItem(id: string, role: string): Promise<ApiResponse> {
    return this.request(`/inventory/delete/stock/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ role }),
    })
  }

  async issueStockToOperator(data: {
    operatorId: string
    items: Array<{
      itemId: string
      quantity: number
    }>
  }): Promise<ApiResponse> {
    return this.request("/inventory/stock/issue", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAllIssuances(): Promise<any[]> {
    const response = await this.request<any[]>("/inventory/stock/issuance/all")
    return response.data || (response as any[])
  }

  async getSpecificIssuance(issueId: string): Promise<any> {
    const response = await this.request(`/inventory/stock/issuance/${issueId}`)
    return response.data || (response as any)
  }

  async updateIssuanceStatus(issueId: string, status: string): Promise<ApiResponse> {
    return this.request(`/inventory/stock/issuance/${issueId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  async getOperatorIssuances(operatorId: string): Promise<any[]> {
    const response = await this.request(`/inventory/stock/issuance/operator/${operatorId}`)
    return response.data || (response as any[])
  }

  async assignStockToTechnicianNew(data: {
    operatorId: string
    technicianId: string
    itemId: string
    quantity: number
    issueId: string
    role: string
  }): Promise<ApiResponse> {
    return this.request("/inventory/stock/assign/technician", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getTechnicianStock(technicianId: string): Promise<any> {
    const response = await this.request(`/inventory/stock/assign/technician/${technicianId}`)
    return response.data || (response as any)
  }

  async returnStockFromTechnician(
    itemId: string,
    data: {
      operatorId: string
      technicianId: string
      quantity: number
      issueId: string
      role: string
    },
  ): Promise<ApiResponse> {
    return this.request(`/inventory/stock/technician/return/${itemId}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async installItemToCustomer(data: {
    technicianId: string
    customerId: string
    itemId: string
    quantity: number
    role: string
    installStatus: string
  }): Promise<ApiResponse> {
    return this.request("/inventory/stock/technician/install", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCustomerInstallations(customerId: string): Promise<any[]> {
    const response = await this.request(`/inventory/stock/customer/${customerId}/installations`)
    return response.data || (response as any[])
  }

  async updateInstallationStatus(installId: string, newStatus: string): Promise<ApiResponse> {
    return this.request(`/inventory/stock/customer/installation/${installId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ newStatus }),
    })
  }

  async getAnalyticsOverview(): Promise<any> {
    return this.request("/analytics/overview")
  }

  async getAnalyticsRevenue(params?: any): Promise<any> {
    return this.request("/analytics/revenue", { method: "GET", params })
  }

  async getAnalyticsOperators(params?: any): Promise<any> {
    return this.request("/analytics/operators", { method: "GET", params })
  }

  async getAnalyticsTechnicians(params?: any): Promise<any> {
    return this.request("/analytics/technicians", { method: "GET", params })
  }

  async getAnalyticsInventory(params?: any): Promise<any> {
    return this.request("/analytics/inventory", { method: "GET", params })
  }

  async getAnalyticsComplaints(params?: any): Promise<any> {
    return this.request("/analytics/complaints", { method: "GET", params })
  }

  async getAnalyticsMarketplace(params?: any): Promise<any> {
    return this.request("/analytics/marketplace", { method: "GET", params })
  }

  async exportAnalyticsReport(data: any): Promise<ApiResponse> {
    return this.request("/analytics/export", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async scheduleAnalyticsReport(data: any): Promise<ApiResponse> {
    return this.request("/analytics/schedule", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAllProducts(): Promise<any[]> {
    const response = await this.request<any[]>("/inventory/stock/products")
    return response.data || (response as any[])
  }

  async getProduct(id: string): Promise<any> {
    const response = await this.request(`/inventory/stock/products/${id}`)
    return response.data || (response as any)
  }

  async createProduct(data: any): Promise<ApiResponse> {
    return this.request("/inventory/stock/add", {
      method: "POST",
      body: JSON.stringify(data),
    })  
  }

  async updateProduct(id: string, data: any): Promise<ApiResponse> {
    return this.request(`/inventory/update/stock/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    })
  }

  async searchProducts(query: string): Promise<any[]> {
    const response = await this.request(`/products/search?q=${encodeURIComponent(query)}`)
    return response.data || (response as any[])
  }

  async getProductsByCategory(category: string): Promise<any[]> {
    const response = await this.request(`/products/category/${category}`)
    return response.data || (response as any[])
  }

  isTokenValid(): boolean {
    if (!this.token) return false

    try {
      // Basic JWT token validation (check if it's not expired)
      const payload = JSON.parse(atob(this.token.split(".")[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp > currentTime
    } catch {
      return false
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

export const authApi = {
  login: (email: string, password: string) => apiClient.login(email, password),
  registerAdmin: (data: any) => apiClient.registerAdmin(data),
}

export const adminApi = {
  getAll: () => apiClient.getAllAdmins(),
  add: (data: any) => apiClient.addAdmin(data),
  get: (id: string) => apiClient.getAdmin(id),
  update: (id: string, data: any) => apiClient.updateAdmin(id, data),
  delete: (id: string) => apiClient.deleteAdmin(id),
}

export const operatorApi = {
  getAll: () => apiClient.getAllOperators(),
  add: (data: any) => apiClient.addOperator(data),
  get: (id: string) => apiClient.getOperator(id),
  getProfile: (id: string) => apiClient.getOperatorProfile(id),
  update: (id: string, data: any) => apiClient.updateOperator(id, data),
  delete: (id: string) => apiClient.deleteOperator(id),
}

export const technicianApi = {
  getAll: () => apiClient.getAllTechnicians(),
  add: (data: any) => apiClient.addTechnician(data),
  get: (id: string) => apiClient.getTechnician(id),
  getProfile: (id: string) => apiClient.getTechnicianProfile(id),
  update: (id: string, data: any) => apiClient.updateTechnician(id, data),
  delete: (id: string) => apiClient.deleteTechnician(id),
}

export const staffApi = {
  getAll: () => apiClient.getAllStaff(),
  add: (data: any) => apiClient.addStaff(data),
  get: (id: string) => apiClient.getStaff(id),
  update: (id: string, data: any) => apiClient.updateStaff(id, data),
  delete: (id: string) => apiClient.deleteStaff(id),
  getProfile: (id: string) => apiClient.getStaffProfile(id),
}

export const vendorApi = {
  getAll: () => apiClient.getAllVendors(),
  add: (data: any) => apiClient.addVendor(data),
  get: (id: string) => apiClient.getVendor(id),
  update: (id: string, data: any) => apiClient.updateVendor(id, data),
  delete: (id: string) => apiClient.deleteVendor(id),
  getProfile: (id: string) => apiClient.getVendorProfile(id),
  getProducts: (vendorId: string) => apiClient.getVendorProducts(vendorId),
  addProduct: (data: any) => apiClient.addVendorProduct(data),
  updateProduct: (id: string, data: any) => apiClient.updateVendorProduct(id, data),
  deleteProduct: (id: string) => apiClient.deleteVendorProduct(id),
  getOrders: (vendorId: string) => apiClient.getVendorOrders(vendorId),
  updateOrderStatus: (orderId: string, status: string, trackingId?: string) =>
    apiClient.updateOrderStatusVendor(orderId, status, trackingId),
}

export const customerApi = {
  getAll: () => apiClient.getAllCustomers(),
  add: (data: any) => apiClient.addCustomer(data),
  get: (id: string) => apiClient.getCustomer(id),
  update: (id: string, data: any) => apiClient.updateCustomer(id, data),
  delete: (id: string) => apiClient.deleteCustomer(id),
  getProfile: (id: string) => apiClient.getCustomerProfile(id),
}

export const complaintApi = {
  getAll: () => apiClient.getAllComplaints(),
  add: (data: any) => apiClient.addComplaint(data),
  update: (id: string, data: any) => apiClient.updateComplaint(id, data),
  delete: (id: string) => apiClient.deleteComplaint(id),
}

export const vendorProductApi = {
  getAll: (vendorId: string) => apiClient.getVendorProducts(vendorId),
  add: (data: any) => apiClient.addVendorProduct(data),
  update: (id: string, data: any) => apiClient.updateVendorProduct(id, data),
  delete: (id: string) => apiClient.deleteVendorProduct(id),
}

export const vendorOrderApi = {
  getAll: (vendorId: string) => apiClient.getVendorOrders(vendorId),
  updateStatus: (orderId: string, status: string, trackingId?: string) =>
    apiClient.updateOrderStatusVendor(orderId, status, trackingId),
}

export const marketplaceApi = {
  getProducts: () => apiClient.getMarketplaceProducts(),
  createOrder: (data: any) => apiClient.createMarketplaceOrder(data),
  getOrders: () => apiClient.getMarketplaceOrders(),
  updateOrder: (orderId: string, data: any) => apiClient.updateMarketplaceOrder(orderId, data),
};

export const notificationApi = {
  getAll: (userId: string) => apiClient.getNotifications(userId),
  markRead: (id: string) => apiClient.markNotificationRead(id),
  send: (data: any) => apiClient.sendNotification(data),
}

export const billingApi = {
  getHistory: (customerId: string) => apiClient.getBillingHistory(customerId),
  generateInvoice: (customerId: string, data: any) => apiClient.generateInvoice(customerId, data),
  processPayment: (data: any) => apiClient.processPayment(data),
}

export const inventoryApi = {
  getAllStockProducts: () => apiClient.getAllStockProducts(),
  addStockItem: (data: any) => apiClient.addStockItem(data),
  updateStockItem: (id: string, data: any) => apiClient.updateStockItem(id, data),
  deleteStockItem: (id: string, role: string) => apiClient.deleteStockItem(id, role),

  issueStockToOperator: (data: any) => apiClient.issueStockToOperator(data),
  getAllIssuances: () => apiClient.getAllIssuances(),
  getSpecificIssuance: (issueId: string) => apiClient.getSpecificIssuance(issueId),
  updateIssuanceStatus: (issueId: string, status: string) => apiClient.updateIssuanceStatus(issueId, status),
  getOperatorIssuances: (operatorId: string) => apiClient.getOperatorIssuances(operatorId),

  assignStockToTechnician: (data: any) => apiClient.assignStockToTechnicianNew(data),
  getTechnicianStock: (technicianId: string) => apiClient.getTechnicianStock(technicianId),

  returnStockFromTechnician: (itemId: string, data: any) => apiClient.returnStockFromTechnician(itemId, data),

  installItemToCustomer: (data: any) => apiClient.installItemToCustomer(data),
  getCustomerInstallations: (customerId: string) => apiClient.getCustomerInstallations(customerId),
  updateInstallationStatus: (installId: string, newStatus: string) =>
    apiClient.updateInstallationStatus(installId, newStatus),

  confirmInstallation: (id: string) => apiClient.confirmInstallation(id),

  getStockMovements: () => apiClient.getStockMovements(),

  addStock: (data: any) => apiClient.addStock(data),
  assignToTechnician: (itemId: string, data: any) => apiClient.assignStockToTechnician(itemId, data),
  returnItems: (itemId: string, data: any) => apiClient.returnItems(itemId, data),
}

export const orderApi = {
  create: (data: any) => apiClient.createOrder(data),
  getAll: () => apiClient.getAllOrders(),
  getSingle: (orderId: string) => apiClient.getOrder(orderId),
  update: (orderId: string, data: any) => apiClient.updateOrder(orderId, data),
  delete: (orderId: string) => apiClient.deleteOrder(orderId),
  place: (data: any) => apiClient.placeOrder(data),
  updateStatus: (orderId: string, data: any) => apiClient.updateOrderStatus(orderId, data),
}

export const analyticsApi = {
  getOverview: () => apiClient.getAnalyticsOverview(),
  getRevenue: (params?: any) => apiClient.getAnalyticsRevenue(params),
  getOperators: (params?: any) => apiClient.getAnalyticsOperators(params),
  getTechnicians: (params?: any) => apiClient.getAnalyticsTechnicians(params),
  getInventory: (params?: any) => apiClient.getAnalyticsInventory(params),
  getComplaints: (params?: any) => apiClient.getAnalyticsComplaints(params),
  getMarketplace: (params?: any) => apiClient.getAnalyticsMarketplace(params),
  exportReport: (data: any) => apiClient.exportAnalyticsReport(data),
  scheduleReport: (data: any) => apiClient.scheduleAnalyticsReport(data),
}

export const productApi = {
  getAll: () => apiClient.getMarketplaceProducts(),
  add: (data: any) => apiClient.addMarketplaceProduct(data),
  get: (id: string) => apiClient.getProduct(id),
  create: (data: any) => apiClient.createProduct(data), // This should be used instead of "add"
  update: (id: string, data: any) => apiClient.updateProduct(id, data),
  delete: (id: string) => apiClient.deleteProduct(id),
  search: (query: string) => apiClient.searchProducts(query),
  getByCategory: (category: string) => apiClient.getProductsByCategory(category),
};

export const leaveApi = {
  create: (technicianId: string, data: any) => apiClient.createLeaveRequest(technicianId, data),
  getAll: () => apiClient.getAllLeaveRequests(),
  getTechnicianRequests: (technicianId: string) => apiClient.getTechnicianLeaveRequests(technicianId),
  update: (leaveId: string, data: any) => apiClient.updateLeaveRequest(leaveId, data),
  approve: (leaveId: string) => apiClient.approveLeaveRequest(leaveId),
  reject: (leaveId: string) => apiClient.rejectLeaveRequest(leaveId),
  delete: (leaveId: string) => apiClient.deleteLeaveRequest(leaveId),
}

export default apiClient
