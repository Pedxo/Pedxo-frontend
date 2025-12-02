import authFetch from "../api";

export async function createContractOne(details) {
  const response = await authFetch.post(`/contracts/personal-info`, details);
  return response?.data;
}

export async function updateFormTwo(details) {
  const response = await authFetch.patch("/contracts/job-details", details);
  return response?.data;
}

export async function updateCompensation(details) {
  const response = await authFetch.patch("/contracts/compensation", details);
  return response.data;
}

export async function postSignature(signature) {
  const response = await authFetch.post("/contracts/signature", signature, {
    headers: {
      "Content-Type": "multi/form-data",
    },
  });
  return response.data;
}

export async function finalizeContract(details){
  console.log("[API] API Call: PATCH /contracts/finalize");
  console.log("Request details:", {
    url: "/contracts/finalize",
    method: "PATCH",
    isFormData: details instanceof FormData,
  });
  
  // Log FormData entries if it's FormData
  if (details instanceof FormData) {
    console.log("[API] FormData entries:");
    for (const [key, value] of details.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }
  } else {
    console.log("Request payload:", details);
  }

  try {
    const response = await authFetch.patch("/contracts/finalize", details);
    console.log("[API] Backend Response Received:");
    console.log("Status:", response.status);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] Backend Request Failed:");
    console.error("Error:", error);
    console.error("Response status:", error?.response?.status);
    console.error("Response data:", error?.response?.data);
    console.error("Request config:", error?.config);
    throw error;
  }
}