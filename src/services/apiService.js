import axios from 'axios';

// const BASE_URL = 'https://backend-bill-2.onrender.com';
// const BASE_URL = 'https://backend-bill-1.onrender.com';
const BASE_URL = 'http://localhost:4000';

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

// Auth related API calls
const authAPI = {
  login: (credentials) => {
    return api.post('/login', credentials);
  },
  register: (userData) => {
    return api.post('/register', userData);
  },
  updatePassword: (userData) => {
    return api.put('/updateUserPassword', userData);
  }
};

// Customer related API calls
const customerAPI = {
  getCustomers: () => {
    return api.get('/get-customers');
  },
  addCustomer: (customerData) => {
    return api.post('/add-customer', customerData);
  },
  updateCustomer: (customerId, customerData) => {
    return api.put(`/update-customer/${customerId}`, customerData);
  },
  deleteCustomer: (customerId) => {
    return api.delete(`/delete-customer/${customerId}`);
  }
};

// Product related API calls
const productAPI = {
  getProducts: () => {
    return api.get('/get-products');
  },
  addProduct: (productData) => {
    return api.post('/add-product', productData);
  },
  updateProduct: (productId, productData) => {
    return api.put(`/update-product/${productId}`, productData);
  },
  deleteProduct: (productId) => {
    return api.delete(`/delete-product/${productId}`);
  },
  deductProductQuantity: (deductData) => {
    return api.put('/deduct-product-quantity', deductData);
  },
  addProductQuantity: (addedData) => {
    return api.put('/add-product-quantity', addedData);
  }
};

// Items/Cart related API calls
const cartAPI = {
  getItems: (customerName) => {
    return api.get(`/get-cart-items/${customerName}`);
  },
  addItem: (itemData) => {
    return api.post('/add-items-to-cart', itemData);
  },
  updateItem: (itemId, itemData) => {
    return api.put(`/update-cart-items/${itemId}`, itemData);
  },
  deleteItem: (itemId) => {
    return api.delete(`/delete-cart-items/${itemId}`);
  }
};

// Reports related API calls
const reportsAPI = {
  getRecentReports: () => {
    return api.get('/recent-sales');
  },

  getReportsByDate: (date) => {
    return api.get(`/reports-by-date/${date}`);
  },

  getReportsByName: (name) => {
    return api.get(`/reports-by-user/${name}`);
  },
  getReportsByProductName: (productName) => {
    return api.get(`/reports-by-product/${productName}`);
  },
  getReportsByPaymentType: (paymentType) => {
    return api.get(`/reports-by-payment-type/${paymentType}`);
  },
  getCashReportByDate: (date) => {
    return api.get(`/get-cash-report/${date}`);
  }
};

// Invoice related API calls
const invoiceAPI = {
  getInvoiceProducts: () => {
    return api.get('/get-invoice-products');
  },

  addInvoice: (data) => {
    return api.post('/add-company-invoice', data);
  },
  getInvoices: () => {
    return api.get('/get-company-invoices');
  },
  // updateInvoiceProduct: (id, data) => {
  //   return api.put(`/update-invoice-product/${id}`, data);
  // },
  // deleteInvoiceProduct: (id) => {
  //   return api.delete(`/delete-invoice-product/${id}`);
  // }
};

// Checkout related API calls
const checkoutAPI = {
  exportToSales: (itemsArray) => {
    return api.post('/add-item-in-reports', { itemsArray });
  },

  deleteItems: (customerName) => {
    return api.delete(`/delete-all-items-in-cart-after-check-out/${customerName}`);
  },

  processPayment: (paymentData) => {
    return api.post('/payment', paymentData);
  },
  processCashPayment: (cashData) => {
    return api.post('/cash-pay', cashData);
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
