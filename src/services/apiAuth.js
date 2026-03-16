import authFetch from "../api";

// Helper function to clear all auth-related storage
const clearAuthStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};



export async function loginUser(details) {
  const response = await authFetch.post("/auth/login", details);

  const accessToken = response.data.accessToken;
  const refreshToken = response.data.result.refreshToken;

  
  if (!accessToken || !refreshToken) {
    throw new Error("Login failed: access token missing");
  }

  const userData = {
    accessToken,
    refreshToken,
    userName: response.data.result.firstName,
    email: response.data.result.email,
    _id: response.data.result._id,
    userId: response.data.result._id,
    accessTokenExpiration: Date.now() + 20 * 60 * 1000,
  };

  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("token", accessToken); // SINGLE SOURCE
  localStorage.setItem("refreshToken", refreshToken);

  authFetch.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  return userData;
}

// BACKWARD-COMPATIBLE ALIAS 
export const handleLoginDetails = loginUser;


export async function signUpUserAPI(details) {
  const response = await authFetch.post("/auth/signup", details);
  return response.data;
}

export async function logoutUser() {
  try {
    // 1. First try server-side logout if your API has one
    //await authFetch.post("/auth/logout");
    
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