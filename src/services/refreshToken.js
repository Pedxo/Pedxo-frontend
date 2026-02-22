import authFetch from "../api";

export async function refreshToken() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // if (!storedUser || !storedUser.refreshToken)
  //   throw new Error("No refresh token found");

  // const token = storedUser.token;

  if (!storedUser?.refreshToken) {
    throw new Error("No refresh token found");
  }

  const refreshToken = storedUser.refreshToken;
  try {
    //Use POST (recommended)
    // const response = await authFetch.get(`/auth/refresh-token/${token}`);
    const response = await authFetch.post(`/auth/refresh-token/${refreshToken}`);
    console.log(response);

    //const newAccessToken = response.data;

    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken || refreshToken;

    if (!newAccessToken) throw new Error("No access Token found");

    const updatedUser = {
      ...storedUser,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiration: Date.now() + 1200000,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("token", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    authFetch.defaults.headers.common.Authorization =
      `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (err) {
    // Force full logout cleanup if refresh fails
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    delete authFetch.defaults.headers.common["Authorization"];
    throw new Error(err.messsage || "Failed to refresh Token");
  }
}
