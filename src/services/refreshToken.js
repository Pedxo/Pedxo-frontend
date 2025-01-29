import authFetch from "../api";

export async function refreshToken() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser || !storedUser.refreshToken)
    throw new Error("No refresh token found");

  const token = storedUser.token;
  try {
    const response = await authFetch.get(`/auth/refresh-token/${token}`);
    console.log(response);

    const newAccessToken = response.data;

    if (!newAccessToken) throw new Error("No access Token found");

    const updatedUser = {
      ...storedUser,
      accessToken: newAccessToken,
      accessTokenExpiration: Date.now() + 1200000,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return newAccessToken;
  } catch (err) {
    localStorage.removeItem("user");
    throw new Error(err.messsage || "Failed to refresh Token");
  }
}
