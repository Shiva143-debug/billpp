import axios from 'axios';

const BASE_URL = 'https://plum-cuboid-crest.glitch.me';

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
    return api.get(`/customer/${userId}`);
  },
  addCustomer: (customerData) => {
    return api.post(`/addCustomer/`, customerData);
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
    return api.get(`/product/${userId}`);
  },
  addProduct: (userId, productData) => {
    return api.post(`/addproduct/${userId}`, productData);
  },
  // updateProduct: (userId, productId, productData) => {
  //   return api.put(`/product/${userId}/${productId}`, productData);
  // },
  // deleteProduct: (userId, productId) => {
  //   return api.delete(`/product/${userId}/${productId}`);
  // },
  deductProductQuantity: (userId, deductData) => {
    return api.put(`/deductProductQuantity/${userId}`, deductData);
  },
  addProductQuantity: (userId, addedData) => {
    return api.put(`/addProductQuantity/${userId}`, addedData);
  }
};

// Items/Cart related API calls
const itemsAPI = {
  getItems: (userId, customerName) => {
    return api.get(`/items/${userId}/${customerName}`);
  },
  addItem: (userId, itemData) => {
    return api.post(`/addItems/${userId}`, itemData);
  },
  updateItem: (userId, itemId, itemData) => {
    return api.put(`/updateItems/${userId}/${itemId}`, itemData);
  },
  deleteItem: (itemId, userId) => {
    return api.delete(`/items/${parseInt(itemId)}?user_id=${userId}`);
  }
};

// Reports related API calls
const reportsAPI = {
  // getReports: (userId) => {
  //   return api.get(`/reports/${userId}`);
  // },
  getReportsByDate: (date, userId) => {
    return api.get(`/salesByDate/${date}?user_id=${userId}`);
  },
  getReportsByName: (name, userId) => {
    return api.get(`/salesByName/${name}?user_id=${userId}`);
  },
  getReportsByProductName: (productName, userId) => {
    return api.get(`/salesByProductName/${productName}?user_id=${userId}`);
  },
  getReportsByPaymentType: (paymentType, userId) => {
    return api.get(`/reportBypayment/${paymentType}?user_id=${userId}`);
  },
  getCashReportByDate: (date, userId) => {
    return api.get(`/cashReport/${date}?user_id=${userId}`);
  }
};

// Invoice related API calls
const invoiceAPI = {
  getInvoice: (userId, invoiceId) => {
    return api.get(`/invoice/${userId}/${invoiceId}`);
  },
  createInvoice: (invoiceData) => {
    return api.post('/invoice', invoiceData);
  },
  addInvoice: (userId, invoiceData) => {
    return api.post(`/addInvoice/${userId}`, invoiceData);
  },
  getInvoices: (userId) => {
    return api.get(`/getInvoice/${userId}`);
  },
  getProductsFromCompanies: (userId) => {
    return api.get(`/getProductsFromCompanies/${userId}`);
  }
};

// Checkout related API calls
const checkoutAPI = {
  exportToSales: (userId, itemsArray) => {
    return api.post(`/exportToSales/${userId}`, { itemsArray });
  },
  deleteItems: (customerName, userId) => {
    return api.delete(`/deleteItems/${customerName}/${userId}`);
  },
  processPayment: (userId, paymentData) => {
    return api.post(`/payment/${userId}`, paymentData);
  },
  processCashPayment: (userId, cashData) => {
    return api.post(`/cashCompleted/${userId}`, cashData);
  }
};



// Export all API services
export {
  authAPI,
  customerAPI,
  productAPI,
  itemsAPI,
  reportsAPI,
  invoiceAPI,
  checkoutAPI
};