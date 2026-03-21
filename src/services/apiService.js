import axios from 'axios';

// const BASE_URL = 'https://backend-bill-2.onrender.com';
const BASE_URL = 'https://backend-bill-1.onrender.com';
// const BASE_URL = 'http://localhost:4000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
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
  getCustomers: (userId) => {
    return api.get(`/get-customers/${userId}`);
  },
  addCustomer: (customerData) => {
    return api.post(`/add-customer`, customerData);
  },
  // updateCustomer: (userId, customerId, customerData) => {
  //   return api.put(`/customer/${userId}/${customerId}`, customerData);
  // },
  // deleteCustomer: (userId, customerId) => {
  //   return api.delete(`/customer/${userId}/${customerId}`);
  // }
};

// Product related API calls
const productAPI = { 
  getProducts: (userId) => {
    return api.get(`/get-products/${userId}`);
  },
  addProduct: (userId, productData) => {
    return api.post(`/add-product/${userId}`, productData);
  },
  // updateProduct: (userId, productId, productData) => {
  //   return api.put(`/product/${userId}/${productId}`, productData);
  // },
  // deleteProduct: (userId, productId) => {
  //   return api.delete(`/product/${userId}/${productId}`);
  // },
  deductProductQuantity: (userId, deductData) => {
    return api.put(`/deduct-product-quantity/${userId}`, deductData);
  },
  addProductQuantity: (userId, addedData) => {
    return api.put(`/add-product-quantity/${userId}`, addedData);
  }
};

// Items/Cart related API calls
const cartAPI = {
  getItems: (userId, customerName) => {
    return api.get(`/get-cart-items/${userId}/${customerName}`);
  },
  addItem: (userId, itemData) => {
    return api.post(`/add-items-to-cart/${userId}`, itemData);
  },
  updateItem: (userId, itemId, itemData) => {
    return api.put(`/update-cart-items/${userId}/${itemId}`, itemData);
  },
  deleteItem: (itemId, userId) => {
    return api.delete(`/delete-cart-items/${parseInt(itemId)}?userId=${userId}`);
  },


};

// Reports related API calls
const reportsAPI = {
  getRecentReports: (userId) => {
    return api.get(`/recent-sales?userId=${userId}`);
  },

  getReportsByDate: (date, userId) => {
    return api.get(`/reports-by-date/${date}?userId=${userId}`);
  },

  getReportsByName: (name, userId) => {
    return api.get(`/reports-by-user/${name}?userId=${userId}`);
  },
  getReportsByProductName: (productName, userId) => {
    return api.get(`/reports-by-product/${productName}?userId=${userId}`);
  },
  getReportsByPaymentType: (paymentType, userId) => {
    return api.get(`/reports-by-payment-type/${paymentType}?userId=${userId}`);
  },
  getCashReportByDate: (date, userId) => {
    return api.get(`/get-cash-report/${date}?userId=${userId}`);
  }
};

// Invoice related API calls
const invoiceAPI = {

  getInvoiceProducts: (userId) => {
    return api.get(`/get-invoice-products/${userId}`);
  },

  addInvoice: (userId, data) => {
    return api.post(`/add-company-invoice/${userId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getInvoices: (userId) => {
    return api.get(`/get-company-invoices/${userId}`);
  },


};

// Checkout related API calls
const checkoutAPI = {
  exportToSales: (userId, itemsArray) => {
    return api.post(`/add-item-in-reports/${userId}`, { itemsArray });
  },

  deleteItems: (customerName, userId) => {
    return api.delete(`/delete-all-items-in-cart-after-check-out/${customerName}/${userId}`);
  },

  processPayment: (userId, paymentData) => {
    return api.post(`/payment/${userId}`, paymentData);
  },
  processCashPayment: (userId, cashData) => {
    return api.post(`/cash-pay/${userId}`, cashData);
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
