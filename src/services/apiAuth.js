import authFetch from "../api";

// Helper function to clear all auth-related storage
const clearAuthStorage = () => {
  localStorage.removeItem("user");
  // Add any other storage mechanisms you use
};

export async function loginUser(details) {
  const response = await authFetch.post("/auth/login", details);

  const accessTokenExpiration = Date.now() + 1200000; // 20 minutes
  const refreshTokenExpiration = Date.now() + 604800000; // 7 days
  
  const userData = {
    accessToken: response?.data?.accessToken,
    refreshToken: response?.data?.result?.refreshToken,
    token: response?.data?.result?.randomToken,
    userName: response.data.result.firstName,
    email: response.data.result.email,
    accessTokenExpiration,
    refreshTokenExpiration
  };

  localStorage.setItem("user", JSON.stringify(userData));
  
  // Set the default auth header if using token-based auth
  if (userData.accessToken) {
    authFetch.defaults.headers.common['Authorization'] = `Bearer ${userData.accessToken}`;
  }

  return response.data;
}

export async function signUpUserAPI(details) {
  const response = await authFetch.post("/auth/signup", details);
  return response.data;
}

export async function logoutUser() {
  try {
    // 1. First try server-side logout if your API has one
    await authFetch.post("/auth/logout");
    
    // 2. Clear client-side storage
    clearAuthStorage();
    
    // 3. Remove auth headers
    delete authFetch.defaults.headers.common['Authorization'];
    
    return "Logged out successfully";
  } catch (error) {
    // Fallback: Force client-side cleanup if server logout fails
    clearAuthStorage();
    delete authFetch.defaults.headers.common['Authorization'];
    return "Logged out (server unavailable)";
  }
}