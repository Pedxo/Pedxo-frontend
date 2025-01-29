import authFetch from "../api";

export async function loginUser(details) {
  const response = await authFetch.post("/auth/login", details);

  const accessTokenExpiration = Date.now() + 1200000;
  const refreshTokenExpiration = Date.now() + 604800000;
  const accessToken = response?.data?.accessToken;
  const refreshToken = response?.data?.result?.refreshToken;
  const token = response?.data?.result?.randomToken;
  const userName = response.data.result.firstName;
  const email = response.data.result.email;

  const storedUser = {
    accessToken,
    accessTokenExpiration,
    refreshToken,
    refreshTokenExpiration,
    token,
    userName,
    email,
  };

  localStorage.setItem("user", JSON.stringify(storedUser));

  return response?.data;
}

export function logoutUser() {
  return new Promise((resolve) => {
    localStorage.removeItem("user");
    resolve("logged out");
  });
}

