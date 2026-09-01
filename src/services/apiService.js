import axios from 'axios';

const BASE_URL = 'https://backend-bill-1.onrender.com';
// const BASE_URL = 'http://localhost:4000';

export { BASE_URL };

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      config.headers.delete('Content-Type');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // On 401 (expired/invalid token), clear session and redirect to login
    if (error.response?.status === 401) {
      const hadToken = localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (hadToken && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Unwrap backend response body which follows the shape:
// { success: true/false, message: '...', data: [] | {} }
const handleResponse = (response) => {
  const body = response?.data || {};
  return {
    success: body.success !== false,
    message: body.message || 'Success',
    data: body.data ?? null,
  };
};

const handleError = (error) => {
  const body = error?.response?.data || {};
  return {
    success: false,
    message: body.message || error.message || 'Something went wrong',
    data: null,
  };
};

// Auth related API calls
const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  updatePassword: async (userData) => {
    try {
      const response = await api.put('/updateUserPassword', userData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

// Customer related API calls
const customerAPI = {
  getCustomers: async () => {
    try {
      const response = await api.get('/get-customers');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  getAllCustomers: async () => {
    try {
      const response = await api.get('/get-all-customers');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  addCustomer: async (customerData) => {
    try {
      const response = await api.post('/add-customer', customerData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await api.put(`/update-customer/${customerId}`, customerData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  deleteCustomer: async (customerId) => {
    try {
      const response = await api.delete(`/delete-customer/${customerId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

// Product related API calls
const productAPI = {
  getProducts: async () => {
    try {
      const response = await api.get('/get-products');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  getAllProducts: async () => {
    try {
      const response = await api.get('/get-all-products');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  addProduct: async (productData) => {
    try {
      const response = await api.post('/add-product', productData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  //pending
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/update-product/${productId}`, productData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/delete-product/${productId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  deductProductQuantity: async (deductData) => {
    try {
      const response = await api.put('/deduct-product-quantity', deductData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  addProductQuantity: async (addedData) => {
    try {
      const response = await api.put('/add-product-quantity', addedData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

// Items/Cart related API calls
const cartAPI = {
  getItems: async (customerName) => {
    try {
      const response = await api.get(`/get-cart-items/${customerName}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  addItem: async (itemData) => {
    try {
      const response = await api.post('/add-items-to-cart', itemData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  updateItem: async (itemId, itemData) => {
    try {
      const response = await api.put(`/update-cart-items/${itemId}`, itemData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  deleteItem: async (itemId) => {
    try {
      const response = await api.delete(`/delete-cart-items/${itemId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

// Reports related API calls
const reportsAPI = {
  getRecentReports: async () => {
    try {
      const response = await api.get('/recent-sales');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getReportsByDate: async (date) => {
    try {
      const response = await api.get(`/reports-by-date/${date}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getReportsByName: async (name) => {
    try {
      const response = await api.get(`/reports-by-user/${name}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  getReportsByProduct: async (productId) => {
    try {
      const response = await api.get(`/reports-by-product/${productId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  getReportsByPaymentType: async (paymentType) => {
    try {
      const response = await api.get(`/reports-by-payment-type/${paymentType}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  getCashReportByDate: async (date) => {
    try {
      const response = await api.get(`/get-cash-report/${date}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

// Invoice related API calls
const invoiceAPI = {
  addInvoice: async (data) => {
    try {
      const response = await api.post('/add-company-invoice', data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  getInvoices: async () => {
    try {
      const response = await api.get('/get-company-invoices');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  deleteCompanyInvoice: async (invoiceId) => {
    try {
      const response = await api.delete(`/delete-company-invoice/${invoiceId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

// Checkout related API calls
const checkoutAPI = {
  exportToSales: async (itemsArray) => {
    try {
      const response = await api.post('/add-item-in-reports', { itemsArray });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  deleteItems: async (customerName) => {
    try {
      const response = await api.delete(`/delete-all-items-in-cart-after-check-out/${customerName}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  processPayment: async (paymentData) => {
    try {
      const response = await api.post('/payment', paymentData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  processCashPayment: async (cashData) => {
    try {
      const response = await api.post('/cash-pay', cashData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

// Export all API services
export {
  authAPI,
  customerAPI,
  productAPI,
  cartAPI,
  reportsAPI,
  invoiceAPI,
  checkoutAPI
};
