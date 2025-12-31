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
  const response = await authFetch.patch("/contracts/finalize", details);
  return response.data;
}