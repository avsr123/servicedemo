const API_BASE_URL = 'http://54.236.64.216:5000';

const request = async (url, method = 'GET', payload = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(method !== 'GET' && payload && { body: JSON.stringify(payload) })
    };

    let finalUrl = `${API_BASE_URL}${url}`;
    if (method === 'GET' && payload) {
      const queryParams = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      finalUrl += `?${queryParams.toString()}`;
    }

    const response = await fetch(finalUrl, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error.message);
    throw new Error(`API Error: ${error.message}`);
  }
};

// User Authentication APIs
export const loginUser = async (email, password) => {
  return await request('/user/login_pass', 'POST', { email, password });
};

export const registerUserWithOtp = async (name, mobile) => {
  return await request('/user/signup', 'POST', { name, mobile });
};

export const registerUser = async (firstName, lastName, email, username, password, phoneNumber) => {
  return await request('/user/signup', 'POST', {
    firstName, lastName, email, username, password, phoneNumber
  });
};

export const getUserById = async (userId) => {
  return await request(`/user/${userId}`, 'GET');
};

// Category Management APIs
export const createCategory = async (name, description, imageId, catLevel, imageJson, parentCategory, createdBy) => {
  return await request('/categories', 'POST', {
    name, description, imageId, catLevel, imageJson, parentCategory, createdBy
  });
};

export const getCategories = async (page = 1, limit = 10, catLevel = 1, parentCategory = '', sort = 'priority') => {
  return await request('/categories/all', 'GET', {
    page, limit, catLevel, parentCategory, sort
  });
};

export const getSubCategories = async (page = 1, limit = 10, parentCategory) => {
  return await request('/categories/sub', 'POST', {
    page, limit, catLevel: 2, parentCategory, sort: 'priority'
  });
};

export const getCategoryById = async (categoryId) => {
  return await request(`/categories/${categoryId}`, 'GET');
};

// Manager/Admin/Employee APIs
export const createManager = async (firstName, lastName, email, phoneNumber, username, password, role) => {
  return await request('/manager/create', 'POST', {
    firstName, lastName, email, phoneNumber, username, password, role
  });
};

export const loginManager = async (email, password, role) => {
  return await request('/manager/login', 'POST', { email, password, role });
};

export const getAuthInfo = async (id, role) => {
  return await request('/manager/getAuthInfo', 'POST', { id, role });
};

export const updateAdminRole = async (id, role) => {
  return await request('/manager/updateAdminRole', 'POST', { id, role });
};

// Subscription APIs
export const createSubscriptionPlan = async (name, price, duration, features, status, userId) => {
  return await request('/subscription/plans', 'POST', {
    name, price, duration, features, status, userId
  });
};

export const getAllSubscriptions = async () => {
  return await request('/subscription/plans', 'GET');
};

export const getSubscriptionById = async (id) => {
  return await request(`/subscription/plans/${id}`, 'GET');
};

export const updateSubscription = async (id, price, duration, features, status, userId) => {
  return await request(`/subscription/plans/${id}`, 'PUT', {
    price, duration, features, status, userId
  });
};

// Image Management APIs
export const uploadImage = async (metadata, createdBy, categories = true, profile = false, services = false, 
  background = false, thumbnail = false, gallery = false, folderName) => {
  return await request('/images/upload', 'POST', {
    metadata, createdBy, categories, profile, services, background, 
    thumbnail, gallery, folderName
  });
};

export const getImage = async (id) => {
  return await request('/images/', 'GET', { id });
};

// Services APIs
export const createService = async (name, description, imageId, imageJson, categoryIds, timeDuration, 
  priority, status, serviceLevel, tag, galleryImageIds, createdBy) => {
  return await request('/services/create', 'POST', {
    name, description, imageId, imageJson, categoryIds, timeDuration, 
    priority, status, serviceLevel, tag, galleryImageIds, createdBy
  });
};

export const getServiceById = async (servicesId) => {
  return await request('/services/getservice', 'POST', { servicesId });
};

export const getServicesByCategoryId = async (categoryId) => {
  return await request('/services/getServicesByCategoryId', 'POST', { categoryId });
};

// Cart APIs
export const addToCart = async (userId, services) => {
  return await request('/cart/add', 'POST', { userId, services });
};

export const removeQuantityFromCart = async (userId, serviceId, quantity) => {
  return await request('/cart/removeQuantity', 'POST', { userId, serviceId, quantity });
};

export const getCartByUserId = async (userId) => {
  return await request('/cart/getCartByUserId', 'POST', { userId });
};

export const cleanupCart = async (userId) => {
  return await request('/cart/remove', 'POST', { userId });
};

// Order APIs
export const createOrder = async (userId) => {
  return await request('/orders/buy', 'POST', { userId });
};

// Promotion APIs
export const createPromotion = async (started, end, services, type, status, createdBy) => {
  return await request('/promotion/create', 'POST', {
    started, end, services, type, status, createdBy
  });
};

export const getPromotionByType = async (type) => {
  return await request('/promotion/getbytype', 'POST', { type });
};

// Favorites APIs
export const addToFavorites = async (userId, serviceId) => {
  return await request('/user/addToFavorites', 'POST', { userId, serviceId });
};

export const removeFromFavorites = async (userId, serviceId) => {
  return await request('/user/removeFromFavorites', 'POST', { userId, serviceId });
};