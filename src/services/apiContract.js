import authFetch from "../api";
import Cookies from 'js-cookie';

const CONTRACT_DETAILS = 'CONTRACT_DETAILS';

export async function createContractOne(details) {
  const response = await authFetch.post(`/contracts/personal-info`, details);
  Cookies.set(CONTRACT_DETAILS, JSON.stringify(response.data.data), { expires: 3 });
  return response?.data;
}

export async function updateFormTwo({ contractId, ...details }) {
  const response = await authFetch.patch(`/contracts/job-details?contractId=${contractId}`, details);
  return response?.data;
}

export async function updateCompensation({ contractId, ...details }) {
  const response = await authFetch.patch(`/contracts/compensation?contractId=${contractId}`, details);
  return response.data;
}

export async function postSignature({ contractId, signature }) {
  const response = await authFetch.post(`/contracts/signature?contractId=${contractId}`, signature, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function finalizeContract({ contractId, ...details }) {
  const response = await authFetch.patch(`/contracts/finalize?contractId=${contractId}`, details);
  Cookies.remove(CONTRACT_DETAILS);
  return response.data;
}

// Get all contracts for a user
export async function getUserContracts() {
  const response = await authFetch.get(`/contracts/get-user-contracts`);
  return response?.data;
}

// Get a specific contract by ID
export async function getContractById(contractId) {
  const response = await authFetch.get(`/contracts/get-contract?contractId=${contractId}`);
  return response?.data;
}